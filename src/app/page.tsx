import type { Metadata } from "next";
import BloxId from "@/components/BloxId";
import Convert from "@/components/Convert";
import GetApp from "@/components/GetApp";
import Hero from "@/components/Hero";
import MoreInApp from "@/components/MoreInApp";
import Security from "@/components/Security";
import Trade from "@/components/Trade";
import TopUp from "@/components/TopUp";
import { site } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Tells search engines who publishes the site, in their own format.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: `${site.url}/`,
      slogan: site.tagline,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: `${site.url}/`,
      description: site.description,
      inLanguage: "en-NG",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <BloxId />
      <Trade />
      <Convert />
      <TopUp />
      <Security />
      <MoreInApp />
      <GetApp />
    </main>
  );
}
