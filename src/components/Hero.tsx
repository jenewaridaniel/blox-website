import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import HeroBackdrop from "@/components/HeroBackdrop";
import HeroSend from "@/components/HeroSend";
import { actions } from "@/lib/actions";
import { navCta } from "@/lib/nav";

// Placeholder stock photo (Unsplash). Replace with brand photography served from /public/images.
const photo =
  "https://images.unsplash.com/photo-1662988836971-aefba0a7907a?auto=format&fit=crop&crop=focalpoint&fp-x=0.6&fp-y=0.6&fp-z=1.3&flip=h&w=900&h=1300&q=75";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-panel" data-nav-tone="violet">
        <HeroBackdrop />
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
          <span className="hero-ripples" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
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
