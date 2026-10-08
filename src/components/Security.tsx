"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { sample } from "@/lib/sample";

// Only what the product does. Anything that needs a licence or a certificate to claim stays out
// until the client confirms it (see docs/client-questions.md).
const rows = [
  {
    title: "Verified accounts",
    text: "Sign up, then verify your identity. Your status is always in view: pending, approved or rejected.",
  },
  {
    title: "PIN, biometrics and 2FA",
    text: "A transaction PIN you choose, biometrics to unlock, and one-time codes (OTP / 2FA) on top.",
  },
  {
    title: "Check before you send",
    text: "The recipient's verified name shows before you confirm, so a mistyped Blox ID is easy to catch.",
  },
  {
    title: "All or nothing",
    text: "A transfer either goes through in full or not at all, and every one gets a reference.",
  },
];

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

// Six ridges for the fingerprint. dash and offset are out of 100 around each ring, so the gaps differ
// ring to ring and the circles stop reading as a target.
const RIDGES = [
  { r: 8, dash: "72 28", off: 10 },
  { r: 16, dash: "66 34", off: -6 },
  { r: 24, dash: "74 26", off: 22 },
  { r: 32, dash: "68 32", off: -14 },
  { r: 40, dash: "76 24", off: 30 },
  { r: 48, dash: "64 36", off: -2 },
];
const MODES = ["PIN", "Biometrics"];
const LENGTH = 4;

function Lock() {
  return (
    <svg
      className="sec-lock"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="sec-lock__shackle"
        d="M6.5 8.5V6.25a3.5 3.5 0 0 1 7 0V8.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect
        x="3.75"
        y="8.5"
        width="12.5"
        height="8.5"
        rx="2.5"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Security() {
  const section = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const modeTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pin, setPin] = useState("");
  const [approved, setApproved] = useState(false);
  const [mode, setMode] = useState(0);
  const [scan, setScan] = useState<"idle" | "scanning" | "done">("idle");
  // Every key press nudges the dial behind the pad a notch.
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  // The four rows start open and lock one after another the first time the section comes into view.
  useEffect(() => {
    const el = section.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    el.dataset.lock = "armed";
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.lock = "done";
        watch.disconnect();
      },
      { threshold: 0.35 },
    );
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  const later = (run: () => void, ms: number) => {
    timers.current.push(window.setTimeout(run, ms));
  };

  const choose = (next: number) => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setPin("");
    setApproved(false);
    setScan("idle");
    setMode(next);
  };

  const onModeKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    choose((mode + 1) % MODES.length);
    modeTabs.current[(mode + 1) % MODES.length]?.focus();
  };

  // Nothing is read. The sensor only shows what unlocking looks like.
  const startScan = () => {
    if (scan !== "idle") return;
    setScan("scanning");
    later(() => {
      setScan("done");
      setTurn((value) => value + 6);
      later(() => setScan("idle"), 2800);
    }, 1500);
  };

  // Nothing is checked or kept. The pad only shows what approving looks like.
  const press = (digit: string) => {
    if (approved || pin.length >= LENGTH) return;
    const next = pin + digit;
    setPin(next);
    setTurn((value) => value + 1);
    if (next.length < LENGTH) return;
    later(() => {
      setApproved(true);
      setTurn((value) => value + 4);
      later(() => {
        setPin("");
        setApproved(false);
      }, 2800);
    }, 260);
  };

  const remove = () => {
    if (approved || !pin) return;
    setPin(pin.slice(0, -1));
    setTurn((value) => value - 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (/^\d$/.test(event.key)) press(event.key);
    else if (event.key === "Backspace") remove();
  };

  const status =
    mode === 1
      ? scan === "done"
        ? "Unlocked."
        : scan === "scanning"
          ? "Scanning."
          : "Touch the sensor to scan."
      : approved
        ? `Approved. ${sample.amount} sent to ${sample.firstName}.`
        : `${pin.length} of ${LENGTH} digits entered.`;

  return (
    <section
      ref={section}
      className="security"
      aria-labelledby="security-title"
    >
      <div className="security-panel" data-nav-tone="violet">
        <div className="security-copy">
          <h2 id="security-title" className="security-title">
            Your money moves only when you say so.
          </h2>
          <p className="security-sub">
            Blox checks who you are, who you are paying and that you mean it,
            before anything moves.
          </p>

          <ul className="security-list">
            {rows.map((row, index) => (
              <li
                key={row.title}
                className="sec-row"
                style={{ "--i": index } as CSSProperties}
              >
                <span className="sec-tile">
                  <Lock />
                </span>
                <div className="sec-text">
                  <h3>{row.title}</h3>
                  <p>{row.text}</p>
                </div>
                <span className="sec-status" aria-hidden="true">
                  <span className="sec-status__open">Open</span>
                  <span className="sec-status__locked">Locked</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="security-stage"
          style={{ "--turn": turn } as CSSProperties}
        >
          <div className="sec-dial" aria-hidden="true">
            <span className="sec-dial__spin">
              <span className="sec-dial__ticks" />
              <span className="sec-dial__ring" />
              <span className="sec-dial__ring sec-dial__ring--inner" />
            </span>
          </div>

          {/* The keypad is a demo: tapping keys never checks or stores anything. */}
          <div
            className="sec-pad"
            role="group"
            aria-label="PIN pad"
            onKeyDown={onKeyDown}
          >
            <div
              className="sec-modes"
              role="tablist"
              aria-label="Unlock method"
              style={{ "--m": mode } as CSSProperties}
            >
              <span className="sec-modes__blox" aria-hidden="true" />
              {MODES.map((label, index) => (
                <button
                  key={label}
                  ref={(node) => {
                    modeTabs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={index === mode}
                  tabIndex={index === mode ? 0 : -1}
                  onClick={() => choose(index)}
                  onKeyDown={onModeKey}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="sec-pad__head">
              <span className="sec-tile sec-tile--pad">
                <Lock />
              </span>
              <div>
                <h3>
                  {mode === 1
                    ? scan === "done"
                      ? "Unlocked"
                      : "Unlock with biometrics"
                    : approved
                      ? "Approved"
                      : "Confirm with your PIN"}
                </h3>
                <p>
                  {mode === 1
                    ? scan === "done"
                      ? "Your wallet is open"
                      : scan === "scanning"
                        ? "Scanning"
                        : "Touch the sensor"
                    : approved
                      ? `${sample.amount} sent to ${sample.firstName}`
                      : `Sending ${sample.amount} to ${sample.firstName}`}
                </p>
              </div>
            </div>

            {mode === 0 && (
              <div className="sec-dots" aria-hidden="true">
                {Array.from({ length: LENGTH }, (_, index) => (
                  <i
                    key={index}
                    data-on={index < pin.length ? "" : undefined}
                    data-approved={approved ? "" : undefined}
                  />
                ))}
              </div>
            )}
            <p className="sr-only" aria-live="polite">
              {status}
            </p>

            {mode === 0 ? (
              <div className="sec-keys">
                {KEYS.map((key) =>
                  key === "" ? (
                    <span key="gap" />
                  ) : key === "delete" ? (
                    <button
                      key={key}
                      type="button"
                      className="sec-key sec-key--delete"
                      aria-label="Delete last digit"
                      onClick={remove}
                    >
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M9.5 6h9.25A1.75 1.75 0 0 1 20.5 7.75v8.5A1.75 1.75 0 0 1 18.75 18H9.5L3.5 12l6-6Zm3 3.25 5 5.5m0-5.5-5 5.5"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      key={key}
                      type="button"
                      className="sec-key"
                      onClick={() => press(key)}
                    >
                      {key}
                    </button>
                  ),
                )}
              </div>
            ) : (
              <div className="sec-bio" data-scan={scan}>
                <button
                  type="button"
                  className="sec-sensor"
                  aria-label="Touch the sensor to scan (demo)"
                  disabled={scan !== "idle"}
                  onClick={startScan}
                >
                  <svg
                    className="sec-print"
                    viewBox="0 0 120 120"
                    fill="none"
                    aria-hidden="true"
                  >
                    {RIDGES.map((ridge, index) => (
                      <circle
                        key={ridge.r}
                        className="sec-ridge"
                        style={{ "--r": index } as CSSProperties}
                        cx="60"
                        cy="60"
                        r={ridge.r}
                        pathLength="100"
                        strokeDasharray={ridge.dash}
                        strokeDashoffset={ridge.off}
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    ))}
                  </svg>
                  <span className="sec-sensor__beam" />
                  <span className="sec-sensor__pulse" />
                </button>
                <p className="sec-bio__hint" aria-hidden="true">
                  {scan === "done"
                    ? "Unlocked"
                    : scan === "scanning"
                      ? "Scanning…"
                      : "Touch to scan"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
