/**
 * How much support a venture is likely to need, from facts about how it would
 * operate, never from its industry name alone. A coffee shop and a real-estate
 * photography service differ because of location, staff, and permits, not
 * because of a label.
 *
 * The result sizes Lofgren's own work. It is not a judgement that a business
 * is safe, legal, or likely to succeed.
 */

export type ComplexityLevel = "standard" | "expanded" | "complex" | "specialist_review";

/** Facts that add ordinary coordination work, with their weight. */
export const WEIGHTED_FACTORS = {
  physical_location: { label: "a physical location", weight: 2 },
  staff: { label: "hiring or managing staff", weight: 2 },
  licenses_permits: { label: "licenses or permits", weight: 2 },
  capital_intensive: { label: "significant startup costs", weight: 2 },
  equipment: { label: "equipment", weight: 1 },
  inventory: { label: "inventory", weight: 1 },
  insurance: { label: "specific insurance needs", weight: 1 },
  vendor_dependencies: { label: "key suppliers or vendors", weight: 1 },
  contract_complexity: { label: "complex customer or vendor contracts", weight: 1 },
  many_operators: { label: "more than five people operating it", weight: 1 },
  custom_work: { label: "work outside a standard Lofgren service", weight: 1 },
} as const;

/** Facts that require professional review before Lofgren scopes any support. */
export const SPECIALIST_FACTORS = {
  passive_investors: { label: "outside or passive investors" },
  regulated_activity: { label: "a regulated activity, such as health care, financial services, or alcohol" },
} as const;

export type WeightedFactor = keyof typeof WEIGHTED_FACTORS;
export type SpecialistFactor = keyof typeof SPECIALIST_FACTORS;
export type ComplexityFactor = WeightedFactor | SpecialistFactor;

export type ComplexityAssessment = { level: ComplexityLevel; score: number; reasons: string[] };

/** Score thresholds: 0–1 standard, 2–3 expanded, 4+ complex. */
const EXPANDED_AT = 2;
const COMPLEX_AT = 4;

export function assessComplexity(factors: Iterable<ComplexityFactor>): ComplexityAssessment {
  const present = new Set(factors);
  const specialist = (Object.keys(SPECIALIST_FACTORS) as SpecialistFactor[]).filter((f) => present.has(f));
  if (specialist.length) {
    return { level: "specialist_review", score: 0, reasons: specialist.map((f) => SPECIALIST_FACTORS[f].label) };
  }
  const weighted = (Object.keys(WEIGHTED_FACTORS) as WeightedFactor[]).filter((f) => present.has(f));
  const score = weighted.reduce((sum, f) => sum + WEIGHTED_FACTORS[f].weight, 0);
  const level: ComplexityLevel = score >= COMPLEX_AT ? "complex" : score >= EXPANDED_AT ? "expanded" : "standard";
  return { level, score, reasons: weighted.map((f) => WEIGHTED_FACTORS[f].label) };
}

/** Plain-language descriptions of each level, shown to members. */
export const LEVELS = [
  { level: "standard", name: "Standard", body: "A simple service with few people, little equipment, and no location or staff to manage." },
  { level: "expanded", name: "Expanded", body: "More moving parts, such as inventory, suppliers, equipment, or contracts." },
  { level: "complex", name: "Complex", body: "A location, staff, permits, or significant startup costs that need more planning and coordination." },
  {
    level: "specialist_review",
    name: "Specialist review",
    body: "Businesses with outside investors or regulated activities need professional review before we can scope any support.",
  },
] as const satisfies readonly { level: ComplexityLevel; name: string; body: string }[];
