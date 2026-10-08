"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { sample } from "@/lib/sample";
import { useInView } from "@/lib/useInView";

const STATES = [
  { label: "Pending", text: "Your details are being reviewed." },
  { label: "Approved", text: "Your account is verified." },
  { label: "Rejected", text: "Your details were not accepted." },
];

// Pending, approved or rejected: the three states an identity check can be in, and the ID that follows.
export default function KycTrack() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const [state, setState] = useState(0);
  // Once someone picks a state themselves, the loop leaves them alone.
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (
      !auto ||
      !inView ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = window.setInterval(
      () => setState((value) => (value === 0 ? 1 : 0)),
      2400,
    );
    return () => window.clearInterval(id);
  }, [auto, inView]);

  return (
    <div ref={root} className="kyc">
      <p className="kyc-label">Identity check</p>

      <div
        className="kyc-tabs"
        role="radiogroup"
        aria-label="Identity check status"
        style={{ "--s": state } as CSSProperties}
      >
        <span className="kyc-tabs__blox" data-s={state} aria-hidden="true" />
        {STATES.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="radio"
            aria-checked={index === state}
            onClick={() => {
              setAuto(false);
              setState(index);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="kyc-status" key={state} data-s={state} aria-live="polite">
        <span className="kyc-status__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none">
            {state === 0 && (
              <path
                d="M8 4.5V8l2.25 1.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {state === 1 && (
              <path
                d="M3.5 8.5 6.5 11.5l6-7"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {state === 2 && (
              <path
                d="m4.5 4.5 7 7m0-7-7 7"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            )}
          </svg>
        </span>
        {STATES[state].text}
      </p>

      <div className="kyc-id">
        <span>Your Blox ID</span>
        <div className="kyc-digits" aria-label={`Blox ID ${sample.bloxId}`}>
          {Array.from(sample.bloxId, (digit, index) => (
            <b
              key={index}
              data-on={state === 1 ? "" : undefined}
              style={{ "--i": index } as CSSProperties}
            >
              {digit}
            </b>
          ))}
        </div>
      </div>
    </div>
  );
}
