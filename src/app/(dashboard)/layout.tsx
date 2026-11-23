import * as React from "react";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/shared/navbar";

async function DashboardNavbar() {
  const session = await getSession();
  return <Navbar user={session} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Suspense fallback={<header className="h-16 border-b border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/80" />}>
        <DashboardNavbar />
      </Suspense>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
