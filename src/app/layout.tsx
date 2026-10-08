import type { Metadata, Viewport } from "next";
import { Gabarito, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import PointerOrigin from "@/components/PointerOrigin";
import SiteNav from "@/components/SiteNav";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

const gabarito = Gabarito({ variable: "--font-gabarito", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Blox: Naira and crypto in one simple app",
    template: "%s | Blox",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, type: "website", locale: "en_NG" },
  twitter: { card: "summary_large_image" },
};

// Tints the browser bar on phones to match the page (the hex of --paper).
export const viewport: Viewport = { themeColor: "#faf9fe" };

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
        <Footer />
      </body>
    </html>
  );
}
