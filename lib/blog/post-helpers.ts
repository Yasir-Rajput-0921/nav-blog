import type { BlogPost } from "@/types/post";

export function getPostUrl(post: Pick<BlogPost, "category" | "id">): string {
  return `/${post.category}/${post.id}`;
}

export function hasBlogPostCoverImage(post: Pick<BlogPost, "imageSrc">): boolean {
  return post.imageSrc.trim() !== "";
}

export function getBlogPostCoverPlaceholderText(post: Pick<BlogPost, "imageSrc" | "imageAlt">): string {
  if (hasBlogPostCoverImage(post)) {
    return "";
  }

  return post.imageAlt.trim();
}

export function hasInvalidCategoryQuery(
  params: Record<string, string | string[] | undefined>,
  validCategorySlugs: ReadonlySet<string>,
): boolean {
  const queryKeys = Object.keys(params);

  if (queryKeys.length === 0) {
    return false;
  }

  if (queryKeys.some(function isUnknownKey(key) { return key !== "category"; })) {
    return true;
  }

  const categoryValue = params.category;

  if (Array.isArray(categoryValue)) {
    return true;
  }

  if (categoryValue === undefined || categoryValue.trim() === "") {
    return true;
  }

  return !validCategorySlugs.has(categoryValue);
}

export function getSafeCategorySlug(
  value: string | undefined,
  validCategorySlugs: ReadonlySet<string>,
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (!validCategorySlugs.has(value)) {
    return undefined;
  }

  return value;
}
