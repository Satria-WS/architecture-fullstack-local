"use server";

import { revalidatePath } from "next/cache";
import { deleteSession } from "@/lib/auth";
import type { ActionResponse } from "@/types/action-response";

export async function logout(): Promise<ActionResponse<null>> {
  try {
    await deleteSession();
    revalidatePath("/");
    return {
      success: true,
      message: "Logged out successfully.",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Failed to log out cleanly.",
    };
  }
}
