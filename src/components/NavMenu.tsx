"use client";

import { useRef, type RefObject } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { isCurrent, navCta, navItems } from "@/lib/nav";
import BloxWordmark from "@/components/BloxWordmark";

type Props = {
  open: boolean;
  pathname: string;
  /** The logo block in the bar. The menu grows out of it and shrinks back into it. */
  origin: RefObject<HTMLElement | null>;
  onDismiss: () => void;
};

export function NavArrow() {
  return (
    <svg
      className="nav-arrow"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 9.5 9.5 1.5M3 1.5h6.5V8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NavMenu({ open, pathname, origin, onDismiss }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const clip = useRef({ t: 0, r: 0, b: 0, l: 0, rad: 0 });
  const timeline = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      const el = dialog.current;
      const from = origin.current;
      if (!el || !from || (!open && !el.open)) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const rows = gsap.utils.toArray<HTMLElement>(".nav-menu__link", el);
      const foot = el.querySelector(".nav-menu__foot");
      const bars = gsap.utils.toArray<HTMLElement>(".nav-bars i", el);
      const write = () => {
        const { t, r, b, l, rad } = clip.current;
        el.style.setProperty("--mt", `${t}px`);
        el.style.setProperty("--mr", `${r}px`);
        el.style.setProperty("--mb", `${b}px`);
        el.style.setProperty("--ml", `${l}px`);
        el.style.setProperty("--mrad", `${rad}px`);
      };
      const block = () => {
        const box = from.getBoundingClientRect();
        return {
          t: box.top,
          r: el.clientWidth - box.right,
          b: el.clientHeight - box.bottom,
          l: box.left,
          rad: parseFloat(getComputedStyle(from).borderTopLeftRadius),
        };
      };

      timeline.current?.kill();
      document.documentElement.style.overflow = open ? "hidden" : "";

      if (open) {
        if (!el.open) {
          el.showModal();
          closeButton.current?.focus();
          Object.assign(
            clip.current,
            reduce ? { t: 0, r: 0, b: 0, l: 0, rad: 0 } : block(),
          );
          write();
          gsap.set(el, { autoAlpha: reduce ? 0 : 1 });
          gsap.set(rows, { yPercent: reduce ? 0 : 115 });
          gsap.set(foot, { autoAlpha: reduce ? 1 : 0, y: reduce ? 0 : 20 });
          gsap.set(bars, {
            y: (i) => (reduce ? (i ? -4.25 : 4.25) : 0),
            rotation: (i) => (reduce ? (i ? -45 : 45) : 0),
          });
        }
        if (reduce) {
          timeline.current = gsap
            .timeline()
            .to(el, { autoAlpha: 1, duration: 0.15 });
          return;
        }
        timeline.current = gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(clip.current, {
            t: 0,
            r: 0,
            b: 0,
            l: 0,
            rad: 0,
            duration: 0.75,
            onUpdate: write,
          })
          .to(
            bars,
            {
              y: (i) => (i ? -4.25 : 4.25),
              rotation: (i) => (i ? -45 : 45),
              duration: 0.5,
            },
            0.1,
          )
          .to(rows, { yPercent: 0, duration: 0.8, stagger: 0.055 }, 0.12)
          .to(foot, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.34);
        return;
      }

      if (reduce) {
        timeline.current = gsap
          .timeline()
          .to(el, { autoAlpha: 0, duration: 0.12 })
          .call(() => el.close());
        return;
      }
      timeline.current = gsap
        .timeline()
        .to(rows, {
          yPercent: 115,
          duration: 0.32,
          ease: "power3.in",
          stagger: { each: 0.02, from: "end" },
        })
        .to(foot, { autoAlpha: 0, duration: 0.2, ease: "power2.out" }, 0)
        .to(bars, { y: 0, rotation: 0, duration: 0.3, ease: "power3.inOut" }, 0)
        .to(
          clip.current,
          { ...block(), duration: 0.5, ease: "expo.inOut", onUpdate: write },
          0.06,
        )
        .call(() => el.close());
    },
    { dependencies: [open], scope: dialog },
  );

  return (
    <dialog
      ref={dialog}
      id="site-menu"
      className="nav-menu"
      aria-label="Menu"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClose={onDismiss}
    >
      <div className="nav-menu__bar">
        <div className="nav-menu__logo">
          <Link
            href="/"
            className="nav-cell nav-cell--logo"
            aria-label="Blox home"
            onClick={onDismiss}
          >
            <BloxWordmark />
          </Link>
        </div>
        <button
          ref={closeButton}
          type="button"
          className="nav-menu-btn"
          aria-label="Close menu"
          onClick={onDismiss}
        >
          <span className="nav-bars" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <ul className="nav-menu__list">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="nav-menu__link"
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
              onClick={onDismiss}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-menu__foot">
        <Link href={navCta.href} className="nav-menu__cta" onClick={onDismiss}>
          {navCta.label}
          <NavArrow />
        </Link>
        <p className="nav-menu__tag">Naira and crypto. One simple app.</p>
      </div>
    </dialog>
  );
}
