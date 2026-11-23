"use client";

import * as React from "react";
import { Check, Trash2, Pencil, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleTodo } from "@/features/todos/actions/toggle-todo";
import { deleteTodo } from "@/features/todos/actions/delete-todo";
import { updateTodo } from "@/features/todos/actions/update-todo";
import type { Todo } from "@/features/todos/types/todo.types";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  // --- Transition states for each async operation ---
  const [isToggling, startToggleTransition] = React.useTransition();
  const [isDeleting, startDeleteTransition] = React.useTransition();
  const [isSaving, startSaveTransition] = React.useTransition();

  // --- Edit mode state ---
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(todo.title);
  const [editDescription, setEditDescription] = React.useState(
    todo.description ?? ""
  );
  const [editError, setEditError] = React.useState<string | null>(null);

  // Focus the title input when edit mode opens
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditing]);

  // Cancel edit: restore original values
  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? "");
    setEditError(null);
    setIsEditing(false);
  };

  // Save edit: call Server Action
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    startSaveTransition(async () => {
      const response = await updateTodo({
        id: todo.id,
        title: editTitle,
        description: editDescription || undefined,
      });

      if (!response.success) {
        // Show inline error without leaving edit mode
        setEditError(response.message);
        return;
      }

      setIsEditing(false);
    });
  };

  // Handle Escape key to cancel edit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleCancelEdit();
  };

  const handleToggle = () => {
    startToggleTransition(async () => {
      await toggleTodo(todo.id);
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      await deleteTodo(todo.id);
    });
  };

  const isBusy = isToggling || isDeleting || isSaving;

  // ─── EDIT MODE ─────────────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="rounded-lg border border-blue-300 bg-white p-3.5 shadow-sm ring-1 ring-blue-200 dark:border-blue-700 dark:bg-zinc-950 dark:ring-blue-800">
        <form onSubmit={handleSave} className="space-y-2">
          {/* Inline error */}
          {editError && (
            <p className="text-xs text-red-500 dark:text-red-400">{editError}</p>
          )}

          {/* Title input */}
          <input
            ref={titleInputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            placeholder="Todo title..."
            className="w-full rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 text-sm font-medium text-zinc-900 shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-100 dark:focus-visible:ring-zinc-300"
          />

          {/* Description textarea */}
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            placeholder="Description (optional)..."
            rows={2}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 text-xs text-zinc-600 shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:focus-visible:ring-zinc-300"
          />

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-0.5">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-auto">
              Press Esc to cancel
            </span>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !editTitle.trim()}
              className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              {isSaving ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ─── VIEW MODE ─────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "group flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3.5 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700",
        todo.completed && "bg-zinc-50/60 dark:bg-zinc-900/40",
        isBusy && "opacity-60 pointer-events-none"
      )}
    >
      {/* Left: checkbox + text */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Completion checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
            todo.completed
              ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500"
              : "border-zinc-300 hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-400"
          )}
        >
          {todo.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </button>

        {/* Title + Description */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-100 break-words",
              todo.completed && "line-through text-zinc-400 dark:text-zinc-500"
            )}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p
              className={cn(
                "mt-1 text-xs text-zinc-500 dark:text-zinc-400 break-words",
                todo.completed &&
                  "line-through text-zinc-400/80 dark:text-zinc-600"
              )}
            >
              {todo.description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Edit + Delete action buttons */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {/* Edit button — disabled for completed todos */}
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={todo.completed}
          aria-label="Edit todo"
          title={todo.completed ? "Complete tasks cannot be edited" : "Edit todo"}
          className="p-1 rounded-md text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 transition-all disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Pencil className="h-4 w-4" />
        </button>

        {/* Delete button */}
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Delete todo"
          className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
