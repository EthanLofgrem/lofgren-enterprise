import type { IconName } from "@/lib/content";

/** Simple line icons (24×24, currentColor). Decorative: always paired with visible text. */
const PATHS: Record<IconName, string> = {
  palette:
    "M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.9 1.2-1.8l-.4-.9c-.5-1 .2-2.3 1.4-2.3H17a4 4 0 0 0 4-4c0-5-4-9-9-9Zm-4.5 9a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm3-4a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-6 9a6 6 0 0 0 12 0M12 18v3m-3 0h6",
  home: "M3 11 12 4l9 7M5 10v10h5v-6h4v6h5V10",
  chart: "M4 20V10m6 10V4m6 16v-7m4 7H2",
  leaf: "M5 19c0-8 5-14 15-15-1 10-7 15-15 15Zm0 0 7-7",
  wrench:
    "M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 0 0 5.2-5.2l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5Z",
  coins: "M12 7c4 0 7-1.3 7-3s-3-3-7-3-7 1.3-7 3 3 3 7 3Zm-7-3v6c0 1.7 3 3 7 3s7-1.3 7-3V4M5 10v6c0 1.7 3 3 7 3s7-1.3 7-3v-6M5 16v4c0 1.7 3 3 7 3s7-1.3 7-3v-4",
  key: "M14 10a4 4 0 1 0-3.5 4l1 1H13v2h2v2h3v-3l-3.5-3.5A4 4 0 0 0 14 10Zm-5-.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  spark: "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6",
  handshake:
    "m3 11 4-4 4 2 3-2 7 5-4 4m-14-5 5 5c.8.8 2 .8 2.8 0M8 12l3 3m-1-5 4 4m1-7-3 2",
  blueprint: "M4 4h16v16H4zM4 9h16M9 9v11M13 13h4m-4 4h4",
  pen: "M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4M13 20h7",
  building: "M4 21V5l8-3v19M12 8l8 3v10M3 21h18M7 8h2m-2 4h2m-2 4h2m7-2h1m-1 3h1",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Zm-3 9 2 2 4-4",
  people:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0 0-6m2 15h3a5 5 0 0 0-4-5",
};

export function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
