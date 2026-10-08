"use client";

import { useEffect, useState, type RefObject } from "react";
import { loadRates, type Rates } from "@/lib/rates";

/**
 * Live market prices, asked for once when `target` is about to come into view. Until they arrive, and if
 * anything goes wrong (offline, rate limited, odd response), this returns null and the caller keeps its
 * example figures.
 */
export function useRates(target: RefObject<HTMLElement | null>): Rates | null {
  const [rates, setRates] = useState<Rates | null>(null);

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let live = true;
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        watch.disconnect();
        loadRates()
          .then((next) => live && setRates(next))
          .catch(() => {});
      },
      { rootMargin: "600px 0px" },
    );
    watch.observe(el);
    return () => {
      live = false;
      watch.disconnect();
    };
  }, [target]);

  return rates;
}
