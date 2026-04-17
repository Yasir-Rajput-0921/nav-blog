import type { MetadataRoute } from "next";

import { getAllBlogPosts, getBlogCategories } from "@/lib/blog/sanity-data";
import { getSiteUrlString } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrlString();
  const home: MetadataRoute.Sitemap[number] = {
    url: `${origin}/`,
    changeFrequency: "weekly",
    priority: 1,
  };

  const categories = await getBlogCategories();
  const categoryEntries: MetadataRoute.Sitemap = categories.map(function mapCategory(category) {
    return {
      url: `${origin}/${category.slug}`,
      changeFrequency: "weekly",
      priority: 0.85,
    };
  });

  const posts = await getAllBlogPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map(function mapPost(post) {
    return {
      url: `${origin}/${post.category}/${post.id}`,
      changeFrequency: "monthly",
      priority: 0.65,
    };
  });

  return [home, ...categoryEntries, ...postEntries];
}
