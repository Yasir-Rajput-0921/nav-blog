import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import {
  CATEGORIES_QUERY,
  POST_QUERY,
  POSTS_BY_CATEGORY_QUERY,
  POSTS_QUERY,
} from "@/sanity/lib/queries";
import type { BlogCategory, BlogPost } from "@/types/post";

import { formatPostDate } from "./format-post-date";

function isBlogCategory(value: unknown): value is BlogCategory {
  if (!value || typeof value !== "object") {
    return false;
  }

  const row = value as Record<string, unknown>;

  return (
    typeof row._id === "string" &&
    typeof row.title === "string" &&
    typeof row.slug === "string" &&
    typeof row.description === "string"
  );
}

function isBlogPost(value: unknown): value is BlogPost {
  if (!value || typeof value !== "object") {
    return false;
  }

  const row = value as Record<string, unknown>;

  return (
    typeof row._id === "string" &&
    typeof row.id === "string" &&
    typeof row.category === "string" &&
    typeof row.categoryTitle === "string" &&
    typeof row.categoryDescription === "string" &&
    typeof row.tag === "string" &&
    typeof row.title === "string" &&
    typeof row.description === "string" &&
    typeof row.date === "string" &&
    typeof row.imageSrc === "string" &&
    typeof row.imageAlt === "string"
  );
}

function withFormattedDates(posts: BlogPost[]): BlogPost[] {
  return posts.map(function addFormattedDate(post) {
    return {
      ...post,
      date: formatPostDate(post.date),
    };
  });
}

export const getBlogCategories = cache(async function fetchCategories(): Promise<BlogCategory[]> {
  const { data } = await sanityFetch({ query: CATEGORIES_QUERY });

  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(isBlogCategory);
});

export const getAllBlogPosts = cache(async function fetchAllPosts(): Promise<BlogPost[]> {
  const { data } = await sanityFetch({ query: POSTS_QUERY });

  if (!Array.isArray(data)) {
    return [];
  }

  const posts = data.filter(isBlogPost);
  return withFormattedDates(posts);
});

export const getBlogPostsByCategorySlug = cache(async function fetchPostsByCategory(
  categorySlug: string,
): Promise<BlogPost[]> {
  const { data } = await sanityFetch({
    query: POSTS_BY_CATEGORY_QUERY,
    params: { category: categorySlug },
  });

  if (!Array.isArray(data)) {
    return [];
  }

  const posts = data.filter(isBlogPost);
  return withFormattedDates(posts);
});

export const getBlogPostByRoute = cache(async function fetchPostByRoute(
  categorySlug: string,
  postId: string,
): Promise<BlogPost | null> {
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { category: categorySlug, id: postId },
  });

  if (!data || !isBlogPost(data)) {
    return null;
  }

  return {
    ...data,
    date: formatPostDate(data.date),
  };
});
