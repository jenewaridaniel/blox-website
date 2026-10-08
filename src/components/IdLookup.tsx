"use client";

import { useEffect, useRef, useState } from "react";
import { sample } from "@/lib/sample";

const NAMES = [
  "Chika Eze",
  "Tunde Bello",
  "Ngozi Adeyemi",
  "Ibrahim Musa",
  "Funke Alabi",
  "Emeka Obi",
  "Zainab Yusuf",
  "Segun Ajayi",
];

// Any eight digits give the same name every time, and the sample ID gives the sample name.
const nameFor = (id: string) =>
  id === sample.bloxId
    ? sample.name
    : NAMES[
        [...id].reduce((sum, digit) => sum + Number(digit), 0) % NAMES.length
      ];

const LENGTH = 8;

/** Type eight digits and a verified name appears before you confirm, which is the point of a Blox ID. */
export default function IdLookup() {
  const [id, setId] = useState("");
  const [phase, setPhase] = useState<"idle" | "looking" | "found" | "sent">(
    "idle",
  );
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const clear = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const enter = (value: string) => {
    clear();
    const digits = value.replace(/\D/g, "").slice(0, LENGTH);
    setId(digits);
    if (digits.length < LENGTH) {
      setPhase("idle");
      return;
    }
    setPhase("looking");
    timers.current.push(window.setTimeout(() => setPhase("found"), 450));
  };

  // Nothing is sent. The button only shows the last step.
  const confirm = () => {
    clear();
    setPhase("sent");
    timers.current.push(
      window.setTimeout(() => {
        setId("");
        setPhase("idle");
      }, 3600),
    );
  };

  const name = id.length === LENGTH ? nameFor(id) : "";
  const first = name.split(" ")[0];

  return (
    <div className="lk">
      <label className="lk-field">
        <span>Send to a Blox ID</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={LENGTH}
          placeholder="8 digits"
          value={id}
          onChange={(event) => enter(event.target.value)}
        />
      </label>

      <div className="lk-meter" aria-hidden="true">
        {Array.from({ length: LENGTH }, (_, index) => (
          <i key={index} data-on={index < id.length ? "" : undefined} />
        ))}
      </div>

      <div className="lk-result" aria-live="polite">
        {phase === "idle" && (
          <p className="lk-hint">
            Type any eight digits, or{" "}
            <button type="button" onClick={() => enter(sample.bloxId)}>
              try {sample.bloxId}
            </button>
            .
          </p>
        )}

        {phase === "looking" && <p className="lk-hint">Looking up the name…</p>}

        {(phase === "found" || phase === "sent") && (
          <div className="lk-found">
            <p className="lk-who">
              <span className="lk-tick" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6.5 4.75 9 10 3.25"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <strong>{name}</strong>
              <small>Verified name</small>
            </p>

            {phase === "found" ? (
              <button type="button" className="lk-confirm" onClick={confirm}>
                Send {sample.amount} to {first}
              </button>
            ) : (
              <div className="lk-sent">
                <strong>
                  {sample.amount} sent to {first}
                </strong>
                <span>Instant</span>
                <span>Reference generated</span>
                <span>Both notified</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
