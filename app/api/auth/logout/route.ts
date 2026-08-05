import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "../../../../lib/session";

export async function POST() {
  await clearSession();
  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  await clearSession();
  const { origin } = new URL(request.url);
  // Redirect back to welcome/profile hub after logging out
  return NextResponse.redirect(`${origin}/welcome`);
}
