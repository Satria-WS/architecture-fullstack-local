import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create an Account - Focus To-Do",
  description: "Sign up to start organizing your life with Focus To-Do.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
