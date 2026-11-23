import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In - Focus To-Do",
  description: "Sign in to manage your tasks effectively.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
      <LoginForm />
    </Suspense>
  );
}
