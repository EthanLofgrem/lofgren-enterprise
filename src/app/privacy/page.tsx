import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { DraftNotice, Page } from "@/components/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy notice (draft)",
  description: "Draft privacy notice for Lofgren Enterprise, awaiting review. It will explain what we collect, why, who can see it, and how to delete it.",
  path: "/privacy",
});

export default function Privacy() {
  return (
    <Page eyebrow="Draft" title="Privacy notice">
      <DraftNotice>
        Placeholder awaiting owner and counsel review. This is not a final notice. While the site is in preview, account sign-up is closed and
        nothing you type is stored.
      </DraftNotice>
      <div className="mt-8 max-w-2xl space-y-4 text-muted">
        <p>When accounts open, this notice will explain what we collect when you create an account, why we collect it, who can see your profile, how long we keep it, and how to ask us to change or delete it.</p>
        <p>The consent checkbox on the sign-up form records which version of this notice you agreed to.</p>
      </div>
    </Page>
  );
}
