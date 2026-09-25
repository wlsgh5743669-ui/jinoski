import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["requested", "confirming", "confirmed", "cancelled"];

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");

  const bookings = await prisma.booking.findMany({
    where: status && VALID_STATUSES.includes(status) ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
