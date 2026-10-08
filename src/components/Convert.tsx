"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { buildConvert, CONVERT_USDT } from "@/lib/rates";
import { sample } from "@/lib/sample";
import { useRates } from "@/lib/useRates";

const steps = [
  "Sell your USDT at the rate you see.",
  "The Naira lands in your balance.",
  "Send it on to any Blox ID.",
];

const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

export default function Convert() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const rates = useRates(panel);
  const info = buildConvert(rates);
  // The count-up reads the amount when it runs, so live prices that arrive mid-scene are picked up.
  const amount = useRef(info.amount);
  useEffect(() => {
    amount.current = info.amount;
  }, [info.amount]);

  useGSAP(
    () => {
      const el = root.current!;
      const pick = (selector: string) =>
        el.querySelector<HTMLElement>(selector)!;
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const from = pick(".cv-well--from");
        const to = pick(".cv-well--to");
        const figure = pick(".cv-amount");
        let story: gsap.core.Timeline | undefined;
        let active = false;

        const build = () => {
          story?.kill();
          const a = from.getBoundingClientRect();
          const b = to.getBoundingClientRect();
          const count = { value: 0 };
          const show = () => {
            figure.textContent = naira(
              Math.round(count.value * amount.current),
            );
          };

          // The finished state is what the markup holds; this winds it back and plays it forward.
          story = gsap
            .timeline({
              paused: true,
              repeat: -1,
              repeatDelay: 0.5,
              defaults: { ease: "expo.out" },
            })
            .set(".cv-block", { x: 0, y: 0, scale: 1, autoAlpha: 0 }, 0)
            .set(".cv-face--usdt", { autoAlpha: 1, yPercent: 0 }, 0)
            .set(".cv-face--naira", { autoAlpha: 0, yPercent: 70 }, 0)
            .set(".cv-fill", { clipPath: "inset(100% 0% 0% 0%)" }, 0)
            .set(".cv-chip", { autoAlpha: 0, scale: 0.85 }, 0)
            .set(".cv-status__wait", { autoAlpha: 1 }, 0)
            .set(".cv-status__done", { autoAlpha: 0, y: 8 }, 0)
            .set(".cv-toast", { autoAlpha: 0, y: 14 }, 0)
            .set(count, { value: 0 }, 0)
            .call(show, [], 0)
            .fromTo(
              ".cv-block",
              { y: -24 },
              { y: 0, autoAlpha: 1, duration: 0.8 },
              0.2,
            )
            .to(".cv-chip", { autoAlpha: 1, scale: 1, duration: 0.7 }, 1)
            .to(
              ".cv-face--usdt",
              { autoAlpha: 0, yPercent: -70, duration: 0.5, ease: "power2.in" },
              2,
            )
            .to(
              ".cv-fill",
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.8,
                ease: "power3.inOut",
              },
              2,
            )
            .to(
              ".cv-face--naira",
              { autoAlpha: 1, yPercent: 0, duration: 0.7 },
              2.45,
            )
            .to(
              count,
              { value: 1, duration: 1.1, ease: "power2.out", onUpdate: show },
              2.45,
            )
            .to(
              ".cv-chip",
              { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
              4,
            )
            .to(
              ".cv-block",
              {
                x: b.left - a.left,
                y: b.top - a.top,
                duration: 1.1,
                ease: "power3.inOut",
              },
              4,
            )
            .to(".cv-status__wait", { autoAlpha: 0, duration: 0.25 }, 5.1)
            .to(".cv-status__done", { autoAlpha: 1, y: 0, duration: 0.6 }, 5.2)
            .fromTo(
              ".cv-ring",
              { autoAlpha: 0.7, scale: 0.6 },
              { autoAlpha: 0, scale: 1.7, duration: 0.9, ease: "power2.out" },
              5.2,
            )
            .to(".cv-toast", { autoAlpha: 1, y: 0, duration: 0.7 }, 5.4)
            .to({}, { duration: 2.2 })
            .to([".cv-block", ".cv-toast"], {
              autoAlpha: 0,
              duration: 0.5,
              ease: "power2.in",
            });

          if (active) story.play();
        };

        build();
        const watch = ScrollTrigger.create({
          trigger: panel.current,
          start: "top 85%",
          end: "bottom 15%",
          onToggle: (self) => {
            active = self.isActive;
            if (active) story?.play();
            else story?.pause();
          },
        });
        active = watch.isActive;
        if (active) story?.play();

        // The two ends move when the layout does (phone to desktop), so the journey is measured again.
        let frame = 0;
        let first = true;
        const resize = new ResizeObserver(() => {
          // The observer reports once as soon as it starts; the scene was just built, so skip that.
          if (first) {
            first = false;
            return;
          }
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(build);
        });
        resize.observe(panel.current!);

        return () => {
          cancelAnimationFrame(frame);
          resize.disconnect();
          story?.kill();
        };
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="convert" aria-labelledby="convert-title">
      <div ref={panel} className="convert-panel">
        <div className="convert-copy">
          <h2 id="convert-title" className="convert-title">
            USDT in. Naira out. Sent.
          </h2>
          <p className="convert-sub">
            Sell crypto for Naira and send it straight on, all inside Blox. No
            bank transfer in the middle, and no second app.
          </p>
          <ol className="convert-steps">
            {steps.map((step, index) => (
              <li key={step}>
                <span aria-hidden="true">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div
          className="convert-scene"
          role="img"
          aria-label={`${CONVERT_USDT} USDT is sold at ${info.rateText} per USDT and becomes ${naira(info.amount)}, which is then sent to ${sample.firstName}'s Blox ID.`}
        >
          <div className="cv-slot cv-slot--from">
            <span className="cv-well cv-well--from" />
            <div className="cv-block">
              <span className="cv-layer cv-layer--ink" />
              <span className="cv-layer cv-layer--violet cv-fill" />
              <span className="cv-face cv-face--usdt">
                <small>You sell</small>
                <strong>{CONVERT_USDT} USDT</strong>
              </span>
              <span className="cv-face cv-face--naira">
                <small>You get</small>
                <strong className="cv-amount">{naira(info.amount)}</strong>
              </span>
            </div>
          </div>

          <div className="cv-slot cv-slot--rate">
            <span className="cv-chip">
              <strong>1 USDT = {info.rateText}</strong>
            </span>
          </div>

          <div className="cv-slot cv-slot--to">
            <div className="cv-person">
              <span className="cv-avatar">{sample.firstName[0]}</span>
              <div>
                <strong>{sample.firstName}</strong>
                <small>Blox ID {sample.bloxId}</small>
              </div>
            </div>
            <span className="cv-well cv-well--to" />
            <p className="cv-status">
              <span className="cv-status__wait">Waiting for the transfer</span>
              <span className="cv-status__done">
                <i className="cv-ring" />
                Received
              </span>
            </p>
          </div>

          <p className="cv-toast">
            {naira(info.amount)} sent to {sample.firstName}
          </p>
        </div>
      </div>
    </section>
  );
}
