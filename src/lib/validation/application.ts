import { z } from "zod";

/** Current privacy notice version shown next to the consent checkbox. Bump when the notice changes. */
export const CONSENT_VERSION = "privacy-2026-09-draft";

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const optional = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));

/** Mirrors the constraints in supabase/migrations/*_intake.sql so bad input fails before the database. */
export const applicationSchema = z.object({
  idempotencyKey: z.uuid(),
  kind: z.enum(["producer", "partner"]),
  name: text(2, 120),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  organization: optional(160),
  location: text(2, 160),
  summary: text(20, 4000),
  capacity: optional(2000),
  gaps: z.array(text(1, 80)).max(12).default([]),
  goals: optional(2000),
  timeline: optional(200),
  consent: z.literal(true, { error: "Consent is required" }),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0, { error: "Rejected" }).optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
