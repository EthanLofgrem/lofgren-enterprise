import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { DraftNotice, Page } from "@/components/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms (draft)",
  description: "Draft terms of service for Lofgren Enterprise, awaiting owner and attorney review before the site opens to the public.",
  path: "/terms",
});

export default function Terms() {
  return (
    <Page eyebrow="Draft" title="Terms of service">
      <DraftNotice>Placeholder awaiting owner and counsel review. These are not final terms.</DraftNotice>
    </Page>
  );
}
