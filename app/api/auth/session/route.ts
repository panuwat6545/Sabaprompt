import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/session";

export const revalidate = 0; // Disable static caching for session check

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ loggedIn: false });
  }
  return NextResponse.json({
    loggedIn: true,
    name: session.display_name,
    avatar_url: session.avatar_url,
    status: session.status_message || "",
  });
}
