"use client";

import { useState, type ReactNode } from "react";
import type { Chapter } from "@/lib/features";

type Props = {
  chapter: Chapter;
  index: number;
  children: ReactNode;
};

/** One chapter: a title, a list of features that open one at a time, and a working picture of it. */
export default function FeatureChapter({ chapter, index, children }: Props) {
  const [open, setOpen] = useState(0);

  return (
    <section
      id={chapter.id}
      className="fx-chapter"
      data-flip={index % 2 === 1 ? "" : undefined}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className="fx-text">
        <span className="fx-num" aria-hidden="true">
          {index + 1}
        </span>
        <h2 id={`${chapter.id}-title`} className="fx-title">
          {chapter.title}
        </h2>
        <p className="fx-lead">{chapter.lead}</p>

        <ul className="fx-rows">
          {chapter.features.map((feature, row) => {
            const isOpen = row === open;
            return (
              <li
                key={feature.title}
                className="fx-row"
                data-open={isOpen ? "" : undefined}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${chapter.id}-${row}`}
                    onClick={() => setOpen(isOpen ? -1 : row)}
                  >
                    <span>{feature.title}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={`${chapter.id}-${row}`}
                  className="fx-panel"
                  role="region"
                >
                  <p>{feature.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="fx-visual" data-tone={chapter.tone}>
        {children}
      </div>
    </section>
  );
}
