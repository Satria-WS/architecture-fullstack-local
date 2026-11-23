export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md space-y-4 animate-pulse px-4">
        <div className="mx-auto h-10 w-32 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-80 w-full rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />
      </div>
    </div>
  );
}
