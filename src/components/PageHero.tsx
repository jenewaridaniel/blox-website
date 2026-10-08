import type { CSSProperties, ReactNode } from "react";

// Where each drifting chip sits: x and y in the panel, a tilt, how long a drift takes, and which colour.
const spots = [
  { x: "56%", y: "13%", r: -8, t: 11, c: "a" },
  { x: "77%", y: "9%", r: 6, t: 13, c: "b" },
  { x: "87%", y: "31%", r: -4, t: 10, c: "c" },
  { x: "64%", y: "42%", r: 9, t: 14, c: "a" },
  { x: "80%", y: "56%", r: -7, t: 12, c: "b" },
  { x: "55%", y: "72%", r: 5, t: 15, c: "c" },
  { x: "88%", y: "76%", r: -9, t: 11, c: "a" },
  { x: "70%", y: "87%", r: 4, t: 13, c: "b" },
];

type Props = {
  tone: "ink" | "violet";
  title: ReactNode;
  lead: string;
  /** Short words that drift behind the page title. */
  chips?: string[];
  children?: ReactNode;
};

/** The top of an inner page: a big block, a big title, and a few labelled blocks drifting behind it. */
export default function PageHero({
  tone,
  title,
  lead,
  chips = [],
  children,
}: Props) {
  return (
    <section className="phero" data-tone={tone}>
      <div
        className="phero-panel"
        data-nav-tone={tone === "violet" ? "violet" : undefined}
      >
        <div className="phero-bg" aria-hidden="true">
          <span className="phero-dots" />
          {chips.slice(0, spots.length).map((chip, index) => {
            const spot = spots[index];
            return (
              <span
                key={chip}
                className="phero-chip"
                data-c={spot.c}
                style={
                  {
                    "--x": spot.x,
                    "--y": spot.y,
                    "--r": `${spot.r}deg`,
                    "--t": `${spot.t}s`,
                    animationDelay: `${index * -1.7}s`,
                  } as CSSProperties
                }
              >
                {chip}
              </span>
            );
          })}
        </div>

        <div className="phero-copy">
          <h1 className="phero-title">{title}</h1>
          <p className="phero-lead">{lead}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
