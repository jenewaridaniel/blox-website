import type { Metadata } from "next";
import HelpCenter from "@/components/HelpCenter";
import { faqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Help",
  description:
    "Answers about Blox: your Blox ID, identity checks, your PIN and biometrics, sending and receiving, buying, selling and swapping crypto, withdrawals, airtime and data.",
  alternates: { canonical: "/help/" },
};

// The same questions and answers as on the page, in the format search engines read for rich results.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function HelpPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <HelpCenter />
    </main>
  );
}
