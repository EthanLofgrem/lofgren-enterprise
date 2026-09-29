import type { Metadata } from "next";
import { DraftNotice, Page } from "@/components/site";

export const metadata: Metadata = { title: "Privacy (draft)" };

export default function Privacy() {
  return (
    <Page eyebrow="Draft" title="Privacy policy">
      <DraftNotice>
        Placeholder awaiting owner and counsel review. This is not a final policy. No personal information is
        collected by this preview site.
      </DraftNotice>
    </Page>
  );
}
