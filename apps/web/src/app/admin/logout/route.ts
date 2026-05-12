import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/admin/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("from") || "/admin/login";

  await clearAdminSession();

  return NextResponse.redirect(new URL(target, request.url));
}
