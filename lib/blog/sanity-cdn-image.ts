/**
 * Sanity asset URLs from GROQ (`asset->url`) point at full-resolution files.
 * Adding CDN params cuts download size and speeds LCP for the same visual size.
 * @see https://www.sanity.io/docs/image-urls
 */
export function sanityCdnSrc(url: string, maxWidth: number, quality: number = 80): string {
  const trimmed = url.trim();

  if (trimmed === "" || !trimmed.includes("cdn.sanity.io/images/")) {
    return trimmed;
  }

  const join = trimmed.includes("?") ? "&" : "?";
  return `${trimmed}${join}w=${maxWidth}&auto=format&q=${quality}&fit=max`;
}
