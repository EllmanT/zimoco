import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { fullName } from "@/lib/catalogue";
import { getCatalogue } from "@/lib/prismic/catalogue";

export const metadata: Metadata = { title: "Photo credits", robots: { index: false } };

type Credit = { file?: string; page: string; license: string; author?: string; source?: string };

export default async function Credits() {
  const { models } = await getCatalogue();
  const cmsCredits = models.flatMap((m) => (m.cms?.credits ?? []).map((c) => ({ model: fullName(m), credit: c })));
  const read = async (f: string) => Object.entries(JSON.parse(await fs.readFile(path.join(process.cwd(), f), "utf8")) as Record<string, Credit>);
  const credits = [...(await read("public/cars/credits.json")), ...(await read("public/site/credits.json"))].map(([key, c]) => ({
    ...c,
    file: c.file ?? key.split("/").pop(),
    author: c.author || (c.source === "Pexels" ? "Pexels contributor (see photo page)" : ""),
    license: c.license || c.source || "",
  }));
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-24">
      <h1 className="display text-[clamp(1.73rem,3.00vw,2.64rem)]">Photo credits</h1>
      <p className="measure mt-5 text-muted">
        Illustrative photographs from Wikimedia Commons and Pexels, used on this demonstration site. They are not the vehicles described. Replace with Zimoco&apos;s own photography before launch.
      </p>
      {cmsCredits.length > 0 && (
        <ul className="mt-12 max-w-4xl">
          {cmsCredits.map((c) => (
            <li key={`${c.model}-${c.credit}`} className="grid gap-1 border-t border-line py-4 md:grid-cols-[1fr_2fr] md:gap-6">
              <span>{c.model}</span>
              <span className="text-muted">{c.credit}</span>
            </li>
          ))}
        </ul>
      )}
      <ul className="mt-12 max-w-4xl">
        {credits.map((c) => (
          <li key={c.page} className="grid gap-1 border-t border-line py-4 md:grid-cols-[1.4fr_1fr_0.6fr] md:gap-6">
            <a href={c.page} className="underline decoration-brass-deep">{c.file}</a>
            <span className="text-muted">{c.author || "Unknown author"}</span>
            <span className="tnum text-muted">{c.license}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
