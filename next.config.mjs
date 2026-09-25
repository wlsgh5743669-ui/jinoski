import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages needs a static export, which can't include API routes /
  // middleware. The Pages workflow sets STATIC_EXPORT=1 and strips
  // src/app/api, src/app/admin and src/middleware.ts before building; local
  // `npm run dev` keeps them so the admin/booking backend still works.
  ...(process.env.STATIC_EXPORT === "1" ? { output: "export" } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
