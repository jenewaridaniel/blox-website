import type { Metadata } from "next";
import { Gabarito, Geist_Mono } from "next/font/google";
import PointerOrigin from "@/components/PointerOrigin";
import SiteNav from "@/components/SiteNav";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const gabarito = Gabarito({ variable: "--font-gabarito", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://blox.ng"),
  title: {
    default: "Blox — Your Naira and crypto, one simple account",
    template: "%s | Blox",
  },
  description:
    "Buy, sell, swap and send Naira and crypto from one secure account. Send money instantly to anyone with just a Blox ID.",
  openGraph: { siteName: "Blox", type: "website", locale: "en_NG" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${gabarito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <PointerOrigin />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
