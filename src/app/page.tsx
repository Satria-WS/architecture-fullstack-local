import { Suspense } from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";
import { getSession } from "@/lib/auth";

async function HeaderAuthCta() {
    const session = await getSession();

    if (session) {
        return (
            <Link
                href="/todos"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-colors"
            >
                Go to Dashboard
                <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
                Sign in
            </Link>
            <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-colors"
            >
                Get Started
            </Link>
        </div>
    );
}

async function HeroAuthCta() {
    const session = await getSession();

    if (session) {
        return (
            <Link
                href="/todos"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 font-medium text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all text-base"
            >
                Open Your To-Do List
                <ArrowRight className="h-4 w-4" />
            </Link>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 font-medium text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all text-base"
            >
                Start for free
                <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/80 transition-all text-base"
            >
                Sign in to account
            </Link>
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col">
            {/* Header */}
            <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow dark:bg-white dark:text-zinc-950">
                            <CheckSquare className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Focus To-Do</span>
                    </div>

                    <Suspense fallback={<div className="h-9 w-24 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
                        <HeaderAuthCta />
                    </Suspense>
                </div>
            </header>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    Production-grade Next.js App Router Architecture
                </div>

                <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl text-zinc-950 dark:text-zinc-50">
                    Focus on what matters,{" "}
                    <span className="text-emerald-600 dark:text-emerald-400">one task</span>{" "}
                    at a time.
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                    A minimalist, highly performant task manager with end-to-end security,
                    server actions, and instant reactivity.
                </p>

                <div className="mt-10">
                    <Suspense fallback={<div className="h-11 w-48 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto" />}>
                        <HeroAuthCta />
                    </Suspense>
                </div>

                {/* Feature Cards */}
                <div className="mt-20 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3 text-left">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 mb-4">
                            <Zap className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                            Instant Server Actions
                        </h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Zero-latency updates backed by React 19 transitions and Next.js path revalidations.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 mb-4">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                            Data Isolation & IDOR Proof
                        </h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Every database operation is securely scoped and verified against the authenticated user.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 mb-4">
                            <Layers className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                            Feature Architecture
                        </h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Clean separation of concerns with domain features, thin routing, and reusable primitives.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                Focus To-Do • Built with Next.js App Router, Prisma & Tailwind CSS
            </footer>
        </div>
    );
}
