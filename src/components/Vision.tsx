/**
 * The Vision (why): a rotating carousel of participant quotes on the left,
 * narrative on the right (layout from Humphrey's sketch).
 */
import { useEffect, useState } from "react";
import { Quote } from "./ui";
import { ATTRIBUTION, UTAH_FORUM } from "../content/terms";
import { assetHref } from "../utils/href";

const QUOTES = [
  { text: "I want to use AI. I don’t want AI to use me.", by: ATTRIBUTION.cacheForum },
  { text: "I’ve left with a better understanding of the common ground we share.", by: ATTRIBUTION.utahForum },
  {
    text: "I have a better outlook on my fellow citizens. Seems like they are not as crazy and radical as online makes them seem.",
    by: ATTRIBUTION.utahForum,
  },
  {
    text: "I’ve never enjoyed politics, but this kind of moderated discussion and deliberation was very productive and gave me hope that citizens could engage in politics in an effective way.",
    by: ATTRIBUTION.utahForum,
  },
  {
    text: "I want to see an elected official on TV parroting back the ideas we talked about and then actions following through.",
    by: ATTRIBUTION.cacheForum,
  },
];

const ROTATE_MS = 8000;

/** One quote at a time. Rotates on its own unless the reader is hovering, focused, or prefers reduced motion. */
function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % QUOTES.length), ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [index, paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Every quote is stacked in the same cell, so the height stays put at the longest one */}
      <div className="mt-6 grid" aria-live={paused ? "polite" : "off"}>
        {QUOTES.map((item, i) => (
          <div
            key={item.text}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 transition-opacity duration-500 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Quote by={item.by} size={item.text.length > 90 ? "md" : "lg"}>
              {item.text}
            </Quote>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2" role="group" aria-label="Choose a quote">
        {QUOTES.map((item, i) => (
          <button
            key={item.text}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Quote ${i + 1} of ${QUOTES.length}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-bloom-500" : "w-2 bg-bloom-200 hover:bg-bloom-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Vision() {
  return (
    <section id="vision" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-12 lg:px-10">
        {/* Left: the voices that frame everything */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <figure>
              <img
                src={assetHref("photos/small-group.jpg")}
                alt="Two delegates in conversation at the Utah Solutions Forum"
                loading="lazy"
                className="aspect-[3/2] w-full rounded-3xl bg-blush-100 object-cover object-[50%_30%]"
              />
              <figcaption className="mt-3 text-xs text-maroon-900/60">Delegates at the {UTAH_FORUM}, September 2026.</figcaption>
            </figure>
            <QuoteCarousel />
          </div>
        </div>

        {/* Right: the argument */}
        <div className="space-y-5 text-base leading-relaxed text-maroon-900 md:col-span-7 md:pt-2">
          <p className="font-display text-2xl leading-snug text-bloom-500 sm:text-3xl">
            Artificial intelligence is forcing choices on us faster than we can make them together.
          </p>
          <p>
            The decisions that will reshape our classrooms, workplaces, and land are being made behind closed doors.
            Corporations and politicians alike often believe that a future defined by the AI industry is inevitable,
            and fail to proactively and meaningfully engage the people who are affected the most.
          </p>
          <p className="!mt-10 font-display text-2xl leading-snug text-bloom-500 sm:text-3xl">
            BLOOM&rsquo;s work starts from a different premise: give people a chance to learn, listen, and work through
            the choices, and we can decide together what happens next.
          </p>
          <p>
            Our partners, local organizations committed to the wellbeing of their communities, bring communities
            together to learn the real considerations behind these decisions, discuss the trade-offs, and develop
            actionable policies aligned with the public interest. And because people don&rsquo;t just want to be
            heard, we help carry what they decide to the decision makers who can act on it.
          </p>
        </div>
      </div>
    </section>
  );
}
