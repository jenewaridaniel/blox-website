"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Item = { id: string; label: string };

/**
 * A sticky strip of the page's chapters. A violet block sits on the one you are reading, follows you
 * as you scroll, and jumps you to a chapter when you pick one.
 */
export default function FeatureIndex({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id));
    // A chapter counts as current once it crosses the middle of the screen.
    const watch = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sections.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => section && watch.observe(section));
    return () => watch.disconnect();
  }, [items]);

  // On a narrow screen the strip scrolls sideways, so keep the current chapter in sight.
  useEffect(() => {
    const strip = scroller.current;
    const current = strip?.querySelectorAll("a")[active];
    if (!strip || !current) return;
    strip.scrollTo({
      left:
        current.offsetLeft - strip.clientWidth / 2 + current.offsetWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [active]);

  return (
    <nav className="fx-index" aria-label="Chapters">
      <div ref={scroller} className="fx-index__scroll">
        <div
          className="fx-index__tray"
          style={{ "--n": items.length, "--a": active } as CSSProperties}
        >
          <span className="fx-index__blox" aria-hidden="true" />
          <ul>
            {items.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)",
                      ).matches
                        ? "auto"
                        : "smooth",
                    });
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
