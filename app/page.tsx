import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await createClient().getSingle("homepage");
    const { meta_title, meta_description, meta_image } = page.data;
    return {
      ...(meta_title ? { title: { absolute: meta_title } } : {}),
      ...(meta_description ? { description: meta_description } : {}),
      ...(meta_image.url ? { openGraph: { images: [meta_image.url] } } : {}),
    };
  } catch {
    return {};
  }
}

/** The whole page is a Prismic slice zone: hero, brand pills + top picks, models, highlights, strip, features, services. */
export default async function Home() {
  const page = await createClient().getSingle("homepage");
  return <SliceZone slices={page.data.slices} components={components} />;
}
