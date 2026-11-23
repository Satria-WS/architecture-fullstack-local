"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTodo } from "@/features/todos/actions/create-todo";

export function AddTodoForm() {
  const [isPending, startTransition] = React.useTransition();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [showDescription, setShowDescription] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    setErrorMessage(null);
    startTransition(async () => {
      const response = await createTodo({
        title,
        description: description.trim() || undefined,
      });

      if (!response.success) {
        setErrorMessage(response.message);
        return;
      }

      setTitle("");
      setDescription("");
      setShowDescription(false);
    });
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <form onSubmit={handleSubmit} className="space-y-3">
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-2.5 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            className="flex-1"
          />
          <Button type="submit" isLoading={isPending} disabled={!title.trim()}>
            <Plus className="h-4 w-4 mr-1 sm:mr-1.5" />
            <span>Add</span>
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setShowDescription((prev) => !prev)}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            {showDescription ? "- Remove description" : "+ Add description (optional)"}
          </button>
        </div>

        {showDescription && (
          <textarea
            placeholder="Add extra context or notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            rows={2}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
          />
        )}
      </form>
    </div>
  );
}
