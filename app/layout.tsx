import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/inter-tight";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import FloatingActions from "@/components/FloatingActions";
import FirstTouch from "@/components/FirstTouch";
import { RfqProvider } from "@/components/RfqProvider";
import { CatalogueProvider } from "@/components/CatalogueProvider";
import { getCatalogue } from "@/lib/prismic/catalogue";
import { site } from "@/lib/site";

// Mercedes-Benz uses licensed MBCorpo; Inter Tight (display, light) and Inter (text) are the closest free pairing, self-hosted via fontsource (see --f-display / --f-body in globals.css).

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Zimoco | Mercedes-Benz, Jeep, Mitsubishi, GWM, Haval and more in Zimbabwe", template: "%s | Zimoco" },
  description: "Zimoco is the official distributor of Mercedes-Benz, Jeep, Fiat, Alfa Romeo, GWM, Haval and Mitsubishi in Zimbabwe. Explore the range and request a quote.",
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
    address: { "@type": "PostalAddress", streetAddress: "24 Douglas Road, Workington", addressLocality: "Harare", addressCountry: "ZW" },
  };
  return (
    <html lang="en">
      <body>
        {/*
          THESIS: a digital showroom. Explore, configure, compare, request a quote. No sourcing story.
          WORLD: white showroom floor, black type and footer, Zimoco light blue as the single accent (active pills, CTAs).
          FIRST VIEWPORT: logo loader, then a full-screen hero with copy and CTAs on the left.
        */}
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[110] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <CatalogueProvider catalogue={catalogue}>
            <RfqProvider>
              <Preloader />
              <FirstTouch />
              <TopBar />
              <main id="main" className="pt-14">{children}</main>
              <Footer />
              <FloatingActions />
            </RfqProvider>
        </CatalogueProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      </body>
    </html>
  );
}
