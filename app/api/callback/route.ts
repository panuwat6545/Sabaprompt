import { NextRequest, NextResponse } from "next/server";
import { setSession } from "../../../lib/session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new NextResponse("Error: Missing authorization code from LINE.", {
      status: 400,
    });
  }

  const channelId = process.env.LINE_CHANNEL_ID;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelId || !channelSecret) {
    return new NextResponse(
      "Error: Server environment variables (LINE_CHANNEL_ID or LINE_CHANNEL_SECRET) are not configured.",
      { status: 500 }
    );
  }

  // Construct dynamic redirect URI matching protocol & host
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host") || "localhost:3000";
  const redirectUri = `${protocol}://${host}/api/callback`;

  try {
    // 1. Exchange authorization code for LINE access token server-to-server
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("client_id", channelId);
    params.append("client_secret", channelSecret);

    const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new NextResponse(
        `LINE OAuth Error: ${tokenData.error_description || tokenData.error}`,
        { status: 400 }
      );
    }

    // 2. Fetch profile from official LINE v2 API using secure bearer token
    const profileResponse = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileResponse.json();

    if (!profileData.userId) {
      return new NextResponse("Error: Failed to fetch user profile from LINE.", {
        status: 400,
      });
    }

    // 3. Encrypt and write to secure HttpOnly cookie (signed ciphertext)
    await setSession({
      line_user_id: profileData.userId,
      display_name: profileData.displayName,
      avatar_url: profileData.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=guest",
      status_message: profileData.statusMessage || "",
    });

    // 4. Redirect to home page with NO query parameters carrying user identity
    const homepageUrl = `${protocol}://${host}/`;
    return NextResponse.redirect(homepageUrl);
  } catch (error: any) {
    console.error("LINE callback secure error:", error);
    return new NextResponse(`Internal Server Error: ${error.message}`, {
      status: 500,
    });
  }
}
