import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import { buildCategorySlugSet } from "@/lib/blog/category-slugs";
import { getSafeCategorySlug, hasInvalidCategoryQuery } from "@/lib/blog/post-helpers";
import { getAllBlogPosts, getBlogCategories } from "@/lib/blog/sanity-data";

export const metadata: Metadata = {
  title: "All Posts | Blog",
  description: "Browse all blog posts by category.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "All Posts | Blog",
    description: "Browse all blog posts by category.",
    url: "/",
    type: "website",
  },
  twitter: {
    title: "All Posts | Blog",
    description: "Browse all blog posts by category.",
  },
};

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const hasQueryParams = Object.keys(params).length > 0;

  if (hasQueryParams) {
    const categories = await getBlogCategories();
    const categorySlugSet = buildCategorySlugSet(categories);

    if (hasInvalidCategoryQuery(params, categorySlugSet)) {
      notFound();
    }

    const rawCategory = typeof params.category === "string" ? params.category : undefined;
    const safeCategory = getSafeCategorySlug(rawCategory, categorySlugSet);

    if (!safeCategory) {
      notFound();
    }

    permanentRedirect(`/${safeCategory}`);
  }

  const [categories, posts] = await Promise.all([
    getBlogCategories(),
    getAllBlogPosts(),
  ]);

  return (
    <div className="min-h-screen flex flex-col gap-5 pb-8">
      <SiteHeader categories={categories} />

      <main className="mx-auto w-[min(1100px,92%)] pb-10 animate-site-main-in">
        <h1 className="sr-only">All posts</h1>
        <section className="post-grid-fade grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(function renderPost(post, index) {
            return <PostCard key={post._id} post={post} imagePriority={index === 0} />;
          })}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
