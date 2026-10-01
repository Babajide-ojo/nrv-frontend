import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/onboard",
        "/payments",
        "/sign-in",
        "/sign-up",
        "/forgot-password",
        "/reset-password",
        "/set-password",
        "/verify-account",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
