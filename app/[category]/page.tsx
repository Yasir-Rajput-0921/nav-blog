import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import {
  filterPosts,
  getAllCategories,
  getCategoryDescription,
  getCategoryLabel,
  getSafeCategory,
} from "@/data/posts";
import { PostCategory } from "@/types/post";

export const dynamicParams = true;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

function getValidatedCategory(category: string): PostCategory | undefined {
  return getSafeCategory(category);
}

export async function generateStaticParams() {
  return getAllCategories().map(function mapCategory(category) {
    return { category };
  });
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const safeCategory = getSafeCategory(category);

  if (!safeCategory) {
    return {
      title: "Category Not Found | Blog",
      description: "The requested category does not exist.",
    };
  }

  const label = getCategoryLabel(safeCategory);
  const description = getCategoryDescription(safeCategory);

  return {
    title: `${label} Posts | Blog`,
    description,
    alternates: {
      canonical: `/${safeCategory}`,
    },
    openGraph: {
      title: `${label} Posts | Blog`,
      description,
      url: `/${safeCategory}`,
      type: "website",
    },
    twitter: {
      title: `${label} Posts | Blog`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const safeCategory = getValidatedCategory(category);
  const posts = safeCategory ? filterPosts(safeCategory) : [];
  const showNoPostsState = posts.length === 0;

  return (
    <div className="min-h-screen flex flex-col gap-5 pb-8">
      <SiteHeader activeCategory={safeCategory} />

      <main className="mx-auto w-[min(1100px,92%)] pb-10 animate-site-main-in">
        {safeCategory && !showNoPostsState ? (
          <h1 className="sr-only">{`${getCategoryLabel(safeCategory)} posts`}</h1>
        ) : null}
        {showNoPostsState ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">No posts found</h1>
            <p className="mt-3 text-slate-600">
              We could not find posts for this category. Please choose another category from the top menu.
            </p>
          </section>
        ) : (
          <section className="post-grid-fade grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(function renderPost(post) {
              return <PostCard key={post.id} post={post} />;
            })}
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
