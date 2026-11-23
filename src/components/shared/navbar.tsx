"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckSquare, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions/logout";
import type { SessionUser } from "@/features/auth/types/auth.types";

interface NavbarProps {
  user: SessionUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isLoggingOut, startTransition] = React.useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/todos" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow dark:bg-zinc-50 dark:text-zinc-900">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Focus To-Do
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <User className="h-4 w-4" />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {user.name || user.email}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              className="gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
