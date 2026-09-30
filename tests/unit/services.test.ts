import { describe, expect, it } from "vitest";
import { STEPS } from "@/lib/content";
import { FREE_SERVICES, PAID_SERVICES, SERVICES, findService } from "@/lib/services/catalog";
import { assessComplexity, LEVELS, type ComplexityFactor } from "@/lib/services/complexity";
import { estimate, type PriceBook } from "@/lib/services/estimate";

// Fictional numbers for testing the arithmetic only; real prices are not kept in this repository.
const BOOK: PriceBook = {
  services: {
    "team-readiness": { baseCents: 100_00, floorCents: 80_00 },
    "launch-blueprint": { baseCents: 333_33, floorCents: 300_00 },
  },
  multipliersBp: { standard: 10000, expanded: 15000, complex: 20000 },
};

describe("service catalog", () => {
  it("has unique ids and uses the seven stage names", () => {
    expect(new Set(SERVICES.map((s) => s.id)).size).toBe(SERVICES.length);
    const stages = STEPS.map((s) => s.name) as readonly string[];
    for (const s of SERVICES) expect(stages).toContain(s.stage);
  });

  it("keeps joining, introductions, and the Team Trial free", () => {
    expect(FREE_SERVICES.map((s) => s.id)).toEqual(["apply", "introductions", "team-trial"]);
  });

  it("gives every paid service written boundaries: no advice and no guaranteed outcome", () => {
    expect(PAID_SERVICES.length).toBeGreaterThan(0);
    for (const s of PAID_SERVICES) {
      expect(s.excludes.join(" "), s.id).toMatch(/legal, tax, accounting, or investment advice/i);
      expect(s.excludes.join(" "), s.id).toMatch(/guarantee/i);
    }
  });

  it("offers nothing to buy before launch", () => {
    for (const s of SERVICES) expect(s.status, s.id).toBe("planned");
  });
});

describe("assessComplexity", () => {
  const cases: [string, ComplexityFactor[], string][] = [
    ["digital service", [], "standard"],
    ["real estate photography", ["equipment"], "standard"],
    ["clothing e-commerce", ["inventory", "vendor_dependencies"], "expanded"],
    ["coffee shop", ["physical_location", "equipment", "inventory", "staff", "licenses_permits", "insurance"], "complex"],
    ["property management", ["licenses_permits", "staff", "insurance", "contract_complexity"], "complex"],
    ["pooled-capital real estate", ["passive_investors", "physical_location"], "specialist_review"],
    ["health care practice", ["regulated_activity"], "specialist_review"],
  ];
  it.each(cases)("%s is %s-sized work", (_name, factors, level) => {
    expect(assessComplexity(factors).level).toBe(level);
  });

  it("explains itself with the facts that drove the result", () => {
    const a = assessComplexity(["staff", "physical_location"]);
    expect(a).toEqual({ level: "complex", score: 4, reasons: ["a physical location", "hiring or managing staff"] });
  });

  it("names only the specialist facts when review is required", () => {
    expect(assessComplexity(["passive_investors", "staff"]).reasons).toEqual(["outside or passive investors"]);
  });

  it("never describes a business as safe, legal, or likely to succeed", () => {
    const text = LEVELS.map((l) => l.body).join(" ").toLowerCase();
    for (const word of ["safe", "legal", "compliant", "succeed", "guarantee"]) expect(text).not.toContain(word);
  });
});

describe("estimate", () => {
  it("multiplies in whole cents, rounding half up", () => {
    expect(estimate("launch-blueprint", "expanded", BOOK)).toEqual({ kind: "estimate", cents: 500_00 }); // 333.33 x 1.5 = 499.995
    expect(estimate("team-readiness", "complex", BOOK)).toEqual({ kind: "estimate", cents: 200_00 });
  });

  it("never quotes below the service's minimum", () => {
    const low = { ...BOOK, services: { "team-readiness": { baseCents: 50_00, floorCents: 80_00 } } };
    expect(estimate("team-readiness", "standard", low)).toEqual({ kind: "estimate", cents: 80_00 });
  });

  it("refuses to quote specialist-review ventures automatically", () => {
    expect(estimate("launch-blueprint", "specialist_review", BOOK)).toEqual({ kind: "custom", reason: "specialist_review" });
  });

  it("does not price free, custom, unknown, or unpriced services", () => {
    expect(estimate("team-trial", "standard", BOOK)).toEqual({ kind: "not_priced", reason: "free_service" });
    expect(estimate("custom", "standard", BOOK)).toEqual({ kind: "custom", reason: "custom_service" });
    expect(estimate("nope", "standard", BOOK)).toEqual({ kind: "not_priced", reason: "unknown_service" });
    expect(estimate("pilot-support", "standard", BOOK)).toEqual({ kind: "not_priced", reason: "missing_price" });
  });

  it("rejects a malformed price book instead of quoting", () => {
    const fractional = { ...BOOK, services: { "team-readiness": { baseCents: 100.5, floorCents: 80_00 } } };
    const discounting = { ...BOOK, multipliersBp: { ...BOOK.multipliersBp, expanded: 9000 } };
    const noFloor = { ...BOOK, services: { "team-readiness": { baseCents: 100_00, floorCents: 0 } } };
    for (const bad of [fractional, discounting, noFloor]) expect(() => estimate("team-readiness", "standard", bad)).toThrow(/Price book/);
  });

  it("only knows services from the catalog", () => {
    expect(findService("launch-blueprint")?.pricing).toBe("complexity_adjusted");
  });
});
