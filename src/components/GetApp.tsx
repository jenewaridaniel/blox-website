"use client";

import Link from "next/link";
import Arrow from "@/components/Arrow";
import WalletPhone from "@/components/WalletPhone";
import { navCta } from "@/lib/nav";

export default function GetApp() {
  return (
    <section className="getapp" aria-labelledby="getapp-title">
      <div className="getapp-panel" data-nav-tone="violet">
        <div className="ga-bg" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>

        <div className="getapp-copy">
          <h2 id="getapp-title" className="getapp-title">
            Ready when you are.
          </h2>
          <p className="getapp-sub">
            Get Blox and keep your Naira, your crypto and your top-ups in one
            place, one tap from the home screen.
          </p>
          <Link href={navCta.href} className="block-btn" data-tone="paper">
            {navCta.label}
            <Arrow />
          </Link>
          <p className="getapp-tag">Naira and crypto. One simple app.</p>
        </div>

        <div className="getapp-stage">
          <span className="ga-block ga-block--a" aria-hidden="true" />
          <span className="ga-block ga-block--b" aria-hidden="true" />

          <WalletPhone />
        </div>
      </div>
    </section>
  );
}
