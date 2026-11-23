"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth-schema";
import type { ActionResponse } from "@/types/action-response";

export async function login(
  data: LoginInput
): Promise<ActionResponse<{ userId: string }>> {
  const validation = loginSchema.safeParse(data);

  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0]?.toString() || "form";
      if (!errors[field]) errors[field] = [];
      errors[field].push(issue.message);
    }
    return {
      success: false,
      message: "Invalid input. Please check your credentials.",
      errors,
    };
  }

  const { email, password } = validation.data;

  try {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    await createSession(user.id, user.email, user.name);

    return {
      success: true,
      message: "Logged in successfully!",
      data: { userId: user.id },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during login. Please try again.",
    };
  }
}
