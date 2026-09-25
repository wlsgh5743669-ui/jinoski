import { NextResponse } from "next/server";
import { getSpreadsheetUrl } from "@/lib/google-sheets";

export async function GET() {
  return NextResponse.json({ url: getSpreadsheetUrl() });
}
