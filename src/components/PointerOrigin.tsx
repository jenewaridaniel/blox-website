"use client";

import { useEffect } from "react";

// A block button's fill floods in from wherever the pointer crossed its edge
// and drains back to where it left. This records that point for all of them.
export default function PointerOrigin() {
  useEffect(() => {
    const mark = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const button = (event.target as Element | null)?.closest<HTMLElement>(
        ".block-btn",
      );
      if (!button || button.contains(event.relatedTarget as Node | null))
        return;
      const box = button.getBoundingClientRect();
      button.style.setProperty("--fx", `${event.clientX - box.left}px`);
      button.style.setProperty("--fy", `${event.clientY - box.top}px`);
    };

    document.addEventListener("pointerover", mark);
    document.addEventListener("pointerout", mark);
    return () => {
      document.removeEventListener("pointerover", mark);
      document.removeEventListener("pointerout", mark);
    };
  }, []);

  return null;
}
