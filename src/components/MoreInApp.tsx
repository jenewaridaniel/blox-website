"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { history, sample } from "@/lib/sample";

// True while the element is on screen. The loops below only run then.
function useInView(target: RefObject<HTMLElement | null>) {
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

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Receive ---------- */

// A QR-shaped pattern, the same every time. It is not a real code and cannot be scanned.
const QR_SIZE = 11;
const FINDER = 4;
const inFinder = (x: number, y: number, left: number, top: number) =>
  x >= left && x < left + FINDER && y >= top && y < top + FINDER;
const qrCells = Array.from({ length: QR_SIZE * QR_SIZE }, (_, index) => {
  const x = index % QR_SIZE;
  const y = Math.floor(index / QR_SIZE);
  const corners = [
    [0, 0],
    [QR_SIZE - FINDER, 0],
    [0, QR_SIZE - FINDER],
  ];
  const corner = corners.find(([left, top]) => inFinder(x, y, left, top));
  if (corner) {
    // A solid frame with a solid middle, and a gap between them: the shape every QR code starts with.
    const dx = x - corner[0];
    const dy = y - corner[1];
    const edge = dx === 0 || dx === FINDER - 1 || dy === 0 || dy === FINDER - 1;
    const middle = dx > 0 && dx < FINDER - 1 && dy > 0 && dy < FINDER - 1;
    return edge || (middle && dx === 1 && dy === 1);
  }
  const noise = Math.sin(index * 12.9898) * 43758.5453;
  return noise - Math.floor(noise) > 0.45;
});

export function Receive() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // The button only shows the feedback. It does not touch the visitor's clipboard with a made-up ID.
  const copy = () => {
    window.clearTimeout(timer.current);
    setCopied(true);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article className="more-card more-card--receive">
      <h3>Receive</h3>
      <p className="more-lede">
        Share your Blox ID, or a crypto address with a QR code and a clear
        warning about the network.
      </p>

      <div className="rx-id">
        <span>Your Blox ID</span>
        <strong>{sample.bloxId}</strong>
        <button
          type="button"
          className="rx-copy"
          data-done={copied ? "" : undefined}
          onClick={copy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="rx-address">
        <span className="rx-qr" aria-hidden="true">
          {qrCells.map((on, index) => (
            <i key={index} data-on={on ? "" : undefined} />
          ))}
        </span>
        <div>
          <strong>Crypto address</strong>
          <p>Shown with its QR code, per asset and network.</p>
          <p className="rx-warning">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 2.5 14 13H2L8 2.5Zm0 4v3m0 2h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Send only the asset on the network shown.
          </p>
        </div>
      </div>
    </article>
  );
}

/* ---------- Withdraw ---------- */

const STEPS = [
  "Pick the asset and network",
  "Paste the address",
  "See the network fee",
  "Confirm with your PIN",
];
const STATUSES = ["Pending", "Processing", "Completed", "Failed", "Cancelled"];

export function Withdraw() {
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root);
  const [status, setStatus] = useState(0);
  // Once someone picks a status themselves, the loop leaves them alone.
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || !inView || reduced()) return;
    const id = window.setInterval(
      () => setStatus((value) => (value + 1) % 3),
      1700,
    );
    return () => window.clearInterval(id);
  }, [auto, inView]);

  const progress = Math.min(status, 2);
  return (
    <article ref={root} className="more-card more-card--withdraw">
      <h3>Withdraw and deposit</h3>
      <p className="more-lede">
        Send crypto to an outside address in four steps. Deposits show as
        pending until the network confirms them.
      </p>

      <ol className="wd-steps">
        {STEPS.map((step, index) => (
          <li key={step}>
            <span aria-hidden="true">{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>

      <div
        className="wd-track"
        data-end={status > 2 ? STATUSES[status].toLowerCase() : undefined}
        style={{ "--p": progress } as CSSProperties}
      >
        <span className="wd-track__fill" />
        {STATUSES.slice(0, 3).map((name, index) => (
          <span
            key={name}
            className="wd-track__dot"
            data-on={index <= progress && status < 3 ? "" : undefined}
          />
        ))}
      </div>

      <div
        className="wd-statuses"
        role="radiogroup"
        aria-label="Withdrawal status"
      >
        {STATUSES.map((name, index) => (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={index === status}
            data-kind={index > 2 ? name.toLowerCase() : undefined}
            onClick={() => {
              setAuto(false);
              setStatus(index);
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </article>
  );
}

/* ---------- History and alerts ---------- */

const KINDS = ["All", "Sent", "Received", "Crypto", "Bills"];
const ALERTS = [
  "Withdrawal completed",
  "You received ₦10,000",
  "Deposit confirmed",
];

export function History() {
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("All");
  const [alert, setAlert] = useState(0);

  useEffect(() => {
    if (!inView || reduced()) return;
    const id = window.setInterval(
      () => setAlert((value) => (value + 1) % ALERTS.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, [inView]);

  const text = query.trim().toLowerCase();
  const rows = history.filter(
    (row) =>
      (kind === "All" || row.kind === kind) &&
      (!text || `${row.label} ${row.kind}`.toLowerCase().includes(text)),
  );

  return (
    <article ref={root} className="more-card more-card--history">
      <div className="hs-side">
        <h3>History and alerts</h3>
        <p className="more-lede">
          Every transaction in one list you can search and filter, and a
          notification whenever something happens or a status changes.
        </p>
        <p className="hs-alert" key={alert}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 11V7a4 4 0 1 1 8 0v4l1 1.5H3L4 11Zm2.5 3h3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {ALERTS[alert]}
        </p>
      </div>

      <div className="hs-main">
        <label className="hs-search">
          <span className="sr-only">Search transactions</span>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Zm3.5-1.5L14 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            placeholder="Search transactions"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div
          className="hs-filters"
          role="radiogroup"
          aria-label="Filter transactions"
        >
          {KINDS.map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={name === kind}
              onClick={() => setKind(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <ul className="hs-list" aria-live="polite">
          {rows.map((row) => (
            <li key={row.id}>
              <span className="hs-kind" aria-hidden="true">
                {row.kind[0]}
              </span>
              <div>
                <strong>{row.label}</strong>
                <small>{row.when}</small>
              </div>
              <b>{row.amount}</b>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="hs-empty">
              Nothing matches. Try another word or filter.
            </li>
          )}
        </ul>
      </div>
    </article>
  );
}

export default function MoreInApp() {
  return (
    <section className="more" aria-labelledby="more-title">
      <div className="more-inner">
        <header className="more-head">
          <h2 id="more-title" className="more-title">
            Everything around the money, too.
          </h2>
          <p className="more-sub">
            Receiving, withdrawing and keeping a record are part of the same
            app, with the same checks and the same clear numbers.
          </p>
        </header>

        <div className="more-grid">
          <Withdraw />
          <Receive />
          <History />
        </div>
      </div>
    </section>
  );
}
