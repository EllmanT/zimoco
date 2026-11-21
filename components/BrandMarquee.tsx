import Image from "next/image";
import Link from "next/link";

export type MarqueeBrand = { name: string; logo: string; href: string };

/** Bare brand logos drifting left to right. No boxes. Pure CSS, pauses on hover, static under reduced motion. */
export default function BrandMarquee({ brands }: { brands: MarqueeBrand[] }) {
  // Repeat the set so one half is always wider than the viewport, then the loop is seamless at -50% -> 0.
  const set = [...brands, ...brands, ...brands];
  return (
    <section aria-label="Brands we sell" className="bg-white py-14 md:py-20">
      <p className="label text-center text-muted">The brands we sell</p>
      <div className="marquee relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="marquee-track flex w-max items-center">
          {[0, 1].map((half) =>
            set.map((b, k) => (
              <li key={`${half}-${k}`} aria-hidden={half === 1 || undefined} className="px-8 md:px-14">
                <Link href={b.href} tabIndex={half === 1 ? -1 : undefined} aria-label={b.name} className="relative block h-12 w-32 opacity-60 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0 md:h-14 md:w-40">
                  <Image src={b.logo} alt="" fill sizes="160px" className="object-contain" unoptimized />
                </Link>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
