import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    // Redirect to Google OAuth
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`;
    const scope = "openid profile email";
    
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId || "");
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", scope);
    googleAuthUrl.searchParams.set("state", Math.random().toString(36).substring(7));

    return NextResponse.redirect(googleAuthUrl.toString());
  }

  // Handle OAuth callback
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`;

    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return NextResponse.redirect(`/login?error=${tokenData.error}`);
    }

    // Get user info
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const userData = await userResponse.json();

    // Create user data
    const userInfo = {
      tokenIdentifier: userData.email,
      name: userData.name,
      profileImage: userData.picture,
    };

    // Store in localStorage via redirect with data
    const redirectUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL);
    redirectUrl.searchParams.set("user", JSON.stringify(userInfo));

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect("/login?error=oauth_failed");
  }
}
