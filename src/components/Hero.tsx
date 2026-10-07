import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import HeroSend from "@/components/HeroSend";
import { navCta } from "@/lib/nav";

// The app's quick actions, in the order its dashboard shows them.
const actions = [
  { label: "Buy", icon: "M8 3v10M3 8h10" },
  { label: "Sell", icon: "M3 8h10" },
  { label: "Send", icon: "M4.5 11.5l7-7M6 4.5h5.5V10" },
  { label: "Receive", icon: "M11.5 4.5l-7 7M10 11.5H4.5V6" },
  { label: "Swap", icon: "M3 6h9.5L10 3.5M13 10H3.5L6 12.5" },
  { label: "Airtime", icon: "M4 12.5v-2M8 12.5v-5M12 12.5v-9" },
  {
    label: "Data",
    icon: "M2.75 7.25a7.4 7.4 0 0 1 10.5 0M5.1 9.6a4.1 4.1 0 0 1 5.8 0M8 12.25h.01",
  },
];

// Placeholder stock photo (Unsplash). Replace with brand photography served from /public/images.
const photo =
  "https://images.unsplash.com/photo-1662988836971-aefba0a7907a?auto=format&fit=crop&crop=focalpoint&fp-x=0.6&fp-y=0.6&fp-z=1.3&flip=h&w=900&h=1300&q=75";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-panel" data-nav-tone="violet">
        <div className="hero-copy">
          <ul className="hero-actions" aria-label="What you can do on Blox">
            {actions.map((action, index) => (
              <li key={action.label} style={{ "--i": index } as CSSProperties}>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d={action.icon}
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {action.label}
              </li>
            ))}
          </ul>

          <h1 className="hero-title">
            <span className="hero-line" style={{ "--i": 0 } as CSSProperties}>
              <span>
                <span className="hero-word hero-word--paper">Naira</span> and{" "}
                <span className="hero-word hero-word--ink">crypto</span>.
              </span>
            </span>
            <span className="hero-line" style={{ "--i": 1 } as CSSProperties}>
              <span>One simple app.</span>
            </span>
          </h1>

          <p className="hero-sub">
            Buy, sell and swap crypto with your Naira. Send to anyone on Blox
            instantly, using only their Blox ID.
          </p>

          <div className="hero-cta">
            <Link href={navCta.href} className="block-btn" data-tone="paper">
              {navCta.label}
              <Arrow />
            </Link>
            <Link href="/features" className="block-btn" data-tone="deep">
              See the features
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <span className="hero-photo-back" aria-hidden="true" />
          <div className="hero-photo">
            <Image
              src={photo}
              alt="A woman smiling down at the phone in her hands"
              fill
              sizes="(width < 64rem) 20rem, 25rem"
              loading="eager"
            />
          </div>
          <HeroSend />
        </div>
      </div>
    </section>
  );
}
