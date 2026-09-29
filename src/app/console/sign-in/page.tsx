import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getConsoleAccess } from "@/lib/console/server";
import { ConsoleFrame, ConsoleGate } from "../ui";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Console sign-in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SignIn({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const access = await getConsoleAccess();
  if (access.state === "unconfigured") return <ConsoleGate access={access} />;
  if (access.state === "operator") redirect("/console");
  const linkError = (await searchParams).error === "link";
  return (
    <ConsoleFrame>
      <h1 className="font-serif text-3xl font-semibold">Sign in to the console</h1>
      <p className="mt-3 max-w-xl text-muted">For Lofgren Enterprise operators only. We&apos;ll email you a one-time sign-in link. There is no public sign-up.</p>
      {linkError && (
        <p role="alert" className="mt-4 max-w-md rounded-lg border border-bad/40 p-3 text-sm text-bad">
          That sign-in link didn&apos;t work. It may have expired or already been used. Request a new one.
        </p>
      )}
      <div className="mt-6"><SignInForm /></div>
    </ConsoleFrame>
  );
}
