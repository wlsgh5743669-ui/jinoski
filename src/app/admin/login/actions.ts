"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_DURATION_MS,
  createSessionToken,
  verifyPasscode,
} from "@/lib/auth";

export type LoginState = { error: string } | null;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const passcode = String(formData.get("passcode") ?? "");

  if (!verifyPasscode(passcode)) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ADMIN_SESSION_DURATION_MS / 1000),
  });

  redirect("/admin");
}
