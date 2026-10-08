"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// Small plus marks scattered across the block. x and y place them, t is how long a twinkle takes.
const crosses = [
  { x: "6%", y: "8%", t: 5.5 },
  { x: "46%", y: "6%", t: 7 },
  { x: "2.5%", y: "88%", t: 6 },
  { x: "53%", y: "49%", t: 8 },
  { x: "34%", y: "91%", t: 6.5 },
  { x: "63%", y: "88%", t: 5 },
  { x: "94%", y: "52%", t: 7.5 },
];

/**
 * The hero's background: a grid whose lines light up around the pointer, plus a few twinkling marks.
 * The ripples around the photo live in Hero.tsx, since they are placed relative to it.
 * Everything here is decoration, so it is hidden from assistive technology.
 */
export default function HeroBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const panel = el?.parentElement;
    if (!el || !panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${event.clientX - box.left}px`);
      el.style.setProperty("--my", `${event.clientY - box.top}px`);
    };
    // Let go of the pointer and the light settles back to where it rests.
    const leave = () => {
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };

    panel.addEventListener("pointermove", move);
    panel.addEventListener("pointerleave", leave);
    return () => {
      panel.removeEventListener("pointermove", move);
      panel.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={root} className="hero-bg" aria-hidden="true">
      <span className="hero-bg__glow" />
      <span className="hero-bg__grid" />
      <span className="hero-bg__grid hero-bg__grid--lit" />
      {crosses.map((cross, index) => (
        <span
          key={index}
          className="hero-cross"
          style={
            {
              "--x": cross.x,
              "--y": cross.y,
              "--t": `${cross.t}s`,
              animationDelay: `${index * -1.1}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
