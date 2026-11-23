import { Suspense } from "react";
import type { Metadata } from "next";
import { getTodos } from "@/features/todos/queries/get-todos";
import { AddTodoForm } from "@/features/todos/components/add-todo-form";
import { TodoList } from "@/features/todos/components/todo-list";
import TodosLoading from "./loading";

export const metadata: Metadata = {
  title: "My Tasks - Focus To-Do",
  description: "Stay organized and productive with your personal task list.",
};

async function TodosFeed() {
  const todos = await getTodos();
  return <TodoList initialTodos={todos} />;
}

export default function TodosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          My Focus List
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Capture tasks, track progress, and get things done.
        </p>
      </div>

      <AddTodoForm />

      <Suspense fallback={<TodosLoading />}>
        <TodosFeed />
      </Suspense>
    </div>
  );
}
