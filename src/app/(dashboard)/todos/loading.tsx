export default function TodosLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-72 rounded-md bg-zinc-100 dark:bg-zinc-900" />
      </div>

      {/* Form skeleton */}
      <div className="h-20 rounded-xl border border-zinc-200 bg-zinc-100/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/40" />

      {/* Filter tabs skeleton */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div className="h-7 w-16 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-7 w-20 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-7 w-24 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
      </div>

      {/* Items skeleton */}
      <div className="space-y-2">
        <div className="h-14 rounded-lg border border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/50" />
        <div className="h-14 rounded-lg border border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/50" />
        <div className="h-14 rounded-lg border border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/50" />
      </div>
    </div>
  );
}
