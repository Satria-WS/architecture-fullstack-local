import * as React from "react";
import Link from "next/link";
import { CheckSquare } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-900 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950">
          <CheckSquare className="h-6 w-6" />
        </div>
        <Link href="/" className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Focus To-Do
        </Link>
      </div>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
