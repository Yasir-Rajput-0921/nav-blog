import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import { buildCategorySlugSet } from "@/lib/blog/category-slugs";
import { getSafeCategorySlug } from "@/lib/blog/post-helpers";
import { getBlogCategories, getBlogPostsByCategorySlug } from "@/lib/blog/sanity-data";
import { fetchCategorySlugsForStaticParams } from "@/sanity/lib/build-static-params";

export const dynamicParams = true;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const slugs = await fetchCategorySlugsForStaticParams();
  return slugs.map(function mapCategory(slug) {
    return { category: slug };
  });
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = await getBlogCategories();
  const categorySlugSet = buildCategorySlugSet(categories);
  const safeCategory = getSafeCategorySlug(category, categorySlugSet);
  const meta = categories.find(function matchSlug(item) {
    return item.slug === safeCategory;
  });

  if (!safeCategory || !meta) {
    return {
      title: "Category Not Found | Blog",
      description: "The requested category does not exist.",
    };
  }

  return {
    title: `${meta.title} Posts | Blog`,
    description: meta.description,
    alternates: {
      canonical: `/${safeCategory}`,
    },
    openGraph: {
      title: `${meta.title} Posts | Blog`,
      description: meta.description,
      url: `/${safeCategory}`,
      type: "website",
    },
    twitter: {
      title: `${meta.title} Posts | Blog`,
      description: meta.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categories = await getBlogCategories();
  const categorySlugSet = buildCategorySlugSet(categories);
  const safeCategory = getSafeCategorySlug(category, categorySlugSet);

  if (!safeCategory) {
    notFound();
  }

  const posts = await getBlogPostsByCategorySlug(safeCategory);
  const showNoPostsState = posts.length === 0;
  const categoryMeta = categories.find(function findMeta(item) {
    return item.slug === safeCategory;
  });
  const categoryTitle = categoryMeta?.title ?? safeCategory;

  return (
    <div className="min-h-screen flex flex-col gap-5 pb-8">
      <SiteHeader categories={categories} activeCategorySlug={safeCategory} />

      <main className="mx-auto w-[min(1100px,92%)] pb-10 animate-site-main-in">
        {!showNoPostsState ? <h1 className="sr-only">{`${categoryTitle} posts`}</h1> : null}
        {showNoPostsState ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">No posts found</h1>
            <p className="mt-3 text-slate-600">
              We could not find posts for this category. Please choose another category from the top menu.
            </p>
          </section>
        ) : (
          <section className="post-grid-fade grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(function renderPost(post, index) {
              return <PostCard key={post._id} post={post} imagePriority={index === 0} />;
            })}
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
