import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Todo } from "@/features/todos/types/todo.types";

export async function getTodos(): Promise<Todo[]> {
  const session = await getSession();
  if (!session?.id) {
    return [];
  }

  return db.todo.findMany({
    where: {
      userId: session.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
