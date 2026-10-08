"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { sample } from "@/lib/sample";

const steps = [
  {
    title: "Enter their Blox ID",
    text: "Eight digits, typed or pasted. No bank details and no wallet address to get wrong.",
  },
  {
    title: "See who it is",
    text: "Their verified name shows before you confirm, so you always know who you are sending to.",
  },
  {
    title: "Confirm, and it’s there",
    text: "It arrives instantly. You both get a notification, and the transfer gets its own reference.",
  },
];

// Where each step begins on the story's timeline, in seconds.
const VERIFY_AT = 3.4;
const SEND_AT = 5.6;

export default function BloxId() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;

      // The markup arrives showing the finished transfer. The story rewinds it and plays it forward:
      // the digits build the row, the row turns violet once the name is verified, the money crosses.
      const build = () => {
        const story = gsap.timeline({
          paused: true,
          defaults: { ease: "expo.out" },
          onUpdate: () => {
            const time = story.time();
            const step =
              time < VERIFY_AT - 0.1 ? 1 : time < SEND_AT - 0.1 ? 2 : 3;
            if (section.dataset.step !== String(step))
              section.dataset.step = String(step);
          },
        });

        return story
          .fromTo(
            ".bloxid-cell__ink",
            { yPercent: -101 },
            { yPercent: 0, duration: 0.5, stagger: 0.3 },
            0.2,
          )
          .fromTo(
            ".bloxid-cell__digit",
            { autoAlpha: 0, yPercent: 45 },
            { autoAlpha: 1, yPercent: 0, duration: 0.5, stagger: 0.3 },
            0.28,
          )
          .fromTo(
            ".bloxid-cell__violet",
            { yPercent: 101 },
            { yPercent: 0, duration: 0.6, stagger: 0.07 },
            VERIFY_AT,
          )
          .fromTo(
            ".bloxid-who__wait",
            { autoAlpha: 1, yPercent: 0 },
            { autoAlpha: 0, yPercent: -45, duration: 0.3, ease: "power2.in" },
            VERIFY_AT + 0.1,
          )
          .fromTo(
            ".bloxid-who__name",
            { autoAlpha: 0, yPercent: 45 },
            { autoAlpha: 1, yPercent: 0, duration: 0.6 },
            VERIFY_AT + 0.4,
          )
          .fromTo(
            ".bloxid-who__name path",
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 0.4, ease: "power2.out" },
            VERIFY_AT + 0.6,
          )
          .fromTo(
            ".bloxid-money--out",
            { autoAlpha: 1, yPercent: 0 },
            { yPercent: 130, duration: 0.5, ease: "power3.in" },
            SEND_AT,
          )
          .set(".bloxid-money--out", { autoAlpha: 0 })
          .fromTo(
            ".bloxid-pad__sent",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4, ease: "power2.out" },
            SEND_AT + 0.55,
          )
          .to(
            ".bloxid-cell__pulse",
            {
              keyframes: { opacity: [0, 0.55, 0] },
              duration: 0.45,
              stagger: 0.1,
              ease: "none",
            },
            SEND_AT + 0.4,
          )
          .fromTo(
            ".bloxid-money--in",
            { autoAlpha: 0, yPercent: -130 },
            { autoAlpha: 1, yPercent: 0, duration: 0.7 },
            SEND_AT + 1.35,
          )
          .fromTo(
            ".bloxid-facts li",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.14 },
            SEND_AT + 1.8,
          )
          .to({}, { duration: 1.3 });
      };

      const media = gsap.matchMedia();
      media.add(
        {
          // Wide screens: the section pins and scrolling scrubs the story.
          pinned:
            "(width >= 64rem) and (prefers-reduced-motion: no-preference)",
          // Narrow screens: no pinning, the story plays by itself while it is in view.
          playing:
            "(width < 64rem) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const story = build();
          section.dataset.step = "1";

          if (context.conditions?.pinned) {
            section.dataset.mode = "pinned";
            ScrollTrigger.create({
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
              animation: story,
            });
          } else {
            story.repeat(-1).repeatDelay(2.4);
            const watch = ScrollTrigger.create({
              trigger: section.querySelector(".bloxid-visual"),
              start: "top 85%",
              end: "bottom 15%",
              onToggle: (self) =>
                self.isActive ? story.play() : story.pause(),
            });
            if (watch.isActive) story.play();
          }

          return () => {
            delete section.dataset.step;
            delete section.dataset.mode;
          };
        },
        section,
      );

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bloxid" aria-labelledby="bloxid-title">
      <div className="bloxid-stage">
        <div className="bloxid-inner">
          <header className="bloxid-head">
            <h2 id="bloxid-title" className="bloxid-title">
              Eight digits. That’s all it takes to send.
            </h2>
            <p className="bloxid-intro">
              Every Blox account has its own Blox ID: an eight-digit number you
              can copy and share. It is all anyone needs to send to you.
            </p>
          </header>

          <div
            className="bloxid-visual"
            role="img"
            aria-label={`Illustration: the Blox ID ${sample.bloxId} is entered, the name ${sample.name} is verified, and ${sample.amount} moves across to her.`}
          >
            <div className="bloxid-row">
              <span className="bloxid-pad">
                <span className="bloxid-pad__sent">Sent</span>
                <strong className="bloxid-money bloxid-money--out">
                  {sample.amount}
                </strong>
              </span>
              <span className="bloxid-tag">You send</span>
            </div>

            <div className="bloxid-cells">
              {Array.from(sample.bloxId, (digit, index) => (
                <span key={index} className="bloxid-cell">
                  <span className="bloxid-cell__ink" />
                  <span className="bloxid-cell__violet" />
                  <span className="bloxid-cell__digit">{digit}</span>
                  <span className="bloxid-cell__pulse" />
                </span>
              ))}
            </div>

            <div className="bloxid-row bloxid-row--end">
              <ul className="bloxid-facts">
                <li>Instant</li>
                <li>Both notified</li>
                <li>Reference generated</li>
              </ul>
              <span className="bloxid-who">
                <span className="bloxid-who__wait">Whose ID is it?</span>
                <span className="bloxid-who__name">
                  <svg viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6.5 4.75 9 10 3.25"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {sample.name}
                  <small>Verified name</small>
                </span>
              </span>
              <span className="bloxid-pad">
                <strong className="bloxid-money bloxid-money--in">
                  {sample.amount}
                </strong>
              </span>
            </div>
          </div>

          <ol className="bloxid-steps">
            {steps.map((step, index) => (
              <li key={step.title} className="bloxid-step">
                <span className="bloxid-step__n" aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
