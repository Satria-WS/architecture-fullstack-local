"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  createTodoSchema,
  type CreateTodoInput,
} from "@/features/todos/schemas/todo-schema";
import type { ActionResponse } from "@/types/action-response";
import type { Todo } from "@/features/todos/types/todo.types";

export async function createTodo(
  input: CreateTodoInput
): Promise<ActionResponse<Todo>> {
  const session = await getSession();
  if (!session?.id) {
    return {
      success: false,
      message: "You must be signed in to create a todo.",
    };
  }

  const validation = createTodoSchema.safeParse(input);
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

  try {
    const todo = await db.todo.create({
      data: {
        title: validation.data.title,
        description: validation.data.description || null,
        userId: session.id,
      },
    });

    revalidatePath("/todos");
    return {
      success: true,
      message: "Todo created successfully!",
      data: todo,
    };
  } catch (error) {
    console.error("Failed to create todo:", error);
    return {
      success: false,
      message: "Failed to create todo. Please try again.",
    };
  }
}
