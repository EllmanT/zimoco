import Image from "next/image";

type Tile = { title: string; text: string; src?: string };

/** Row 1: wide + narrow. Row 2: three equal tiles. Fewer tiles simply fill the rows in order. */
export default function HighlightsBento({ tiles }: { tiles: Tile[] }) {
  const top = tiles.slice(0, 2);
  const bottom = tiles.slice(2, 5);
  const card = (t: Tile, sizes: string, tall: boolean) => (
    <figure key={t.title + (t.src ?? "")} className="group relative overflow-hidden rounded-3xl bg-ink">
      <div className={`relative ${tall ? "aspect-[4/3] md:aspect-auto md:h-[30rem]" : "aspect-[4/3]"}`}>
        {t.src && <Image src={t.src} alt={t.title} fill sizes={sizes} className="object-cover transition-transform duration-700 ease-[var(--ease-out-strong)] [@media(hover:hover)]:group-hover:scale-[1.03]" />}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
          <h3 className="display text-2xl md:text-3xl">{t.title}</h3>
          {t.text && <p className="mt-2 max-w-md text-sm text-white/85 md:text-base">{t.text}</p>}
        </figcaption>
      </div>
    </figure>
  );
  return (
    <div className="space-y-4">
      {top.length > 0 && (
        <div className={`grid gap-4 ${top.length === 2 ? "md:grid-cols-[2fr_1fr]" : ""}`}>
          {top.map((t, i) => card(t, i === 0 ? "(min-width:768px) 66vw, 100vw" : "(min-width:768px) 33vw, 100vw", true))}
        </div>
      )}
      {bottom.length > 0 && (
        <div className={`grid gap-4 ${bottom.length === 1 ? "" : bottom.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {bottom.map((t) => card(t, "(min-width:768px) 33vw, 100vw", false))}
        </div>
      )}
    </div>
  );
}
