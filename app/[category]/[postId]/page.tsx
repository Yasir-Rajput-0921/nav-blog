import type { Metadata } from "next";
import Image from "next/image";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getAllPostRouteParams,
  getBlogPostCoverPlaceholderText,
  getCategoryDescription,
  getCategoryLabel,
  getPostByCategoryAndId,
  getPostContentSections,
  getPostUrl,
  getSafeCategory,
  hasBlogPostCoverImage,
} from "@/data/posts";
import { PostCategory } from "@/types/post";

export const dynamicParams = true;

interface PostDetailPageProps {
  params: Promise<{ category: string; postId: string }>;
}

interface ValidatedPostRoute {
  category: PostCategory;
  postId: string;
}

function getValidatedRouteParams(category: string, postId: string): ValidatedPostRoute | undefined {
  const safeCategory = getSafeCategory(category);

  if (!safeCategory) {
    return undefined;
  }

  return {
    category: safeCategory,
    postId,
  };
}

export async function generateStaticParams() {
  return getAllPostRouteParams();
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { category, postId } = await params;
  const validated = getValidatedRouteParams(category, postId);

  if (!validated) {
    return {
      title: "Post Not Found | Blog",
      description: "The requested blog post does not exist.",
    };
  }

  const post = getPostByCategoryAndId(validated.category, validated.postId);

  if (!post) {
    return {
      title: "Post Not Found | Blog",
      description: "The requested blog post does not exist.",
    };
  }

  const categoryLabel = getCategoryLabel(validated.category);
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
                url: post.imageSrc,
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
      ...(showCoverImage ? { images: [post.imageSrc] } : {}),
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { category, postId } = await params;
  const validated = getValidatedRouteParams(category, postId);
  const post = validated ? getPostByCategoryAndId(validated.category, validated.postId) : undefined;
  const showNoPostState = !validated || !post;
  const categoryLabel = validated ? getCategoryLabel(validated.category) : "";
  const categoryDescription = validated ? getCategoryDescription(validated.category) : "";
  const contentSections = post ? getPostContentSections(post) : [];
  const showCoverImage = post ? hasBlogPostCoverImage(post) : false;
  const coverImageAlt =
    post && post.imageAlt.trim() !== "" ? post.imageAlt : post ? post.title : "";
  const coverPlaceholderText = post ? getBlogPostCoverPlaceholderText(post) : "";
  const showCoverPlaceholder = coverPlaceholderText !== "";

  return (
    <div className="min-h-screen flex flex-col gap-5 pb-8">
      <SiteHeader activeCategory={validated?.category} />

      <main className="mx-auto w-[min(1100px,92%)] pb-10 animate-site-main-in">
        {showNoPostState ? (
          <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">No post found</h1>
            <p className="mt-3 text-slate-600">
              We could not find this post. Please check the URL or open another post from the category page.
            </p>
          </section>
        ) : (
          <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{post.tag}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{post.title}</h1>
              <p className="mt-3 text-sm text-slate-500">
                Published on {post.date} in {categoryLabel}
              </p>
              <p className="mt-2 text-slate-600">{categoryDescription}</p>
            </div>

            {showCoverImage ? (
              <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl sm:h-80">
                <Image
                  src={post.imageSrc}
                  alt={coverImageAlt}
                  fill
                  priority
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
              {contentSections.map(function renderSection(section) {
                return (
                  <section key={section.heading} className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-900">{section.heading}</h2>
                    {section.paragraphs.map(function renderParagraph(paragraph) {
                      return (
                        <p key={paragraph} className="leading-8 text-slate-700">
                          {paragraph}
                        </p>
                      );
                    })}
                  </section>
                );
              })}
            </div>
          </article>
        )}

      </main>

      <SiteFooter />
    </div>
  );
}
