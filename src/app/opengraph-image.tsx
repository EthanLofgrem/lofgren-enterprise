import { ImageResponse } from "next/og";
import { SITE_HEADLINE, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// Share card for links posted in messages and social apps. Text only, no photos or claims.
export const alt = `${SITE_NAME}: ${SITE_HEADLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STAGES = ["Qualify", "Discover", "Diligence", "Blueprint", "Assemble", "Pilot", "Operate"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#183a32", color: "#faf8f3" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: "#faf8f3", color: "#183a32", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 700 }}>L</div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, letterSpacing: 4, color: "#e3a67a", textTransform: "uppercase" }}>{SITE_TAGLINE}</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>{SITE_HEADLINE}</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#d9e6df" }}>
          {STAGES.map((s, i) => (
            <div key={s} style={{ display: "flex" }}>{`${i + 1}. ${s}`}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
