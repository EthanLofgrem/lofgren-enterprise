import type { Metadata } from "next";
import { DraftNotice, Page } from "@/components/site";

export const metadata: Metadata = { title: "Terms (draft)" };

export default function Terms() {
  return (
    <Page eyebrow="Draft" title="Terms of service">
      <DraftNotice>Placeholder awaiting owner and counsel review. These are not final terms.</DraftNotice>
    </Page>
  );
}
