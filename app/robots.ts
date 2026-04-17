import type { MetadataRoute } from "next";

import { getSiteUrlString } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrlString();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
