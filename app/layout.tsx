import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import CompareTray from "@/components/CompareTray";
import FloatingActions from "@/components/FloatingActions";
import FirstTouch from "@/components/FirstTouch";
import { CompareProvider } from "@/components/CompareProvider";
import { RfqProvider } from "@/components/RfqProvider";
import { CatalogueProvider } from "@/components/CatalogueProvider";
import { getCatalogue } from "@/lib/prismic/catalogue";
import { site } from "@/lib/site";

// Closest free match to Toyota Type (humanist sans): bold for headings, regular for text.
const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--f-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Zimoco | Digital showroom: Hilux, Ranger, Prado and more", template: "%s | Zimoco" },
  description: "Explore the Zimoco digital showroom. Configure your colour and trim, compare vehicles side by side, and request a quote in minutes.",
  openGraph: { siteName: "Zimoco", type: "website", locale: "en_ZW" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalogue = await getCatalogue();
  const org = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phoneTel,
    address: { "@type": "PostalAddress", streetAddress: "Norfolk Road, Mount Pleasant", addressLocality: "Harare", addressCountry: "ZW" },
  };
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        {/*
          THESIS: a digital showroom. Explore, configure, compare, request a quote. No sourcing story.
          WORLD: white showroom floor, black type and footer, Zimoco red as the single signature (rings, active states, CTAs).
          FIRST VIEWPORT: logo loader, then a centred full-screen hero with red ring indicators.
        */}
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[110] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <CatalogueProvider catalogue={catalogue}>
          <CompareProvider>
            <RfqProvider>
              <Preloader />
              <FirstTouch />
              <TopBar />
              <main id="main" className="pt-14">{children}</main>
              <Footer />
              <CompareTray />
              <FloatingActions />
            </RfqProvider>
          </CompareProvider>
        </CatalogueProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      </body>
    </html>
  );
}
