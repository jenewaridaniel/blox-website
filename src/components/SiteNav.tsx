"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { isCurrent, navCta, navItems } from "@/lib/nav";
import Arrow from "@/components/Arrow";
import BloxWordmark from "@/components/BloxWordmark";
import NavMenu from "@/components/NavMenu";

type Rect = { l: number; r: number };
type Scrub = { id: number; x: number; index: number; active: boolean };

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const tray = useRef<HTMLDivElement>(null);
  const blox = useRef<HTMLSpanElement>(null);
  const logo = useRef<HTMLAnchorElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);
  const onRoute = useRef<(rest: number) => void>(null);

  const current = navItems.findIndex((item) => isCurrent(pathname, item.href));
  // Pages outside the nav leave the blox on the logo.
  const rest = Math.max(current, 0);

  useGSAP(() => {
    const headerEl = header.current!;
    const trayEl = tray.current!;
    const bloxEl = blox.current!;
    const ctaEl = cta.current!;
    const cells = gsap.utils.toArray<HTMLElement>("[data-cell]", trayEl);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(width >= 48rem)");
    const dur = (seconds: number) => (reduce.matches ? 0 : seconds);

    const edges = { l: 0, r: 0, press: 0, tray: 0 };
    let rects: Rect[] = [];
    let sizes = "";
    let home = rest;
    let hover: number | null = null;
    let focused: number | null = null;
    let packed = false;
    let scrub: Scrub | null = null;
    let swallowClick = false;

    const apply = () => {
      bloxEl.style.setProperty("--bl", `${edges.l}px`);
      bloxEl.style.setProperty("--br", `${edges.r}px`);
      bloxEl.style.setProperty("--bp", `${edges.press}px`);
      trayEl.style.setProperty("--tray-r", `${edges.tray}px`);
    };
    const tween = (vars: gsap.TweenVars) =>
      gsap.to(edges, {
        ease: "expo.out",
        overwrite: "auto",
        onUpdate: apply,
        ...vars,
      });

    // Cells hidden on small screens measure as zero wide; the blox falls back to the logo.
    const shown = (index: number) =>
      rects[index].r > rects[index].l ? index : 0;
    const target = () => shown(hover ?? focused ?? (packed ? 0 : home));
    const cellAt = (node: EventTarget | Element | null) => {
      const cell = (node as Element | null)?.closest<HTMLElement>(
        "[data-cell]",
      );
      return cell ? cells.indexOf(cell) : -1;
    };
    const packedWidth = () => rects[0].r + rects[0].l;

    // The leading edge arrives first and the trailing edge catches up, so the block stretches as it travels.
    const slide = () => {
      const { l, r } = rects[target()];
      const rightward = l + r > edges.l + edges.r;
      tween({ l, duration: dur(rightward ? 0.55 : 0.3) });
      tween({ r, duration: dur(rightward ? 0.3 : 0.55) });
    };

    const measure = () => {
      rects = cells.map((cell) => ({
        l: cell.offsetLeft,
        r: cell.offsetLeft + cell.offsetWidth,
      }));
      sizes = rects.map((rect) => rect.r).join();
      gsap.killTweensOf(edges);
      const { l, r } = rects[target()];
      Object.assign(edges, {
        l,
        r,
        press: 0,
        tray: packed ? packedWidth() : trayEl.offsetWidth,
      });
      apply();
    };

    const pack = (next: boolean) => {
      if (next === packed) return;
      packed = next;
      headerEl.toggleAttribute("data-packed", next);
      tween({
        tray: next ? packedWidth() : trayEl.offsetWidth,
        duration: dur(next ? 0.6 : 0.65),
        ease: next ? "expo.inOut" : "expo.out",
      });
      slide();
    };

    const point = () => {
      if (packed) pack(false);
      else slide();
    };

    measure();
    headerEl.setAttribute("data-ready", "");

    // On a fresh load the violet floods the whole tray once, then settles back into its block.
    const sinceLoad = performance.now() / 1000;
    if (!reduce.matches && wide.matches && sinceLoad < 2) {
      const { l, r } = rects[target()];
      gsap
        .timeline({ delay: Math.max(0, 0.8 - sinceLoad), onUpdate: apply })
        .to(edges, {
          l: rects[0].l,
          r: rects[rects.length - 1].r,
          duration: 0.6,
          ease: "expo.inOut",
        })
        .to(edges, { l, r, duration: 0.7, ease: "expo.out" });
    }

    const observer = new ResizeObserver(() => {
      const next = cells
        .map((cell) => cell.offsetLeft + cell.offsetWidth)
        .join();
      if (next !== sizes) measure();
    });
    observer.observe(trayEl);

    // Scrolling down folds the tray into the logo block; scrolling up deals it back out.
    let lastY = window.scrollY;
    let travel = 0;
    const onScroll = () => {
      readTone();
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      travel = delta * travel > 0 ? travel + delta : delta;
      if (y < 80 || travel < -24) pack(false);
      else if (
        travel > 48 &&
        hover === null &&
        !scrub &&
        !trayEl.querySelector(":focus-visible")
      )
        pack(true);
    };

    const onOver = (event: PointerEvent) => {
      const index = cellAt(event.target);
      if (event.pointerType !== "mouse" || scrub?.active || index < 0) return;
      hover = index;
      point();
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || scrub?.active) return;
      if (scrub) {
        // A press that slides off the tray never gets its pointerup here.
        scrub = null;
        tween({ press: 0, duration: dur(0.4) });
      }
      hover = null;
      slide();
    };
    const onFocusIn = (event: FocusEvent) => {
      const index = cellAt(event.target);
      if (index < 0 || !(event.target as Element).matches(":focus-visible"))
        return;
      focused = index;
      point();
    };
    const onFocusOut = () => {
      focused = null;
      slide();
    };

    // Press a cell and drag: the blox follows the pointer and goes wherever it is dropped.
    const onDown = (event: PointerEvent) => {
      const index = cellAt(event.target);
      if (event.button !== 0 || index < 0) return;
      swallowClick = false;
      scrub = { id: event.pointerId, x: event.clientX, index, active: false };
      hover = index;
      slide();
      tween({ press: 2, duration: dur(0.12) });
    };
    const onMove = (event: PointerEvent) => {
      if (!scrub || event.pointerId !== scrub.id || !wide.matches) return;
      if (!scrub.active) {
        if (Math.abs(event.clientX - scrub.x) < 6) return;
        scrub.active = true;
        trayEl.setPointerCapture(event.pointerId);
        headerEl.setAttribute("data-scrubbing", "");
      }
      const x = event.clientX - trayEl.getBoundingClientRect().left;
      let gap = Infinity;
      rects.forEach((rect, index) => {
        const distance = Math.max(rect.l - x, x - rect.r, 0);
        if (rect.r > rect.l && distance < gap) {
          gap = distance;
          scrub!.index = index;
        }
      });
      const { l, r } = rects[scrub.index];
      const left = gsap.utils.clamp(
        rects[0].l,
        rects[rects.length - 1].r - (r - l),
        x - (r - l) / 2,
      );
      tween({
        l: left,
        r: left + r - l,
        duration: dur(0.25),
        ease: "power3.out",
      });
    };
    const onUp = (event: PointerEvent) => {
      if (!scrub || event.pointerId !== scrub.id) return;
      const { active, index } = scrub;
      const mouse = event.pointerType === "mouse";
      scrub = null;
      headerEl.removeAttribute("data-scrubbing");
      tween({ press: 0, duration: dur(0.4) });
      hover = mouse && event.type === "pointerup" ? index : null;

      if (event.type === "pointerup" && active) {
        // The drop does the navigating; the click that follows a drag would only repeat it.
        const moved = index !== home;
        swallowClick = true;
        home = index;
        window.setTimeout(() => {
          swallowClick = false;
          if (moved) cells[index].querySelector("a")?.click();
        });
      } else if (event.type === "pointerup" && !mouse) {
        // A tap: rest where the finger lifted so the blox does not dart home before the route changes.
        if (
          cellAt(document.elementFromPoint(event.clientX, event.clientY)) ===
          index
        )
          home = index;
      }
      slide();
    };
    const onClickCapture = (event: MouseEvent) => {
      if (!swallowClick) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const onDragStart = (event: DragEvent) => event.preventDefault();

    // The call to action leans toward the pointer.
    let ctaBox = ctaEl.getBoundingClientRect();
    const lean = (x: number, y: number, duration: number, ease: string) =>
      gsap.to(ctaEl, {
        "--mx": `${x}px`,
        "--my": `${y}px`,
        duration,
        ease,
        overwrite: "auto",
      });
    gsap.set(ctaEl, { "--mx": "0px", "--my": "0px" });
    const onCtaEnter = () => {
      const box = ctaEl.getBoundingClientRect();
      const style = getComputedStyle(ctaEl);
      // Measure the button where it rests, not where it has leaned to.
      ctaBox = new DOMRect(
        box.left - parseFloat(style.getPropertyValue("--mx")),
        box.top - parseFloat(style.getPropertyValue("--my")),
        box.width,
        box.height,
      );
    };
    const onCtaMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduce.matches) return;
      lean(
        (event.clientX - ctaBox.left - ctaBox.width / 2) * 0.12,
        (event.clientY - ctaBox.top - ctaBox.height / 2) * 0.2,
        0.5,
        "power3.out",
      );
    };
    const onCtaLeave = () => lean(0, 0, dur(0.7), "expo.out");

    const onWide = () => {
      if (wide.matches) setMenuOpen(false);
    };

    // Sections say what colour they put behind the nav (data-nav-tone) so the call to action can stay visible.
    const readTone = () => {
      const line = headerEl.offsetHeight / 2;
      let tone = "";
      document
        .querySelectorAll<HTMLElement>("[data-nav-tone]")
        .forEach((zone) => {
          const box = zone.getBoundingClientRect();
          if (box.top <= line && box.bottom >= line)
            tone = zone.dataset.navTone ?? "";
        });
      if (headerEl.dataset.tone !== tone) headerEl.dataset.tone = tone;
    };
    readTone();

    onRoute.current = (index) => {
      readTone();
      if (index === home) return;
      home = index;
      if (!scrub) slide();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", readTone);
    wide.addEventListener("change", onWide);
    trayEl.addEventListener("pointerover", onOver);
    trayEl.addEventListener("pointerleave", onLeave);
    trayEl.addEventListener("focusin", onFocusIn);
    trayEl.addEventListener("focusout", onFocusOut);
    trayEl.addEventListener("pointerdown", onDown);
    trayEl.addEventListener("pointermove", onMove);
    trayEl.addEventListener("pointerup", onUp);
    trayEl.addEventListener("pointercancel", onUp);
    trayEl.addEventListener("click", onClickCapture, true);
    trayEl.addEventListener("dragstart", onDragStart);
    ctaEl.addEventListener("pointerenter", onCtaEnter);
    ctaEl.addEventListener("pointermove", onCtaMove);
    ctaEl.addEventListener("pointerleave", onCtaLeave);

    return () => {
      onRoute.current = null;
      observer.disconnect();
      gsap.killTweensOf(edges);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", readTone);
      wide.removeEventListener("change", onWide);
      trayEl.removeEventListener("pointerover", onOver);
      trayEl.removeEventListener("pointerleave", onLeave);
      trayEl.removeEventListener("focusin", onFocusIn);
      trayEl.removeEventListener("focusout", onFocusOut);
      trayEl.removeEventListener("pointerdown", onDown);
      trayEl.removeEventListener("pointermove", onMove);
      trayEl.removeEventListener("pointerup", onUp);
      trayEl.removeEventListener("pointercancel", onUp);
      trayEl.removeEventListener("click", onClickCapture, true);
      trayEl.removeEventListener("dragstart", onDragStart);
      ctaEl.removeEventListener("pointerenter", onCtaEnter);
      ctaEl.removeEventListener("pointermove", onCtaMove);
      ctaEl.removeEventListener("pointerleave", onCtaLeave);
    };
  }, []);

  useEffect(() => {
    onRoute.current?.(rest);
  }, [rest, pathname]);

  return (
    <header ref={header} className="nav">
      <a href="#main" className="nav-skip">
        Skip to content
      </a>

      <nav className="nav-bar" aria-label="Main">
        <div ref={tray} className="nav-tray">
          <span ref={blox} className="nav-blox" aria-hidden="true" />
          <ul
            className="nav-row"
            style={{ "--last": navItems.length - 1 } as CSSProperties}
          >
            {navItems.map((item, index) => (
              <li
                key={item.href}
                data-cell
                style={{ "--i": index } as CSSProperties}
              >
                <Link
                  ref={index === 0 ? logo : undefined}
                  href={item.href}
                  className={
                    index === 0 ? "nav-cell nav-cell--logo" : "nav-cell"
                  }
                  aria-label={index === 0 ? "Blox home" : undefined}
                  aria-current={index === current ? "page" : undefined}
                  data-rest={index === rest ? "" : undefined}
                  draggable={false}
                >
                  {index === 0 ? (
                    <BloxWordmark />
                  ) : (
                    <span className="nav-label">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link ref={cta} href={navCta.href} className="block-btn nav-cta">
          {navCta.label}
          <Arrow />
        </Link>

        <button
          type="button"
          className="nav-menu-btn"
          aria-label="Menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(true)}
        >
          <span className="nav-bars" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </nav>

      <NavMenu
        open={menuOpen}
        pathname={pathname}
        origin={logo}
        onDismiss={() => setMenuOpen(false)}
      />
    </header>
  );
}
