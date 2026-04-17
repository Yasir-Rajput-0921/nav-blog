import type { BlogCategory } from "@/types/post";

export function buildCategorySlugSet(categories: Pick<BlogCategory, "slug">[]): ReadonlySet<string> {
  return new Set(categories.map(function toSlug(category) { return category.slug; }));
}
