"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  updateTodoSchema,
  type UpdateTodoInput,
} from "@/features/todos/schemas/todo-schema";
import type { ActionResponse } from "@/types/action-response";
import type { Todo } from "@/features/todos/types/todo.types";

export async function updateTodo(
  input: UpdateTodoInput
): Promise<ActionResponse<Todo>> {
  // 1. Verify the user is authenticated
  const session = await getSession();
  if (!session?.id) {
    return {
      success: false,
      message: "You must be signed in to update a todo.",
    };
  }

  // 2. Validate the incoming input with Zod
  const validation = updateTodoSchema.safeParse(input);
  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0]?.toString() || "form";
      if (!errors[field]) errors[field] = [];
      errors[field].push(issue.message);
    }
    return {
      success: false,
      message: "Please fix the validation errors.",
      errors,
    };
  }

  const { id, title, description } = validation.data;

  try {
    // 3. IDOR check: verify the todo belongs to the authenticated user
    const existing = await db.todo.findFirst({
      where: {
        id,
        userId: session.id, // ← ownership enforced — user can't edit another user's todo
      },
    });

    if (!existing) {
      return {
        success: false,
        message: "Todo not found or unauthorized.",
      };
    }

    // 4. Perform the UPDATE
    const updated = await db.todo.update({
      where: { id },
      data: {
        title,
        description: description?.trim() || null,
      },
    });

    // 5. Revalidate the page cache so the new data appears instantly
    revalidatePath("/todos");

    return {
      success: true,
      message: "Todo updated successfully!",
      data: updated,
    };
  } catch (error) {
    console.error("Failed to update todo:", error);
    return {
      success: false,
      message: "Failed to update todo. Please try again.",
    };
  }
}
