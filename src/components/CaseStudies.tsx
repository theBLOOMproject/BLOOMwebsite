/**
 * The Work: case studies beside an interactive map of the western states.
 * Click or tap Oregon / Utah (or their label chips) on the map to swap the detail card. No hover switching:
 * scrolling the map under a resting cursor would otherwise change the card unasked.
 */
import { useState } from "react";
import { HOSTS, INSTITUTION, UTAH_FORUM } from "../content/terms";
import { Eyebrow, Heading, Pill } from "./ui";
import { US_STATES, MAP_WIDTH, MAP_HEIGHT, MAP_FULL_WIDTH } from "../content/usStates";

/* The rest of the country continues east and fades out: the network is national. */
const FADE_START = Math.round(((MAP_WIDTH * 0.8) / MAP_FULL_WIDTH) * 100); // around the Colorado Rockies
const FADE = `linear-gradient(to right, #000 ${FADE_START}%, rgba(0,0,0,0.35) ${FADE_START + 6}%, transparent ${FADE_START + 13}%)`;
import { pageHref, assetHref } from "../utils/href";

const UTAH_REPORT_URL = "https://drive.google.com/file/d/1QngRN6wkkAcPDdhdFInZQn_qu0mmBWnl/view?usp=drive_link";
const OREGON_REPORT_URL = "https://report.bloomproject.us/central-oregon-ai/";
const COCAP_URL = "https://cocap.us/";

type SiteId = "UT" | "OR";

const SITES: Record<SiteId, { place: string; chip: string; title: string }> = {
  UT: {
    place: "Utah",
    chip: "10 proposals, 80%+ support",
    title: "From 600+ Utahns in conversation to 10 policy recommendations.",
  },
  OR: {
    place: "Central Oregon",
    chip: "Assembly December 5\u20136",
    title: "Three counties working through what AI means for Central Oregon.",
  },
};

export default function CaseStudies() {
  const [active, setActive] = useState<SiteId>("UT");
  const site = SITES[active];

  return (
    <section id="work" className="relative overflow-x-clip bg-cream pb-24 pt-14 md:pb-32 md:pt-16">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-12 lg:px-10">
        {/* Left: heading + swapping card */}
        <div className="lg:col-span-6">
          <Eyebrow>Where we work</Eyebrow>
          <Heading className="mt-5 text-4xl sm:text-5xl">Explore what our community partners are building.</Heading>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-maroon-900/80">
            Local partners run the process. BLOOM brings the funding, methods and tools. Here&rsquo;s where it&rsquo;s
            happening so far.
          </p>

          <article key={active} aria-live="polite" className="mt-8 animate-[fadeIn_.35s_ease] overflow-hidden rounded-2xl bg-white shadow-soft">
            {active === "UT" && (
              <img
                src={assetHref("photos/utah-forum-group.jpg")}
                alt={`Delegates and organizers of the 2026 ${UTAH_FORUM} outside the venue in Draper`}
                loading="lazy"
                className="aspect-[16/7] w-full bg-blush-100 object-cover"
              />
            )}
            <div className="p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bloom-500">{site.place}</p>
            <h3 className="mt-2 font-display text-2xl text-maroon-900">{site.title}</h3>
            <div className="mt-7 flex flex-wrap gap-3">
              {active === "UT" ? (
                <>
                  <Pill href={pageHref("news", "utah-solutions-forum")}>Read the press release</Pill>
                  <Pill href={UTAH_REPORT_URL} external variant="soft">Read the report</Pill>
                </>
              ) : (
                <>
                  <Pill href={OREGON_REPORT_URL} external>Read the report</Pill>
                  <Pill href={COCAP_URL} external variant="soft">Visit the COCAP website</Pill>
                </>
              )}
            </div>
            </div>
          </article>

          <div className="mt-8 rounded-2xl border border-blush-200 p-7">
            <p className="font-display text-2xl leading-snug text-maroon-900">
              No community goes it alone. {HOSTS} share what works, and their assemblies connect into the {INSTITUTION}.
            </p>
            <a
              href={pageHref("cohort")}
              className="mt-4 inline-flex items-center gap-2 text-sm text-bloom-600 underline decoration-bloom-300 underline-offset-4 hover:text-bloom-700"
            >
              See how the network grows from communities to the country &rarr;
            </a>
          </div>
        </div>

        {/* Right: the map. Starts level with the tabs, then stays in view while the card scrolls past. */}
        <div className="lg:sticky lg:top-28 lg:col-span-6 lg:mt-56">
          <div
            className="relative"
            style={{
              width: `min(100%, calc((100svh - 9rem) * ${MAP_WIDTH / MAP_HEIGHT}))`,
              aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`,
            }}
          >
          <svg
            viewBox={`0 0 ${MAP_FULL_WIDTH} ${MAP_HEIGHT}`}
            className="absolute left-0 top-0 h-full max-w-none"
            style={{
              width: `${(MAP_FULL_WIDTH / MAP_WIDTH) * 100}%`,
              maskImage: FADE,
              WebkitMaskImage: FADE,
            }}
            role="img"
            aria-label="Map of the United States highlighting Oregon and Utah"
          >
            {US_STATES.map((s) => {
              const siteId = s.id === "UT" || s.id === "OR" ? (s.id as SiteId) : null;
              const isActive = siteId === active;
              return (
                <path
                  key={s.id}
                  d={s.d}
                  onClick={siteId ? () => setActive(siteId) : undefined}
                  className={`stroke-cream transition-colors duration-300 ${
                    siteId
                      ? `cursor-pointer ${isActive ? "fill-bloom-500" : "fill-bloom-400/80 hover:fill-bloom-500"}`
                      : "fill-blush-100"
                  }`}
                  strokeWidth={2}
                >
                  <title>{s.name}</title>
                </path>
              );
            })}
          </svg>

          {US_STATES.filter((s) => s.id === "UT" || s.id === "OR").map((s) => {
            const id = s.id as SiteId;
            const isActive = id === active;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                aria-pressed={isActive}
                className={`absolute -translate-y-1/2 rounded-lg px-3 py-2 text-left shadow-soft transition-colors ${
                  isActive ? "bg-maroon-900 text-white" : "bg-white text-maroon-900 hover:bg-blush-100"
                }`}
                style={{
                  left: `${((s.cx + (id === "OR" ? 10 : 24)) / MAP_WIDTH) * 100}%`,
                  top: `${((s.cy - (id === "OR" ? 20 : 0)) / MAP_HEIGHT) * 100}%`,
                }}
              >
                <span className="block font-display text-2xl font-medium leading-tight">{SITES[id].place}</span>
                <span className={`block text-[10px] uppercase tracking-wider ${isActive ? "text-bloom-200" : "text-bloom-500"}`}>
                  {SITES[id].chip}
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
