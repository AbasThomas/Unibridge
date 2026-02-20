import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/supabase/url";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/dashboard";
  const siteUrl = getSiteUrl(origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${siteUrl}${next}`);
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${siteUrl}/auth/login?error=auth_callback_error`);
}
