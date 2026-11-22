/** Prismic web links must be absolute; links to this site are stored with the demo origin and turned into relative paths here. */
export function rel(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace(/^https?:\/\/(zimoco-demo\.vercel\.app|zimoco\.co\.zw|www\.zimoco\.co\.zw)(?=\/|$)/, "") || "/";
}
