import type { Metadata } from "next";
import { CTA, Page, Steps } from "@/components/site";

export const metadata: Metadata = { title: "How it works" };

const STEPS = [
  { title: "Application and call", body: "You apply and we schedule a call to understand your product, capacity, and goals. There is no cost to apply." },
  { title: "Confidentiality first", body: "Before we share any partner's identity or details, both sides sign a confidentiality agreement prepared by counsel." },
  { title: "Partner matching", body: "We look for partners who fit your gaps by capability, location, capacity, and price, and propose introductions. You decide whether to proceed." },
  { title: "Venture blueprint", body: "We draft a blueprint: which partners do what, estimated costs, pricing, margins, a timeline, and proposed terms. Everything in it is a draft until the parties sign agreements reviewed by their own advisers." },
  { title: "Formation and launch", body: "Once agreements are signed, we coordinate launch tasks, documents, and deadlines in a private workspace for the venture's members." },
  { title: "Ongoing management", body: "After launch we track results, surface problems early, and prepare statements under whatever terms the parties agreed." },
] as const;

export default function HowItWorks() {
  return (
    <Page
      eyebrow="How it works"
      title="A structured path from product to launched venture"
      intro="Every venture is different, but the order of steps is not. A person reviews and approves each decision that involves an agreement, money, or an introduction."
    >
      <Steps items={STEPS} />
      <div className="mt-10"><CTA>Start a conversation</CTA></div>
    </Page>
  );
}
