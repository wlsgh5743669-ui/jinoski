import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // "output: export" disables API routes / middleware (needed by /api/bookings
  // and the /admin auth guard), so it's off while those are built out locally.
  // Re-enable before deploying to GitHub Pages, or switch hosting to a
  // Node-capable target (Vercel etc.) — see README.
  // output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
