"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { actions } from "@/lib/actions";
import { history, wallet } from "@/lib/sample";

const ALERTS = [
  "You received ₦10,000",
  "Deposit confirmed",
  "Withdrawal completed",
];

export default function WalletPhone() {
  const root = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [alert, setAlert] = useState(-1);

  // Every few seconds a notification drops into the phone, then leaves. Only while it is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let visible = false;
    let count = 0;
    let hide = 0;
    const show = () => {
      if (!visible) return;
      setAlert(count++ % ALERTS.length);
      window.clearTimeout(hide);
      hide = window.setTimeout(() => setAlert(-1), 2600);
    };
    const every = window.setInterval(show, 4800);
    const watch = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) window.setTimeout(show, 900);
    });
    watch.observe(el);
    return () => {
      window.clearInterval(every);
      window.clearTimeout(hide);
      watch.disconnect();
    };
  }, []);

  const balance = wallet.naira.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      ref={root}
      className="phone"
      role="img"
      aria-label="The Blox wallet screen: Naira balance, crypto assets, quick actions and recent transactions."
    >
      <div className="phone-screen">
        <span className="phone-notch" aria-hidden="true" />

        <p
          className="ph-toast"
          data-show={alert >= 0 ? "" : undefined}
          aria-hidden="true"
        >
          <span aria-hidden="true" />
          {ALERTS[Math.max(alert, 0)]}
        </p>

        <div className="ph-balance">
          <span>Naira balance</span>
          <div>
            <strong>{hidden ? "₦ ••••••" : `₦${balance}`}</strong>
            <button
              type="button"
              aria-label={hidden ? "Show balance" : "Hide balance"}
              aria-pressed={hidden}
              onClick={() => setHidden((value) => !value)}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="2.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {hidden && (
                  <path
                    d="M3.5 3.5l13 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <ul className="ph-actions">
          {actions.map((action, index) => (
            <li key={action.label} style={{ "--i": index } as CSSProperties}>
              <span>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d={action.icon}
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {action.label}
            </li>
          ))}
        </ul>

        <ul className="ph-assets">
          {wallet.assets.map((asset) => (
            <li key={asset.sym}>
              <span>{asset.sym[0]}</span>
              <div>
                <strong>{asset.sym}</strong>
                <small>{asset.name}</small>
              </div>
              <b>{hidden ? "••••" : asset.amount}</b>
            </li>
          ))}
        </ul>

        <p className="ph-heading">Recent</p>
        <ul className="ph-recent">
          {history.slice(0, 3).map((row) => (
            <li key={row.id}>
              <div>
                <strong>{row.label}</strong>
                <small>{row.when}</small>
              </div>
              <b>{row.amount}</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
