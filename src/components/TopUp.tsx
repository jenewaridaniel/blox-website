"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import { navCta } from "@/lib/nav";
import { topup } from "@/lib/sample";

const TABS = ["Airtime", "Data"];

// Loose blocks drifting behind the section. x and y place them, s is their size, d how far they follow the
// pointer, t how long a drift takes, r their tilt. Some carry a label from the example card.
const floats = [
  { x: "4%", y: "7%", s: "2.5rem", c: "violet", d: 22, t: 11, r: -14 },
  { x: "31%", y: "9%", s: "1.5rem", c: "ink", d: 12, t: 9, r: 18 },
  { x: "47%", y: "5%", text: "₦500", c: "paper", d: 30, t: 13, r: -6 },
  { x: "69%", y: "12%", s: "3.25rem", c: "line", d: 16, t: 15, r: 12 },
  { x: "84%", y: "6%", text: "1.5 GB", c: "violet", d: 26, t: 12, r: 7 },
  { x: "42%", y: "84%", s: "2rem", c: "violet", d: 20, t: 10, r: 16 },
  { x: "58%", y: "88%", text: "30 days", c: "ink", d: 28, t: 14, r: -8 },
  { x: "3%", y: "91%", s: "3rem", c: "line", d: 14, t: 16, r: -10 },
  { x: "36%", y: "93%", s: "1.25rem", c: "paper", d: 10, t: 8, r: 24 },
];
const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

export default function TopUp() {
  const [tab, setTab] = useState(0);
  const [net, setNet] = useState(0);
  const [amount, setAmount] = useState(2);
  const [bundle, setBundle] = useState(1);
  const [done, setDone] = useState(false);
  const section = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reset = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(reset.current), []);

  // The background layers follow the pointer a little, each by its own amount.
  useEffect(() => {
    const el = section.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        el.style.setProperty(
          "--px",
          String(((event.clientX - box.left) / box.width - 0.5) * 2),
        );
        el.style.setProperty(
          "--py",
          String(((event.clientY - box.top) / box.height - 0.5) * 2),
        );
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Any change to the choice puts the button back to "Top up".
  const change = (apply: () => void) => {
    window.clearTimeout(reset.current);
    setDone(false);
    apply();
  };

  const network = topup.networks[net].name;
  const airtime = topup.airtime[amount];
  const pack = topup.data[bundle];
  const pay = tab === 0 ? naira(airtime) : naira(pack.price);
  const get =
    tab === 0 ? `${naira(airtime)} airtime` : `${pack.size}, ${pack.valid}`;

  // Arrow keys move between the two tabs, as they do in any tab list.
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? TABS.length - 1
          : (tab + 1) % TABS.length;
    change(() => setTab(next));
    tabs.current[next]?.focus();
  };

  // Nothing is sent anywhere. The button only shows the last step.
  const topUp = () => {
    window.clearTimeout(reset.current);
    setDone(true);
    reset.current = window.setTimeout(() => setDone(false), 2600);
  };

  return (
    <section ref={section} className="topup" aria-labelledby="topup-title">
      <div
        className="topup-bg"
        aria-hidden="true"
        data-lit={done ? "" : undefined}
      >
        <span className="topup-dots" />
        <span className="topup-bars">
          {[34, 52, 74, 100].map((height, index) => (
            <i
              key={height}
              style={{ "--h": height, "--i": index } as CSSProperties}
            />
          ))}
        </span>
        {floats.map((item, index) => (
          <span
            key={index}
            className={`topup-float topup-float--${item.c}${item.text ? " topup-float--chip" : ""}`}
            style={
              {
                "--x": item.x,
                "--y": item.y,
                "--s": item.s,
                "--d": item.d,
                "--t": `${item.t}s`,
                "--r": `${item.r}deg`,
                animationDelay: `${index * -1.3}s`,
              } as CSSProperties
            }
          >
            {item.text}
          </span>
        ))}
      </div>

      <div className="topup-inner">
        <div className="topup-stage" style={{ "--net": net } as CSSProperties}>
          <span className="topup-back" aria-hidden="true" />

          <div className="topup-card">
            <div
              className="topup-tabs"
              role="tablist"
              aria-label="Airtime or data"
              style={{ "--tab": tab } as CSSProperties}
            >
              <span className="topup-tabs__blox" aria-hidden="true" />
              {TABS.map((label, index) => (
                <button
                  key={label}
                  ref={(node) => {
                    tabs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`topup-tab-${index}`}
                  aria-selected={index === tab}
                  aria-controls="topup-panel"
                  tabIndex={index === tab ? 0 : -1}
                  onClick={() => change(() => setTab(index))}
                  onKeyDown={onTabKey}
                >
                  {label}
                </button>
              ))}
            </div>

            <div
              id="topup-panel"
              className="topup-panel"
              role="tabpanel"
              aria-labelledby={`topup-tab-${tab}`}
            >
              <fieldset className="topup-group">
                <legend>Network</legend>
                <div className="topup-nets">
                  {topup.networks.map(({ name, logo }, index) => (
                    <label key={name} className="topup-opt topup-opt--net">
                      <input
                        type="radio"
                        name="topup-network"
                        checked={index === net}
                        onChange={() => change(() => setNet(index))}
                      />
                      <span>
                        <span className="topup-logo">
                          <Image src={logo} alt="" width={28} height={28} />
                        </span>
                        {name}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {tab === 0 ? (
                <fieldset className="topup-group">
                  <legend>Amount</legend>
                  <div className="topup-amounts">
                    {topup.airtime.map((value, index) => (
                      <label key={value} className="topup-opt topup-opt--chip">
                        <input
                          type="radio"
                          name="topup-amount"
                          checked={index === amount}
                          onChange={() => change(() => setAmount(index))}
                        />
                        <span>{naira(value)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <fieldset className="topup-group">
                  <legend>Data bundle</legend>
                  <div className="topup-bundles">
                    {topup.data.map((item, index) => (
                      <label
                        key={item.size}
                        className="topup-opt topup-opt--chip"
                      >
                        <input
                          type="radio"
                          name="topup-bundle"
                          checked={index === bundle}
                          onChange={() => change(() => setBundle(index))}
                        />
                        <span>
                          <strong>{item.size}</strong>
                          <small>
                            {item.valid} · {naira(item.price)}
                          </small>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <div
                key={`${tab}-${tab === 0 ? amount : bundle}`}
                className="topup-sum"
              >
                <p className="topup-line">
                  <span>You pay</span>
                  <strong
                    className="topup-figure"
                    style={{ "--i": 0 } as CSSProperties}
                  >
                    {pay}
                  </strong>
                </p>
                <p className="topup-line topup-line--get">
                  <span>You get on {network}</span>
                  <strong
                    className="topup-figure"
                    style={{ "--i": 1 } as CSSProperties}
                  >
                    {get}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="block-btn topup-go"
                data-tone="paper"
                data-done={done ? "" : undefined}
                onClick={topUp}
              >
                {done ? "Topped up" : "Top up"}
              </button>
              <p className="sr-only" aria-live="polite">
                {done ? "Topped up." : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="topup-copy">
          <h2 id="topup-title" className="topup-title">
            Airtime and data, right in your wallet.
          </h2>
          <p className="topup-sub">
            No separate top-up app. Pick a network, pick an amount or a bundle,
            and you are done. It sits next to your Naira and crypto, one tap
            from the home screen.
          </p>
          <Link href={navCta.href} className="block-btn">
            {navCta.label}
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
