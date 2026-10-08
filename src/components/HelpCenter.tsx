"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import PageHero from "@/components/PageHero";
import { faqs, topics, type Topic } from "@/lib/faqs";
import { navCta } from "@/lib/nav";

type Filter = "All" | Topic;

// Wraps the part of a line that matches the search in a highlight.
function Mark({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

const matches = (query: string, topic: Filter) => {
  const text = query.trim().toLowerCase();
  return faqs.filter(
    (faq) =>
      (topic === "All" || faq.topic === topic) &&
      (!text || `${faq.q} ${faq.a} ${faq.topic}`.toLowerCase().includes(text)),
  );
};

export default function HelpCenter() {
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Filter>("All");
  const [open, setOpen] = useState<string | null>(null);

  // Press / anywhere on the page to jump to the search box.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.matches("input, textarea, select") || target?.isContentEditable;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = matches(query, topic);
  const text = query.trim();

  const search = (value: string) => {
    setQuery(value);
    // When what you typed narrows things down to a few answers, open the best one.
    const found = matches(value, topic);
    setOpen(value.trim() && found.length <= 3 ? (found[0]?.id ?? null) : null);
  };

  const pick = (next: Filter) => {
    setTopic(next);
    setOpen(null);
  };

  return (
    <>
      <PageHero
        tone="violet"
        title="How can we help?"
        lead="Search the answers, or pick a topic. Everything here is about how Blox works."
        chips={[
          "Blox ID",
          "PIN",
          "KYC",
          "2FA",
          "Deposit",
          "Swap",
          "Airtime",
          "?",
        ]}
      >
        <label className="hp-search">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M8.75 15.5a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5Zm4.75-1.75L18 18.25"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <span className="sr-only">Search the help answers</span>
          <input
            ref={input}
            type="search"
            placeholder="Search: Blox ID, PIN, withdrawals…"
            value={query}
            onChange={(event) => search(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") search("");
            }}
          />
          <kbd aria-hidden="true">/</kbd>
        </label>

        <div className="hp-topics" role="radiogroup" aria-label="Topic">
          {(["All", ...topics] as Filter[]).map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={name === topic}
              onClick={() => pick(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="hp" aria-label="Answers">
        <p className="hp-count" aria-live="polite">
          {results.length === 1 ? "1 answer" : `${results.length} answers`}
          {text && <> for “{text}”</>}
        </p>

        <ul className="hp-list">
          {results.map((faq) => {
            const isOpen = open === faq.id;
            return (
              <li
                key={faq.id}
                className="hp-item"
                data-open={isOpen ? "" : undefined}
              >
                <h2>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`hp-${faq.id}`}
                    onClick={() => setOpen(isOpen ? null : faq.id)}
                  >
                    <span className="hp-tag">{faq.topic}</span>
                    <span className="hp-q">
                      <Mark text={faq.q} query={text} />
                    </span>
                    <i aria-hidden="true" />
                  </button>
                </h2>
                <div id={`hp-${faq.id}`} className="hp-answer" role="region">
                  <p>
                    <Mark text={faq.a} query={text} />
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {results.length === 0 && (
          <div className="hp-empty">
            <p>
              Nothing matches{text ? ` “${text}”` : ""}. Try another word, or
              pick a topic.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTopic("All");
                setOpen(null);
              }}
            >
              Show every answer
            </button>
          </div>
        )}
      </section>

      <section className="hp-more" aria-labelledby="hp-more-title">
        <div className="hp-more__panel">
          <h2 id="hp-more-title">Want the full picture?</h2>
          <p>
            See everything Blox does, chapter by chapter, or get the app and try
            it yourself.
          </p>
          <div className="hp-more__actions">
            <Link href="/features" className="block-btn" data-tone="paper">
              See the features
              <Arrow />
            </Link>
            <Link href={navCta.href} className="block-btn" data-tone="deep">
              {navCta.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
