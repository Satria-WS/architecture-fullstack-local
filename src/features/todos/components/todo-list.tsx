"use client";

import * as React from "react";
import { TodoItem } from "./todo-item";
import { EmptyState } from "@/components/shared/empty-state";
import type { Todo } from "@/features/todos/types/todo.types";

interface TodoListProps {
  initialTodos: Todo[];
}

type Filter = "all" | "active" | "completed";

export function TodoList({ initialTodos }: TodoListProps) {
  const [filter, setFilter] = React.useState<Filter>("all");

  const filteredTodos = React.useMemo(() => {
    if (filter === "active") return initialTodos.filter((t) => !t.completed);
    if (filter === "completed") return initialTodos.filter((t) => t.completed);
    return initialTodos;
  }, [initialTodos, filter]);

  const { activeCount, completedCount } = React.useMemo(
    () => ({
      activeCount: initialTodos.filter((t) => !t.completed).length,
      completedCount: initialTodos.filter((t) => t.completed).length,
    }),
    [initialTodos]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            All ({initialTodos.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === "active"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === "completed"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {activeCount} {activeCount === 1 ? "task" : "tasks"} remaining
        </p>
      </div>

      {filteredTodos.length === 0 ? (
        <EmptyState
          title={
            filter === "all"
              ? "No tasks yet"
              : filter === "active"
              ? "All caught up!"
              : "No completed tasks yet"
          }
          description={
            filter === "all"
              ? "Add a task using the input form above."
              : filter === "active"
              ? "You have completed all your pending tasks. Awesome work!"
              : "Check off your tasks as you complete them."
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
}
