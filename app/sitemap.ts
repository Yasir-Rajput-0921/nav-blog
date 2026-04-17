import type { MetadataRoute } from "next";

import { getAllCategories, getAllPostRouteParams } from "@/data/posts";
import { getSiteUrlString } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrlString();
  const home: MetadataRoute.Sitemap[number] = {
    url: `${origin}/`,
    changeFrequency: "weekly",
    priority: 1,
  };

  const categories: MetadataRoute.Sitemap = getAllCategories().map(function mapCategory(category) {
    return {
      url: `${origin}/${category}`,
      changeFrequency: "weekly",
      priority: 0.85,
    };
  });

  const posts: MetadataRoute.Sitemap = getAllPostRouteParams().map(function mapPost(route) {
    return {
      url: `${origin}/${route.category}/${route.postId}`,
      changeFrequency: "monthly",
      priority: 0.65,
    };
  });

  return [home, ...categories, ...posts];
}
