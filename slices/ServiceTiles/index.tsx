import { FC } from "react";
import Link from "next/link";
import { Banknote, ShieldCheck, SlidersHorizontal, Store, CarFront, type LucideIcon } from "lucide-react";
import { Content, asLink, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type ServiceTilesProps = SliceComponentProps<Content.ServiceTilesSlice>;

const icons: Record<string, LucideIcon> = { store: Store, "steering-wheel": CarFront, banknote: Banknote, shield: ShieldCheck, sliders: SlidersHorizontal };

const ServiceTiles: FC<ServiceTilesProps> = ({ slice }) => (
  <section data-slice-type={slice.slice_type} className="bg-white">
    <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-8">
      <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)]">{slice.primary.heading || "Services"}</h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {slice.primary.tiles.map((t, i) => {
          const Icon = icons[t.icon ?? ""] ?? Store;
          const href = isFilled.link(t.link) ? asLink(t.link) : null;
          const body = (
            <>
              <Icon size={28} strokeWidth={1.5} aria-hidden className="text-accent-deep" />
              <h3 className="display mt-10 text-xl">{t.title}</h3>
              <p className="mt-2 text-sm text-muted">{t.blurb}</p>
            </>
          );
          return (
            <li key={i}>
              {href
                ? <Link href={href} className="group block h-full rounded border border-line p-6 transition-colors hover:border-sky hover:bg-sky-soft">{body}</Link>
                : <div className="h-full rounded border border-line p-6">{body}</div>}
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default ServiceTiles;
