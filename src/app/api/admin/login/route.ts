import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_DURATION_MS,
  createSessionToken,
  verifyPasscode,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const passcode = (body as { passcode?: unknown })?.passcode;
  if (typeof passcode !== "string" || !verifyPasscode(passcode)) {
    return NextResponse.json({ error: "잘못된 비밀번호입니다" }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_MS / 1000,
  });
  return response;
}
