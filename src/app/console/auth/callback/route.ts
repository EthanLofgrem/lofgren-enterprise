import { NextResponse, type NextRequest } from "next/server";
import { consoleClient, consoleConfigured } from "@/lib/console/server";

// Completes a sign-in link. Always lands on a fixed console path, never on a
// URL taken from the request, so it can't be used as an open redirect.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code || !consoleConfigured()) return NextResponse.redirect(new URL("/console/sign-in?error=link", request.url));
  const supabase = await consoleClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(error ? "/console/sign-in?error=link" : "/console", request.url));
}
