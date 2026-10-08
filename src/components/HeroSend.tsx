"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Tick from "@/components/Tick";
import { sample } from "@/lib/sample";

export default function HeroSend() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const id = el.querySelector<HTMLElement>(".send-card__id")!;
      const typed = { chars: sample.bloxId.length };
      const write = () => {
        id.textContent = sample.bloxId.slice(0, Math.round(typed.chars));
      };
      const clear = () => {
        typed.chars = 0;
        write();
      };

      // The page arrives showing the finished transfer. Hold it, then clear the card for the first run.
      const intro = gsap
        .timeline()
        .to(
          [".sent-toast", ".send-card__match"],
          { autoAlpha: 0, duration: 0.3, ease: "power2.in" },
          2.8,
        )
        .call(clear)
        .to({}, { duration: 0.4 });

      // Type the Blox ID, show whose it is, confirm, done. Then clear and go again.
      const loop = gsap
        .timeline({ repeat: -1, defaults: { ease: "expo.out" } })
        .call(() => el.setAttribute("data-typing", ""), [], 0.05)
        .fromTo(
          typed,
          { chars: 0 },
          {
            chars: sample.bloxId.length,
            duration: 0.9,
            ease: `steps(${sample.bloxId.length})`,
            immediateRender: false,
            onUpdate: write,
          },
          0.5,
        )
        .call(() => el.removeAttribute("data-typing"))
        .fromTo(
          ".send-card__match",
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.55, immediateRender: false },
          "+=0.3",
        )
        .fromTo(
          ".send-card__check path",
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 0.4,
            ease: "power2.out",
            immediateRender: false,
          },
          "<0.1",
        )
        .to(
          ".send-card__confirm",
          { scale: 0.95, duration: 0.12, ease: "power2.out" },
          "+=0.8",
        )
        .to(".send-card__confirm", { scale: 1, duration: 0.45 })
        .fromTo(
          ".sent-toast",
          { autoAlpha: 0, y: -12, scale: 0.95 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            immediateRender: false,
          },
          "-=0.3",
        )
        .fromTo(
          ".sent-toast__icon path",
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 0.45,
            ease: "power2.out",
            immediateRender: false,
          },
          "<0.25",
        )
        .to(
          [".sent-toast", ".send-card__match"],
          { autoAlpha: 0, duration: 0.3, ease: "power2.in" },
          "+=2.8",
        )
        .call(clear)
        .to({}, { duration: 0.4 });

      const sequence = gsap.timeline({ paused: true }).add(intro).add(loop);

      // Only run while the hero is on screen.
      const watch = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) =>
          self.isActive ? sequence.play() : sequence.pause(),
      });
      if (watch.isActive) sequence.play();

      // As the block scrolls away its layers drift apart. Hero.css turns --drift (0 to 1) into movement,
      // which keeps GSAP's transforms off the elements that also have a CSS entrance.
      const visual = el.parentElement!;
      ScrollTrigger.create({
        trigger: el.closest(".hero-panel"),
        start: 0,
        end: "bottom top",
        onUpdate: (self) =>
          visual.style.setProperty("--drift", self.progress.toFixed(4)),
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="hero-send"
      role="img"
      aria-label={`Sending ${sample.amount} to the Blox ID ${sample.bloxId}. The recipient's verified name, ${sample.name}, shows before you confirm.`}
    >
      <div className="send-card">
        <p className="send-card__label">Send to a Blox ID</p>
        <p className="send-card__field">
          <span className="send-card__id">{sample.bloxId}</span>
          <i className="send-card__caret" />
        </p>
        <p className="send-card__match">
          <svg className="send-card__check" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.5 4.75 9 10 3.25"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {sample.name}
          <span className="send-card__note">Verified</span>
        </p>
        <p className="send-card__amount">
          <span className="send-card__label">You send</span>
          <strong>{sample.amount}</strong>
        </p>
        <span className="send-card__confirm">Confirm</span>
      </div>

      <div className="sent-toast-slot">
        <div className="sent-toast">
          <Tick className="sent-toast__icon" />
          <p>
            <strong>{sample.amount} sent</strong>
            <span className="sent-toast__meta">
              To {sample.firstName} · Completed
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
