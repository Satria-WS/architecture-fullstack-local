"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TodosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Todos page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/40 p-8 text-center dark:border-red-950 dark:bg-red-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Something went wrong!
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mb-4">
        {error.message || "An unexpected error occurred while loading your tasks."}
      </p>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RotateCcw className="h-4 w-4" />
        <span>Try again</span>
      </Button>
    </div>
  );
}
