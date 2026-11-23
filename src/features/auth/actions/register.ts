"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas/auth-schema";
import type { ActionResponse } from "@/types/action-response";

export async function register(
  data: RegisterInput
): Promise<ActionResponse<{ userId: string }>> {
  const validation = registerSchema.safeParse(data);

  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0]?.toString() || "form";
      if (!errors[field]) errors[field] = [];
      errors[field].push(issue.message);
    }
    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors,
    };
  }

  const { name, email, password } = validation.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email address already exists.",
        errors: {
          email: ["Email already in use"],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    await createSession(user.id, user.email, user.name);

    return {
      success: true,
      message: "Account created successfully!",
      data: { userId: user.id },
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message: "Failed to create account. Please try again later.",
    };
  }
}
