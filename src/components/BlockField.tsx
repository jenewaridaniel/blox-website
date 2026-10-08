"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  /** 0 buy, 1 sell, 2 swap. Changing it turns the tide and sends a ring out from `origin`. */
  mode: number;
  /** Bump this to send a ring without changing mode. */
  pulse: number;
  origin: RefObject<HTMLElement | null>;
};

type Shade = { top: string; left: string; right: string };
type Ring = { x: number; y: number; born: number };

const LEVELS = 40;
/** The level at which a block is as tall and as bright as it gets. */
const PEAK = 1.4;

const smooth = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

// A fixed pseudo-random number per block, so the field has grain without flickering.
const grain = (c: number, r: number) => {
  const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// Canvas colours are written as rgb so they work wherever a 2D canvas does.
function rgb(l: number, c: number, h: number) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const channel = (v: number) =>
    Math.round(
      255 *
        Math.min(
          1,
          Math.max(
            0,
            v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055,
          ),
        ),
    );
  const red = channel(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S);
  const green = channel(
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
  );
  const blue = channel(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S);
  return `rgb(${red}, ${green}, ${blue})`;
}

// And back: sRGB bytes to lightness, chroma and hue.
function lch(red: number, green: number, blue: number) {
  const linear = (v: number) =>
    v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4;
  const [r, g, b] = [linear(red), linear(green), linear(blue)];
  const L = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const M = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const S = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * L - 2.428592205 * M + 0.4505937099 * S;
  const bb = 0.0259040371 * L + 0.7827717662 * M - 0.808675766 * S;
  return [
    0.2104542553 * L + 0.793617785 * M - 0.0040720468 * S,
    Math.hypot(a, bb),
    ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360,
  ];
}

// Low blocks are ink and vanish into the panel; they pass through violet as they rise and pale at the peak.
function shades(): Shade[] {
  // The build may rewrite a token into another colour syntax, so let a canvas resolve it to plain sRGB
  // instead of reading numbers out of the string.
  const probe = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  });
  const token = (name: string, fallback: number[]) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    if (!probe || !value) return fallback;
    probe.fillStyle = "#010203";
    probe.fillStyle = value;
    probe.fillRect(0, 0, 1, 1);
    const [red, green, blue] = probe.getImageData(0, 0, 1, 1).data;
    // Still the sentinel: this canvas could not read the colour.
    return red === 1 && green === 2 && blue === 3
      ? fallback
      : lch(red, green, blue);
  };
  const ink = token("--ink", [0.1581, 0.0193, 299.48]);
  const violet = token("--violet", [0.544, 0.2759, 290.83]);
  const stops = [
    [0, ...ink],
    [0.3, 0.25, 0.09, violet[2]],
    [0.7, 0.4, 0.2, violet[2]],
    [1, ...violet],
    [PEAK, 0.9, 0.07, violet[2]],
  ];

  return Array.from({ length: LEVELS }, (_, index) => {
    const level = (index / (LEVELS - 1)) * PEAK;
    const next = Math.max(
      1,
      stops.findIndex((stop) => stop[0] >= level),
    );
    const [t0, l0, c0, h0] = stops[next - 1];
    const [t1, l1, c1, h1] = stops[next];
    const t = (level - t0) / (t1 - t0);
    const l = l0 + (l1 - l0) * t;
    const c = c0 + (c1 - c0) * t;
    const h = h0 + (h1 - h0) * t;
    // The sides are darker than the top, but never darker than the panel, so low blocks have no visible edge.
    return {
      top: rgb(l, c, h),
      right: rgb(Math.max(ink[0], l * 0.8), c * 0.9, h),
      left: rgb(Math.max(ink[0], l * 0.62), c * 0.85, h),
    };
  });
}

/**
 * A sea of isometric blocks drawn on a 2D canvas behind its parent's content.
 * Waves roll through it, it swells under the pointer, and it fades to nothing
 * where the copy sits. No WebGL and no library, so it stays cheap on phones.
 */
export default function BlockField({ mode, pulse, origin }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const field = useRef<{ turn: (mode: number) => void; ring: () => void }>(
    null,
  );
  const lastMode = useRef(mode);

  useEffect(() => {
    const el = canvas.current;
    const host = el?.parentElement;
    const ctx = el?.getContext("2d");
    if (!el || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const palette = shades();
    const pointer = { x: 0, y: 0, toX: 0, toY: 0, on: 0, toOn: 0 };
    let rings: Ring[] = [];
    let width = 0;
    let height = 0;
    let tile = 60;
    let ratio = 1;
    let now = 0;
    let last = 0;
    let running = false;
    // The tide: `phase` carries the main wave, `flow` is its direction and speed, `cross` adds the chop used for swaps.
    let phase = 0;
    let flow = 1;
    let toFlow = 1;
    let cross = 0;
    let toCross = 0;

    const draw = () => {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Each block is a diamond `tile` wide and half as tall, sitting on a column.
      const stepX = tile / 2;
      const stepY = tile / 4;
      const gap = tile * 0.045;
      const hw = stepX - gap;
      const hh = stepY - gap / 2;
      const lift = tile * 1.4;
      const drop = stepY * 2;
      const stacked = width < 760;
      const rows = Math.ceil(height / stepY) + 8;
      const cols = Math.ceil(width / stepX) + 2;
      const spread = 2 * (tile * 2.4) ** 2;

      // Far rows first, so nearer blocks cover the feet of the ones behind.
      for (let r = -1; r <= rows; r++) {
        const y = r * stepY;
        for (let c = -2 + (Math.abs(r) % 2); c <= cols; c += 2) {
          const x = c * stepX;
          // How much of the field shows here: none behind the copy, all of it around the card.
          const reach = stacked
            ? smooth(height * 0.36, height * 0.6, y)
            : Math.max(
                smooth(width * 0.3, width * 0.68, x),
                0.5 * smooth(height * 0.74, height * 1.02, y),
              );
          if (reach < 0.02) continue;

          let level =
            0.42 +
            0.38 * Math.sin(c * 0.19 + r * 0.13 - phase) +
            0.2 * Math.sin(c * 0.07 - r * 0.21 + now * 0.35 + 1.3) +
            cross *
              0.22 *
              Math.sin(c * 0.42 + now * 0.9) *
              Math.sin(r * 0.33 - now * 0.7) +
            (grain(c, r) - 0.5) * 0.24;

          if (pointer.on > 0.01) {
            const dx = x - pointer.x;
            const dy = (y - pointer.y) * 2;
            level += pointer.on * 0.5 * Math.exp(-(dx * dx + dy * dy) / spread);
          }
          for (const ring of rings) {
            const age = now - ring.born;
            const dx = x - ring.x;
            const dy = (y - ring.y) * 2;
            const off = (Math.hypot(dx, dy) - age * 900) / (tile * 1.7);
            level += 0.75 * Math.exp(-off * off) * Math.max(0, 1 - age / 2);
          }

          level = Math.max(0, level) * reach;
          if (level < 0.015) continue;
          const top = y - level * lift;
          if (top - hh > height) continue;

          const shade =
            palette[
              Math.min(LEVELS - 1, Math.round((level / PEAK) * (LEVELS - 1)))
            ];

          ctx.fillStyle = shade.left;
          ctx.beginPath();
          ctx.moveTo(x - hw, top);
          ctx.lineTo(x, top + hh);
          ctx.lineTo(x, y + hh + drop);
          ctx.lineTo(x - hw, y + drop);
          ctx.fill();

          ctx.fillStyle = shade.right;
          ctx.beginPath();
          ctx.moveTo(x, top + hh);
          ctx.lineTo(x + hw, top);
          ctx.lineTo(x + hw, y + drop);
          ctx.lineTo(x, y + hh + drop);
          ctx.fill();

          ctx.fillStyle = shade.top;
          ctx.beginPath();
          ctx.moveTo(x, top - hh);
          ctx.lineTo(x + hw, top);
          ctx.lineTo(x, top + hh);
          ctx.lineTo(x - hw, top);
          ctx.fill();
        }
      }
    };

    const frame = (time: number) => {
      const step = Math.min(0.05, Math.max(0, time - last));
      last = time;
      now = time;
      const ease = Math.min(1, step * 2.4);
      flow += (toFlow - flow) * ease;
      cross += (toCross - cross) * ease;
      phase += step * 1.15 * flow;
      pointer.x += (pointer.toX - pointer.x) * Math.min(1, step * 9);
      pointer.y += (pointer.toY - pointer.y) * Math.min(1, step * 9);
      pointer.on += (pointer.toOn - pointer.on) * Math.min(1, step * 5);
      rings = rings.filter((ring) => now - ring.born < 2);
      draw();
    };

    const fit = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      // Full sharpness on small canvases, a little less on big ones to keep the fill cost down.
      ratio = Math.min(
        window.devicePixelRatio || 1,
        width * height > 900_000 ? 1.5 : 2,
      );
      el.width = Math.round(width * ratio);
      el.height = Math.round(height * ratio);
      tile = width < 640 ? 46 : width < 1100 ? 56 : 66;
      if (!running) draw();
    };

    // Only animate while the field is on screen.
    const run = (next: boolean) => {
      if (next === running) return;
      running = next;
      if (next) gsap.ticker.add(frame);
      else gsap.ticker.remove(frame);
    };

    const resize = new ResizeObserver(fit);
    resize.observe(el);
    const watch = new IntersectionObserver(([entry]) =>
      run(entry.isIntersecting && !reduce.matches),
    );
    watch.observe(el);

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = el.getBoundingClientRect();
      pointer.toX = event.clientX - box.left;
      pointer.toY = event.clientY - box.top;
      if (pointer.toOn === 0) {
        pointer.x = pointer.toX;
        pointer.y = pointer.toY;
      }
      pointer.toOn = 1;
    };
    const onLeave = () => {
      pointer.toOn = 0;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    field.current = {
      turn(next) {
        toFlow = next === 0 ? 1 : next === 1 ? -1 : 0.25;
        toCross = next === 2 ? 1 : 0;
        if (!reduce.matches) return;
        // Without motion each mode still gets its own still frame.
        phase = next * 2.1;
        cross = toCross;
        draw();
      },
      ring() {
        if (reduce.matches) return;
        const box = el.getBoundingClientRect();
        const from = origin.current?.getBoundingClientRect();
        rings.push({
          x: from ? from.left + from.width / 2 - box.left : width * 0.7,
          y: from ? from.top + from.height / 2 - box.top : height / 2,
          born: now,
        });
        if (rings.length > 3) rings.shift();
      },
    };

    return () => {
      field.current = null;
      run(false);
      resize.disconnect();
      watch.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [origin]);

  useEffect(() => {
    field.current?.turn(mode);
    if (lastMode.current !== mode) field.current?.ring();
    lastMode.current = mode;
  }, [mode]);

  useEffect(() => {
    if (pulse) field.current?.ring();
  }, [pulse]);

  return <canvas ref={canvas} className="block-field" aria-hidden="true" />;
}
