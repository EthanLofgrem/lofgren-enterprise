import { z } from "zod";
import { CONSENT_VERSION } from "@/lib/consent";

export { CONSENT_VERSION };

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const optional = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));

/** Mirrors the constraints in supabase/migrations/*_intake.sql so bad input fails before the database. */
export const applicationSchema = z.object({
  idempotencyKey: z.uuid(),
  kind: z.enum(["producer", "partner", "member"]),
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
  // Members confirm they are 18 or older; not stored, only checked.
  adult: z.boolean().optional(),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0, { error: "Rejected" }).optional(),
}).superRefine((v, ctx) => {
  if (v.kind === "member" && v.adult !== true) {
    ctx.addIssue({ code: "custom", path: ["adult"], message: "You must be 18 or older to create an account" });
  }
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
