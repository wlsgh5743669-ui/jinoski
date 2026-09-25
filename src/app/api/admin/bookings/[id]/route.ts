import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["requested", "confirming", "confirmed", "cancelled"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { status, memo } = body as { status?: unknown; memo?: unknown };

  const data: { status?: string; memo?: string | null } = {};

  if (status !== undefined) {
    if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status;
  }

  if (memo !== undefined) {
    if (typeof memo !== "string") {
      return NextResponse.json({ error: "Invalid memo" }, { status: 400 });
    }
    data.memo = memo.trim() || null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.update({ where: { id }, data });
    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
}
