"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

const VALID_STATUSES = ["신청", "확인중", "확정", "취소"] as const;

export async function updateBookingStatus(id: string, status: string) {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Invalid status");
  }
  await prisma.booking.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

export async function updateBookingMemo(id: string, memo: string) {
  await prisma.booking.update({ where: { id }, data: { memo } });
  revalidatePath("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
