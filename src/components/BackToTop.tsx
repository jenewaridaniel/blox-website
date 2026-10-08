"use client";

import Arrow from "@/components/Arrow";

export default function BackToTop() {
  return (
    <button
      type="button"
      className="ft-top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
    >
      Back to top
      <Arrow />
    </button>
  );
}
