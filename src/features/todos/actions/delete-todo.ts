"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { deleteTodoSchema } from "@/features/todos/schemas/todo-schema";
import type { ActionResponse } from "@/types/action-response";

export async function deleteTodo(id: string): Promise<ActionResponse<null>> {
  const session = await getSession();
  if (!session?.id) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  const validation = deleteTodoSchema.safeParse({ id });
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

    await db.todo.delete({
      where: {
        id,
      },
    });

    revalidatePath("/todos");
    return {
      success: true,
      message: "Todo deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return {
      success: false,
      message: "Failed to delete todo.",
    };
  }
}
