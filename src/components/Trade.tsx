"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import BlockField from "@/components/BlockField";
import { buildQuotes } from "@/lib/rates";
import { useRates } from "@/lib/useRates";
import { quotes as sampleQuotes } from "@/lib/sample";

export default function Trade() {
  const [mode, setMode] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  // The page is built with the sample figures; live market prices replace them if they arrive.
  const rates = useRates(panel);
  const card = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reset = useRef<number>(undefined);
  const quotes = rates ? buildQuotes(rates) : sampleQuotes;
  const quote = quotes[mode];

  useEffect(() => () => window.clearTimeout(reset.current), []);

  const choose = (next: number) => {
    window.clearTimeout(reset.current);
    setConfirmed(false);
    setMode(next);
  };

  // Arrow keys move between tabs, as they do in any tab list.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = quotes.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (mode + 1) % quotes.length
        : event.key === "ArrowLeft"
          ? (mode + last) % quotes.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  };

  // Nothing is sent anywhere. The button only shows the last step, and the field celebrates.
  const confirm = () => {
    window.clearTimeout(reset.current);
    setPulse((count) => count + 1);
    setConfirmed(true);
    reset.current = window.setTimeout(() => setConfirmed(false), 2600);
  };

  return (
    <section className="trade" aria-labelledby="trade-title">
      <div ref={panel} className="trade-panel">
        <BlockField mode={mode} pulse={pulse} origin={card} />

        <div className="trade-copy">
          <h2 id="trade-title" className="trade-title">
            See every number before you confirm.
          </h2>
          <p className="trade-sub">
            Buy crypto with your Naira, sell it back, or swap one asset for
            another. Blox shows you the rate, the fee and exactly what you will
            get, then waits for you.
          </p>
          <Link href="/fees" className="block-btn" data-tone="paper">
            How fees work
            <Arrow />
          </Link>
        </div>

        <div ref={card} className="trade-card">
          <div
            className="trade-tabs"
            role="tablist"
            aria-label="Buy, sell or swap"
            style={{ "--tab": mode } as CSSProperties}
          >
            <span className="trade-tabs__blox" aria-hidden="true" />
            {quotes.map((item, index) => (
              <button
                key={item.key}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`trade-tab-${item.key}`}
                aria-selected={index === mode}
                aria-controls="trade-quote"
                tabIndex={index === mode ? 0 : -1}
                onClick={() => choose(index)}
                onKeyDown={onKeyDown}
              >
                {item.tab}
              </button>
            ))}
          </div>

          <div
            id="trade-quote"
            className="trade-quote"
            role="tabpanel"
            aria-labelledby={`trade-tab-${quote.key}`}
          >
            <div key={quote.key} className="trade-values">
              <p className="trade-give">
                <span>{quote.give}</span>
                <strong
                  className="trade-figure"
                  style={{ "--i": 0 } as CSSProperties}
                >
                  {quote.amount}
                </strong>
              </p>
              <dl className="trade-values">
                <div className="trade-line">
                  <dt>Rate</dt>
                  <dd
                    className="trade-figure"
                    style={{ "--i": 1 } as CSSProperties}
                  >
                    {quote.rate}
                  </dd>
                </div>
                <div className="trade-line">
                  <dt>Fee</dt>
                  <dd
                    className="trade-figure"
                    style={{ "--i": 2 } as CSSProperties}
                  >
                    {quote.fee}
                  </dd>
                </div>
              </dl>
              <p className="trade-get">
                <span>You get</span>
                <strong
                  className="trade-figure"
                  style={{ "--i": 3 } as CSSProperties}
                >
                  {quote.get}
                </strong>
              </p>
            </div>

            <button
              type="button"
              className="trade-confirm"
              data-done={confirmed ? "" : undefined}
              onClick={confirm}
            >
              {confirmed ? "Confirmed" : "Confirm"}
            </button>
            <p className="sr-only" aria-live="polite">
              {confirmed ? "Confirmed." : ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
