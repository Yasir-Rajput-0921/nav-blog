import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildCategorySlugSet } from "@/lib/blog/category-slugs";
import { getPostContentSections } from "@/lib/blog/post-content";
import {
  getBlogPostCoverPlaceholderText,
  getPostUrl,
  getSafeCategorySlug,
  hasBlogPostCoverImage,
} from "@/lib/blog/post-helpers";
import { sanityCdnSrc } from "@/lib/blog/sanity-cdn-image";
import { getBlogCategories, getBlogPostByRoute } from "@/lib/blog/sanity-data";
import { fetchPostRoutesForStaticParams } from "@/sanity/lib/build-static-params";

export const dynamicParams = true;

interface PostDetailPageProps {
  params: Promise<{ category: string; postId: string }>;
}

export async function generateStaticParams() {
  return fetchPostRoutesForStaticParams();
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { category, postId } = await params;
  const [categories, post] = await Promise.all([
    getBlogCategories(),
    getBlogPostByRoute(category, postId),
  ]);
  const categorySlugSet = buildCategorySlugSet(categories);
  const safeCategory = getSafeCategorySlug(category, categorySlugSet);

  if (!safeCategory || !post) {
    return {
      title: "Post Not Found | Blog",
      description: "The requested blog post does not exist.",
    };
  }

  const categoryLabel = post.categoryTitle.trim() !== "" ? post.categoryTitle : safeCategory;
  const showCoverImage = hasBlogPostCoverImage(post);
  const coverAlt = post.imageAlt.trim() !== "" ? post.imageAlt : post.title;

  return {
    title: `${post.title} | ${categoryLabel} Blog`,
    description: post.description,
    alternates: {
      canonical: getPostUrl(post),
    },
    openGraph: {
      title: `${post.title} | ${categoryLabel} Blog`,
      description: post.description,
      type: "article",
      url: getPostUrl(post),
      ...(showCoverImage
        ? {
            images: [
              {
                url: sanityCdnSrc(post.imageSrc, 1200),
                alt: coverAlt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: showCoverImage ? "summary_large_image" : "summary",
      title: `${post.title} | ${categoryLabel} Blog`,
      description: post.description,
      ...(showCoverImage ? { images: [sanityCdnSrc(post.imageSrc, 1200)] } : {}),
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { category, postId } = await params;
  const [categories, post] = await Promise.all([
    getBlogCategories(),
    getBlogPostByRoute(category, postId),
  ]);
  const categorySlugSet = buildCategorySlugSet(categories);
  const safeCategory = getSafeCategorySlug(category, categorySlugSet);

  if (!safeCategory || !post) {
    notFound();
  }

  const categoryLabel = post.categoryTitle.trim() !== "" ? post.categoryTitle : safeCategory;
  const categoryDescription =
    post.categoryDescription.trim() !== "" ? post.categoryDescription : "";
  const contentSections = getPostContentSections(post);
  const showCoverImage = hasBlogPostCoverImage(post);
  const coverImageAlt =
    post.imageAlt.trim() !== "" ? post.imageAlt : post.title;
  const coverPlaceholderText = getBlogPostCoverPlaceholderText(post);
  const showCoverPlaceholder = coverPlaceholderText !== "";

  return (
    <div className="min-h-screen flex flex-col gap-5 pb-8">
      <SiteHeader categories={categories} activeCategorySlug={safeCategory} />

      <main className="mx-auto w-[min(1100px,92%)] pb-10 animate-site-main-in">
        <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{post.tag}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{post.title}</h1>
            <p className="mt-3 text-sm text-slate-500">
              Published on {post.date} in {categoryLabel}
            </p>
            {categoryDescription !== "" ? (
              <p className="mt-2 text-slate-600">{categoryDescription}</p>
            ) : null}
          </div>

          {showCoverImage ? (
            <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl sm:h-80">
              <Image
                src={sanityCdnSrc(post.imageSrc, 1280)}
                alt={coverImageAlt}
                fill
                priority
                loading="eager"
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
              />
            </div>
          ) : null}
          {showCoverPlaceholder ? (
            <div className="mb-8 flex min-h-48 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 sm:min-h-56">
              <p className="max-w-prose text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
                {coverPlaceholderText}
              </p>
            </div>
          ) : null}

          <div className="space-y-8">
            {contentSections.map(function renderSection(section, sectionIndex) {
              const sectionKey = `${section.heading}-${sectionIndex}`;
              return (
                <section key={sectionKey} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-900">{section.heading}</h2>
                  {section.paragraphs.map(function renderParagraph(paragraph, paragraphIndex) {
                    const paragraphKey = `${sectionKey}-p-${paragraphIndex}`;
                    return (
                      <p key={paragraphKey} className="leading-8 text-slate-700">
                        {paragraph}
                      </p>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
