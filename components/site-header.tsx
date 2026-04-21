import Link from "next/link";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import AuthButtons from "./AuthButtons";

import type { BlogCategory } from "@/types/post";

interface SiteHeaderProps {
  categories: BlogCategory[];
  activeCategorySlug?: string;
}

interface NavLinkItem {
  label: string;
  href: string;
  key: string;
}

function buildNavLinks(categories: BlogCategory[]): NavLinkItem[] {
  const allPosts: NavLinkItem = { label: "All Posts", href: "/", key: "all" };
  const categoryLinks = categories.map(function mapCategory(category) {
    return {
      label: category.title,
      href: `/${category.slug}`,
      key: category.slug,
    };
  });

  return [allPosts, ...categoryLinks];
}

function isCurrentLink(linkKey: string, activeCategorySlug?: string): boolean {
  if (linkKey === "all") {
    return activeCategorySlug === undefined;
  }

  return activeCategorySlug === linkKey;
}

function getNavLinkClassName(isActive: boolean): string {
  const base =
    "inline-flex min-h-10 min-w-[2.75rem] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-[color,transform,background-color,box-shadow] duration-200 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 motion-reduce:transition-colors";

  if (isActive) {
    return `${base} bg-white text-blue-800 shadow-sm shadow-slate-900/10 ring-1 ring-slate-200/90`;
  }

  return `${base} text-slate-600 hover:bg-white/70 hover:text-slate-900 motion-reduce:hover:scale-100 hover:scale-[1.03] active:scale-[0.98]`;
}

interface NavPillLinkProps {
  link: NavLinkItem;
  isActive: boolean;
}

function NavPillLink(props: NavPillLinkProps) {
  const { link, isActive } = props;
  const className = getNavLinkClassName(isActive);

  return (
    <Link href={link.href} className={className} aria-current={isActive ? "page" : undefined}>
      {link.label}
    </Link>
  );
}

export async function SiteHeader(props: SiteHeaderProps) {
  const { categories, activeCategorySlug } = props;
  const navLinks = buildNavLinks(categories);

  const settings = await client.fetch(SITE_SETTINGS_QUERY);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-slate-50/90 backdrop-blur-md supports-[backdrop-filter]:bg-slate-50/75">
      <div className="mx-auto flex w-[min(1100px,92%)] flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-5">
        <Link
          href="/"
          className="w-fit rounded-lg text-2xl font-extrabold tracking-tight text-slate-900 transition-[color,transform] duration-200 ease-out hover:text-blue-700 motion-reduce:hover:scale-100 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 sm:text-3xl"
        >
          {settings?.logo ? (
            <Image
              src={urlFor(settings.logo).width(150).height(50).url()}
              alt={settings?.siteName || "Blog"}
              width={150}
              height={50}
              className="object-contain"
            />
          ) : (
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 hover:text-blue-700 sm:text-3xl">
              {settings?.siteName || "Blog"}
            </span>
          )}
        </Link>

        <nav
          className="site-nav-pills flex max-w-full flex-wrap gap-1 rounded-2xl border border-slate-200/80 bg-linear-to-b from-slate-100 to-slate-100/80 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
          aria-label="Blog categories"
        >
          {navLinks.map(function renderNavItem(link) {
            const active = isCurrentLink(link.key, activeCategorySlug);
            return <NavPillLink key={link.key} link={link} isActive={active} />;
          })}
        </nav>
        <AuthButtons />
      </div>
    </header>
  );
}
