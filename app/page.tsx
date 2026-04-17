import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import { BLOG_POSTS, getSafeCategory, hasInvalidCategoryQuery } from "@/data/posts";

export const metadata: Metadata = {
  title: "All Posts | Blog",
  description: "Browse all blog posts across Technology, Travel, and Food categories.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "All Posts | Blog",
    description: "Browse all blog posts across Technology, Travel, and Food categories.",
    url: "/",
    type: "website",
  },
  twitter: {
    title: "All Posts | Blog",
    description: "Browse all blog posts across Technology, Travel, and Food categories.",
  },
};

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const hasQueryParams = Object.keys(params).length > 0;

  if (hasQueryParams) {
    if (hasInvalidCategoryQuery(params)) {
      notFound();
    }

    const rawCategory = typeof params.category === "string" ? params.category : undefined;
    const safeCategory = getSafeCategory(rawCategory);

    if (!safeCategory) {
      notFound();
    }

    permanentRedirect(`/${safeCategory}`);
  }

  return (
    <div className="min-h-screen flex flex-col gap-5 pb-8">
      <SiteHeader />

      <main className="mx-auto w-[min(1100px,92%)] pb-10 animate-site-main-in">
        <h1 className="sr-only">All posts</h1>
        <section className="post-grid-fade grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map(function renderPost(post) {
            return <PostCard key={post.id} post={post} />;
          })}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
