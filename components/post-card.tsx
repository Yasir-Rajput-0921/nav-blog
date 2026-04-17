import Image from "next/image";
import Link from "next/link";

import { sanityCdnSrc } from "@/lib/blog/sanity-cdn-image";
import { getBlogPostCoverPlaceholderText, getPostUrl, hasBlogPostCoverImage } from "@/lib/blog/post-helpers";
import type { BlogPost } from "@/types/post";

interface PostCardProps {
  post: BlogPost;
  /** First card in a grid: improves LCP when the cover is above the fold. */
  imagePriority?: boolean;
}

export function PostCard(props: PostCardProps) {
  const { post, imagePriority = false } = props;
  const postUrl = getPostUrl(post);
  const showCoverImage = hasBlogPostCoverImage(post);
  const coverImageAlt = post.imageAlt.trim() !== "" ? post.imageAlt : post.title;
  const coverPlaceholderText = getBlogPostCoverPlaceholderText(post);
  const showCoverPlaceholder = coverPlaceholderText !== "";

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out will-change-transform motion-reduce:transition-colors motion-reduce:hover:translate-y-0 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
      <Link
        href={postUrl}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label={`Read article: ${post.title}`}
      >
        {showCoverImage ? (
          <div className="relative h-44 w-full">
            <Image
              src={sanityCdnSrc(post.imageSrc, 720)}
              alt={coverImageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={imagePriority}
              loading={imagePriority ? "eager" : "lazy"}
            />
          </div>
        ) : null}
        {showCoverPlaceholder ? (
          <div className="flex h-44 w-full items-center justify-center border-b border-slate-200 bg-slate-100/90 px-4 py-3">
            <p className="text-center text-sm font-medium leading-relaxed text-slate-600">{coverPlaceholderText}</p>
          </div>
        ) : null}

        <div className="p-5">
          <span className="mb-3 inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            {post.tag}
          </span>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">{post.title}</h2>
          <p className="leading-7 text-slate-600">{post.description}</p>
          <p className="mt-3 text-sm text-slate-500">{post.date}</p>
          <p className="mt-4 text-sm font-semibold text-blue-700">Read full article</p>
        </div>
      </Link>
    </article>
  );
}
