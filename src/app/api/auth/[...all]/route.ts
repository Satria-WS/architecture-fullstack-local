import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.endsWith("/session")) {
    const session = await getSession();
    return NextResponse.json({
      authenticated: !!session,
      user: session,
    });
  }

  return NextResponse.json({
    message: "Auth route active",
  });
}

export async function POST() {
  return NextResponse.json({
    message: "Please use Server Actions for auth mutations.",
  });
}
