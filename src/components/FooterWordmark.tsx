"use client";

import { useEffect, useRef } from "react";

const WORD = "blox";

// Canvas colours are plain numbers, so read a CSS token by letting a canvas turn it into rgb.
function token(name: string, fallback: number[]) {
  const probe = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  });
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!probe || !value) return fallback;
  probe.fillStyle = "#010203";
  probe.fillStyle = value;
  probe.fillRect(0, 0, 1, 1);
  const [red, green, blue] = probe.getImageData(0, 0, 1, 1).data;
  return red === 1 && green === 2 && blue === 3 ? fallback : [red, green, blue];
}

const mix = (from: number[], to: number[], amount: number) =>
  from.map((value, index) => Math.round(value + (to[index] - value) * amount));

type Wave = { x: number; y: number; born: number };

/**
 * The word "blox", set huge and built from small square blocks. Moving across it lights blocks violet,
 * and they fade out behind you. Tapping or clicking sends a wave through the letters. Nothing runs while
 * nothing is lit, and nothing runs at all while the footer is off screen.
 */
export default function FooterWordmark() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const host = el?.parentElement;
    const ctx = el?.getContext("2d");
    if (!el || !host || !ctx) return;

    const layer = document.createElement("canvas");
    const lctx = layer.getContext("2d");
    if (!lctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const family = getComputedStyle(el).fontFamily;
    const ink = token("--ink", [14, 11, 20]);
    const paper = token("--paper", [250, 249, 254]);
    const violet = token("--violet", [123, 44, 255]);
    const base = mix(ink, paper, 0.12);

    let width = 0;
    let height = 0;
    let ratio = 1;
    let size = 100;
    let ascent = 0;
    let left = 0;
    let cell = 16;
    let cols = 0;
    let rows = 0;
    let lit = new Float32Array(0);
    let waves: Wave[] = [];
    let last: { x: number; y: number } | null = null;
    let running = false;
    let visible = false;
    let frameId = 0;
    let before = 0;
    let now = 0;

    const draw = () => {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      lctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      lctx.globalCompositeOperation = "source-over";
      lctx.clearRect(0, 0, width, height);

      const gap = Math.max(1.5, cell * 0.09);
      const side = cell - gap;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const amount = lit[r * cols + c];
          const x = c * cell + gap / 2;
          const y = r * cell + gap / 2;
          lctx.fillStyle = `rgb(${base})`;
          lctx.fillRect(x, y, side, side);
          if (amount < 0.02) continue;
          lctx.fillStyle = `rgba(${violet}, ${Math.min(1, amount)})`;
          lctx.fillRect(x, y, side, side);
          if (amount > 0.7) {
            lctx.fillStyle = `rgba(${paper}, ${((amount - 0.7) / 0.3) * 0.85})`;
            lctx.fillRect(x, y, side, side);
          }
        }
      }

      // Keep only what falls inside the letters.
      lctx.globalCompositeOperation = "destination-in";
      lctx.fillStyle = "#000";
      lctx.font = `800 ${size}px ${family}`;
      lctx.textBaseline = "alphabetic";
      lctx.fillText(WORD, left, ascent);
      lctx.globalCompositeOperation = "source-over";
      ctx.drawImage(layer, 0, 0, width, height);
    };

    const frame = (time: number) => {
      const dt = Math.min(0.05, Math.max(0, (time - before) / 1000));
      before = time;
      now = time;
      const fade = Math.exp(-dt * 2.4);
      let busy = false;

      waves = waves.filter((wave) => now - wave.born < 1700);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          let amount = lit[index] * fade;
          const cx = c * cell + cell / 2;
          const cy = r * cell + cell / 2;
          for (const wave of waves) {
            const age = (now - wave.born) / 1000;
            const away = Math.hypot(cx - wave.x, cy - wave.y);
            const off = Math.abs(away - age * 1100) / (cell * 1.4);
            if (off < 1) amount = Math.max(amount, (1 - off) * (1 - age / 1.7));
          }
          if (amount < 0.01) amount = 0;
          else busy = true;
          lit[index] = amount;
        }
      }
      draw();
      if (busy || waves.length) frameId = requestAnimationFrame(frame);
      else running = false;
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      before = performance.now();
      frameId = requestAnimationFrame(frame);
    };

    const light = (px: number, py: number, strength = 1) => {
      const reach = 1.9;
      const col = Math.floor(px / cell);
      const row = Math.floor(py / cell);
      for (let r = row - 2; r <= row + 2; r++) {
        for (let c = col - 2; c <= col + 2; c++) {
          if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
          const away = Math.hypot(c + 0.5 - px / cell, r + 0.5 - py / cell);
          if (away > reach) continue;
          const index = r * cols + c;
          lit[index] = Math.max(lit[index], strength * (1 - away / reach));
        }
      }
    };

    const fit = () => {
      width = host.clientWidth;
      if (!width) return;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      const probe = lctx;
      probe.font = `800 100px ${family}`;
      const measured = probe.measureText(WORD);
      const span =
        measured.actualBoundingBoxLeft + measured.actualBoundingBoxRight;
      size = (100 * width) / span;
      probe.font = `800 ${size}px ${family}`;
      const exact = probe.measureText(WORD);
      ascent = exact.actualBoundingBoxAscent;
      left = exact.actualBoundingBoxLeft;
      height = Math.ceil(ascent + exact.actualBoundingBoxDescent);
      el.style.height = `${height}px`;
      el.width = Math.round(width * ratio);
      el.height = Math.round(height * ratio);
      layer.width = el.width;
      layer.height = el.height;
      cell = Math.max(10, Math.round(height / 9));
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      lit = new Float32Array(cols * rows);
      draw();
    };

    fit();
    // The font may not have arrived yet, and its shapes decide the size.
    document.fonts.ready.then(fit);
    const resize = new ResizeObserver(fit);
    resize.observe(host);

    let sparkle = 0;
    const cleanup = () => {
      cancelAnimationFrame(frameId);
      window.clearInterval(sparkle);
      resize.disconnect();
    };
    if (reduce) return cleanup;

    const point = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const move = (event: PointerEvent) => {
      const next = point(event);
      if (next.y < -cell * 2 || next.y > height + cell * 2) {
        last = null;
        return;
      }
      // Fill in the path between two events, so a fast swipe leaves a line and not dots.
      const from = last ?? next;
      const steps = Math.max(
        1,
        Math.ceil(Math.hypot(next.x - from.x, next.y - from.y) / (cell * 0.5)),
      );
      for (let i = 1; i <= steps; i++) {
        light(
          from.x + ((next.x - from.x) * i) / steps,
          from.y + ((next.y - from.y) * i) / steps,
        );
      }
      last = next;
      start();
    };
    const leave = () => {
      last = null;
    };
    const press = (event: PointerEvent) => {
      const at = point(event);
      if (at.y < -cell * 2 || at.y > height + cell * 2) return;
      waves.push({ x: at.x, y: at.y, born: performance.now() });
      start();
    };

    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerdown", press);

    // A gentle sparkle every couple of seconds so the word is never completely still.
    const watch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    watch.observe(host);
    sparkle = window.setInterval(() => {
      if (!visible || running) return;
      light(Math.random() * width, Math.random() * height, 0.9);
      start();
    }, 2200);

    return () => {
      cleanup();
      watch.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerdown", press);
    };
  }, []);

  return (
    <div className="ft-word">
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  );
}
