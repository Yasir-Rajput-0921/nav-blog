import { client } from "@/sanity/lib/client";

const CATEGORY_SLUGS_FOR_BUILD = `*[_type == "category" && defined(slug.current)].slug.current`;

const POST_ROUTES_FOR_BUILD = `*[_type == "post" && defined(id.current) && defined(category->slug.current)]{
  "category": category->slug.current,
  "postId": id.current
}`;

export async function fetchCategorySlugsForStaticParams(): Promise<string[]> {
  const rows = await client.fetch<string[] | null>(CATEGORY_SLUGS_FOR_BUILD);
  return Array.isArray(rows) ? rows : [];
}

export async function fetchPostRoutesForStaticParams(): Promise<Array<{ category: string; postId: string }>> {
  const rows = await client.fetch<Array<{ category: string; postId: string }> | null>(POST_ROUTES_FOR_BUILD);
  return Array.isArray(rows) ? rows : [];
}
