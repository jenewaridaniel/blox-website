import Link from "next/link";
import Arrow from "@/components/Arrow";
import BackToTop from "@/components/BackToTop";
import FooterWordmark from "@/components/FooterWordmark";
import { navCta, navItems } from "@/lib/nav";
import { site } from "@/lib/site";

const groups = [
  { title: "Explore", links: navItems.slice(1) },
  { title: "Get Blox", links: [navCta] },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-panel">
        <div className="ft-top-row">
          <div className="ft-lead">
            <p className="ft-tagline">{site.tagline}</p>
            <Link href={navCta.href} className="block-btn" data-tone="paper">
              {navCta.label}
              <Arrow />
            </Link>
          </div>

          <nav className="ft-groups" aria-label="Footer">
            {groups.map((group) => (
              <div key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="ft-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="ft-hint" aria-hidden="true">
          Move across the letters. Tap one to send a wave.
        </p>
        <FooterWordmark />

        <div className="ft-bottom">
          <p>
            © {new Date().getFullYear()} Blox. All rights reserved. Market
            prices from{" "}
            <a
              href="https://www.coingecko.com"
              target="_blank"
              rel="noopener"
              className="ft-credit"
            >
              CoinGecko
            </a>
            .
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
