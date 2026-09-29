import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "32kb" } },
  // Old pre-launch routes now live under the member model.
  async redirects() {
    return [
      { source: "/apply", destination: "/join", permanent: true },
      { source: "/apply/received", destination: "/join/received", permanent: true },
      { source: "/producers", destination: "/who-can-join", permanent: true },
      { source: "/partners", destination: "/who-can-join", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
