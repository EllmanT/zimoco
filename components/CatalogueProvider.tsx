"use client";

import { createContext, useContext } from "react";
import { localCatalogue, type Catalogue } from "@/lib/catalogue";

const Ctx = createContext<Catalogue>(localCatalogue);

/** Gives client components the catalogue the server resolved (Prismic first, local fallback). */
export function CatalogueProvider({ catalogue, children }: { catalogue: Catalogue; children: React.ReactNode }) {
  return <Ctx.Provider value={catalogue}>{children}</Ctx.Provider>;
}

export const useCatalogue = () => useContext(Ctx);
