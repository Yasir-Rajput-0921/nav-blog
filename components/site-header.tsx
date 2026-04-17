import Link from "next/link";

import { CATEGORY_LINKS } from "@/data/posts";
import { PostCategory } from "@/types/post";

interface SiteHeaderProps {
  activeCategory?: PostCategory;
}

interface NavLinkItem {
  label: string;
  href: string;
  key: "all" | PostCategory;
}

function isCurrentLink(linkKey: "all" | PostCategory, activeCategory?: PostCategory): boolean {
  if (!activeCategory && linkKey === "all") {
    return true;
  }

  return activeCategory === linkKey;
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

export function SiteHeader({ activeCategory }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-slate-50/90 backdrop-blur-md supports-[backdrop-filter]:bg-slate-50/75">
      <div className="mx-auto flex w-[min(1100px,92%)] flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-5">
        <Link
          href="/"
          className="w-fit rounded-lg text-2xl font-extrabold tracking-tight text-slate-900 transition-[color,transform] duration-200 ease-out hover:text-blue-700 motion-reduce:hover:scale-100 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 sm:text-3xl"
        >
          Blog
        </Link>

        <nav
          className="site-nav-pills flex max-w-full flex-wrap gap-1 rounded-2xl border border-slate-200/80 bg-linear-to-b from-slate-100 to-slate-100/80 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
          aria-label="Blog categories"
        >
          {CATEGORY_LINKS.map(function renderNavItem(link) {
            const active = isCurrentLink(link.key, activeCategory);
            return <NavPillLink key={link.href} link={link} isActive={active} />;
          })}
        </nav>
      </div>
    </header>
  );
}
