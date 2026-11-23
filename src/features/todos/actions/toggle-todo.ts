"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toggleTodoSchema } from "@/features/todos/schemas/todo-schema";
import type { ActionResponse } from "@/types/action-response";
import type { Todo } from "@/features/todos/types/todo.types";

export async function toggleTodo(id: string): Promise<ActionResponse<Todo>> {
  const session = await getSession();
  if (!session?.id) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  const validation = toggleTodoSchema.safeParse({ id });
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid todo ID.",
    };
  }

  try {
    const existing = await db.todo.findFirst({
      where: {
        id,
        userId: session.id,
      },
    });

    if (!existing) {
      return {
        success: false,
        message: "Todo not found or unauthorized.",
      };
    }

    const updated = await db.todo.update({
      where: {
        id,
      },
      data: {
        completed: !existing.completed,
      },
    });

    revalidatePath("/todos");
    return {
      success: true,
      message: updated.completed ? "Marked as completed" : "Marked as active",
      data: updated,
    };
  } catch (error) {
    console.error("Failed to toggle todo:", error);
    return {
      success: false,
      message: "Failed to update todo status.",
    };
  }
}
