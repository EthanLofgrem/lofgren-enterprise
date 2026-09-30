import type { ComplexityLevel } from "./complexity";
import { findService } from "./catalog";

/**
 * Turns a service and a complexity level into an estimate, in whole cents.
 *
 * Prices live in a price book supplied by the caller, not in this public
 * repository. Multipliers are basis points (10000 = 1.0x) so every step is
 * integer arithmetic. Anything invalid fails closed: no estimate is better
 * than a wrong one.
 */

export type PriceBook = {
  /** Base price and minimum price per paid service, in cents. */
  services: Record<string, { baseCents: number; floorCents: number }>;
  /** Per-level multiplier in basis points; never below 10000 (1.0x). */
  multipliersBp: Record<Exclude<ComplexityLevel, "specialist_review">, number>;
};

export type Estimate =
  | { kind: "estimate"; cents: number }
  | { kind: "custom"; reason: "specialist_review" | "custom_service" }
  | { kind: "not_priced"; reason: "free_service" | "unknown_service" | "missing_price" };

const isWholeCents = (n: number) => Number.isSafeInteger(n) && n >= 0;

/** Throws on a malformed price book so a bad configuration can never produce a quote. */
export function assertPriceBook(book: PriceBook): void {
  for (const [id, p] of Object.entries(book.services)) {
    if (!isWholeCents(p.baseCents) || !isWholeCents(p.floorCents) || p.floorCents === 0) {
      throw new Error(`Price book: ${id} needs whole, positive cents`);
    }
  }
  for (const [level, bp] of Object.entries(book.multipliersBp)) {
    if (!Number.isSafeInteger(bp) || bp < 10000) throw new Error(`Price book: ${level} multiplier must be a whole number of basis points, at least 10000`);
  }
}

export function estimate(serviceId: string, level: ComplexityLevel, book: PriceBook): Estimate {
  assertPriceBook(book);
  const service = findService(serviceId);
  if (!service) return { kind: "not_priced", reason: "unknown_service" };
  if (service.pricing === "free") return { kind: "not_priced", reason: "free_service" };
  if (service.pricing === "custom") return { kind: "custom", reason: "custom_service" };
  if (level === "specialist_review") return { kind: "custom", reason: "specialist_review" };

  const price = book.services[service.id];
  if (!price) return { kind: "not_priced", reason: "missing_price" };
  // Round half up, in integers.
  const scaled = Math.floor((price.baseCents * book.multipliersBp[level] + 5000) / 10000);
  return { kind: "estimate", cents: Math.max(scaled, price.floorCents) };
}
