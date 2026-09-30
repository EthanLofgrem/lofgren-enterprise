import type { STEPS } from "@/lib/content";

/**
 * What Lofgren Enterprise offers, independent of any payment provider.
 * The rule: joining, meeting, and exploring are free; a team pays only when
 * it chooses a defined service. Prices are not stored here (this repository
 * is public); they come from a price book at quote time. See estimate.ts.
 */

export type StageName = (typeof STEPS)[number]["name"];

/** Whether anyone can use the service today. Nothing is open before launch. */
export type ServiceStatus = "planned" | "open" | "paused";

/** How a paid service is priced. Free services are always "free". */
export type PricingMode = "free" | "complexity_adjusted" | "custom";

export type LofgrenService = {
  id: string;
  name: string;
  stage: StageName;
  status: ServiceStatus;
  pricing: PricingMode;
  summary: string;
  includes: readonly string[];
  excludes: readonly string[];
};

/** Shared boundaries for every paid service. */
const NO_ADVICE = "Legal, tax, accounting, or investment advice";
const NO_OUTCOME = "Any guarantee of a team, customers, revenue, or profit";

export const SERVICES = [
  {
    id: "apply",
    name: "Apply and build your profile",
    stage: "Qualify",
    status: "planned",
    pricing: "free",
    summary: "Tell us what you bring and what you want to build. It takes a few minutes and commits you to nothing.",
    includes: ["Your profile, which you can update", "Consideration for possible teams"],
    excludes: ["A guaranteed review time, match, or team"],
  },
  {
    id: "introductions",
    name: "Opt-in introductions",
    stage: "Discover",
    status: "planned",
    pricing: "free",
    summary: "When there may be a fit, we suggest an introduction. Nothing about you is shared until everyone involved says yes.",
    includes: ["A short reason for each suggested introduction", "The choice to accept, decline, or withdraw at any time"],
    excludes: ["A partnership or any obligation to work together"],
  },
  {
    id: "team-trial",
    name: "Team Trial",
    stage: "Diligence",
    status: "planned",
    pricing: "free",
    summary: "A self-guided, 14-day shared workspace to test whether a team works before anyone pays for support.",
    includes: ["Proposed roles and availability", "The smallest first test worth running", "Open questions and a continue, pause, or close decision"],
    excludes: ["Ownership, a partnership, or a company: none is created"],
  },
  {
    id: "team-readiness",
    name: "Team Readiness",
    stage: "Diligence",
    status: "planned",
    pricing: "complexity_adjusted",
    summary: "A facilitated session that turns a Team Trial into a clear picture of who brings what and what is still unresolved.",
    includes: ["A facilitated readiness session", "A written contribution map and open-question list", "A recommended next step"],
    excludes: [NO_ADVICE, "Checking credentials, licenses, or valuations", NO_OUTCOME],
  },
  {
    id: "launch-blueprint",
    name: "Launch Blueprint",
    stage: "Blueprint",
    status: "planned",
    pricing: "complexity_adjusted",
    summary: "A defined planning sprint that produces the team's plan: roles, first customers, milestones, risks, and a pilot design.",
    includes: ["Roles and responsibilities", "Milestones, risks, and a decision log", "A pilot design with clear measures"],
    excludes: [NO_ADVICE, "Legal documents, ownership splits, or company filings", NO_OUTCOME],
  },
  {
    id: "pilot-support",
    name: "Pilot Support",
    stage: "Pilot",
    status: "planned",
    pricing: "complexity_adjusted",
    summary: "Setup plus time-limited operating support while the team runs a small, real test.",
    includes: ["Pilot setup and scorecard", "A regular check-in rhythm with task and risk tracking", "An end-of-pilot review"],
    excludes: [NO_ADVICE, "Running the business or doing its sales", NO_OUTCOME],
  },
  {
    id: "venture-os",
    name: "Venture Operations",
    stage: "Operate",
    status: "planned",
    pricing: "complexity_adjusted",
    summary: "Ongoing operating support for a business the team formed and owns, under a separate agreement it can end.",
    includes: ["Operating reviews and a decision log", "Task, milestone, and risk tracking", "A shared workspace the business can export"],
    excludes: [NO_ADVICE, "Authority over the business, its money, or its ownership", NO_OUTCOME],
  },
  {
    id: "custom",
    name: "Custom work",
    stage: "Operate",
    status: "planned",
    pricing: "custom",
    summary: "Work outside a defined service, scoped and priced in writing before it starts.",
    includes: ["A written scope and price before any work"],
    excludes: [NO_ADVICE, NO_OUTCOME],
  },
] as const satisfies readonly LofgrenService[];

export type ServiceId = (typeof SERVICES)[number]["id"];

export function findService(id: string): LofgrenService | undefined {
  return SERVICES.find((s) => s.id === id);
}

export const FREE_SERVICES: readonly LofgrenService[] = SERVICES.filter((s) => s.pricing === "free");
export const PAID_SERVICES: readonly LofgrenService[] = SERVICES.filter((s) => s.pricing !== "free");
