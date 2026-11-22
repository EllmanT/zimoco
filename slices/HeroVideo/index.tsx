import { FC } from "react";
import { Content, asLink, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { rel } from "@/lib/href";
import HeroVideoClient, { type HeroSlide } from "@/components/home/HeroVideo";

export type HeroVideoProps = SliceComponentProps<Content.HeroVideoSlice>;

const cta = (l: unknown, fallback: string) => {
  const href = rel(asLink(l as never));
  return href ? { href, label: (l as { text?: string }).text ?? fallback } : null;
};

const HeroVideo: FC<HeroVideoProps> = ({ slice }) => {
  const slides: HeroSlide[] = slice.primary.slides.map((s) => ({
    video: s.video_id ?? "",
    kicker: s.kicker ?? "",
    headline: s.headline ?? "",
    body: s.body ?? "",
    primary: isFilled.link(s.primary_cta) ? cta(s.primary_cta, "Explore") : null,
    secondary: isFilled.link(s.secondary_cta) ? cta(s.secondary_cta, "Learn more") : null,
  }));
  return <div data-slice-type={slice.slice_type}><HeroVideoClient slides={slides} /></div>;
};

export default HeroVideo;
