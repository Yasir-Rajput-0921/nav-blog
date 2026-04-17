/**
 * Canonical origin for metadata, sitemap, and robots.
 * Set `NEXT_PUBLIC_SITE_URL` in production (for example `https://example.com`).
 * On Vercel, `VERCEL_URL` is used when the public URL is not set.
 */
export function getSiteUrlString(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit && explicit.trim() !== "") {
    return explicit.trim().replace(/\/+$/, "");
  }

  const vercel = process.env.VERCEL_URL;
  if (vercel && vercel.trim() !== "") {
    const host = vercel.trim().replace(/\/+$/, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}

export function getMetadataBaseUrl(): URL {
  const origin = getSiteUrlString().replace(/\/+$/, "");
  return new URL(`${origin}/`);
}
