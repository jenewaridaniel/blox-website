"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while the element is on screen. Loops and timers use it to run only when someone can see them. */
export function useInView(target: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const watch = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    watch.observe(el);
    return () => watch.disconnect();
  }, [target]);
  return inView;
}
