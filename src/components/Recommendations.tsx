/**
 * Recommendations strip: the Utah Solutions Forum's 10 proposals as a horizontally scrolling row,
 * shown right after the Vision as an example of what people decide when they work through the choices.
 */
import { UTAH_FORUM } from "../content/terms";
import { Eyebrow, Heading } from "./ui";

/* From the Utah Solutions Forum preliminary report (Sept. 25, 2026), with delegate approval */
const RECOMMENDATIONS: [string, number][] = [
  ["A dedicated statewide AI information hub", 95],
  ["A centralized citizen engagement portal", 84],
  ["AI literacy programs through community libraries", 95],
  ["A public awareness campaign pointing people to these resources", 82],
  ["Hyperscale data centers voted on by city councils and county commissions", 89],
  ["State permits and independent environmental and economic impact analyses", 92],
  ["Consistent statewide standards for data centers and public AI tools", 92],
  ["Recusal for public officials with a conflict of interest", 92],
  ["Limits on nondisclosure agreements that shield public interest or safety", 95],
  ["An AI consumer complaint and transparency initiative", 97],
];

const GUTTER = "max(var(--gutter), calc((100vw - 80rem) / 2 + var(--gutter)))";

export default function Recommendations() {
  return (
    <section id="recommendations" className="relative overflow-x-clip bg-cream pb-4 pt-24 md:pt-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <Eyebrow>From the {UTAH_FORUM}</Eyebrow>
        <Heading className="mt-5 max-w-3xl text-4xl sm:text-5xl">
          What people decide when they work through the choices together.
        </Heading>
      </div>

      {/* Bleeds to both edges; the first card lines up with the page gutter (max-w-7xl plus its padding) */}
      <ul
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [--gutter:1.25rem] [scrollbar-width:thin] lg:[--gutter:2.5rem]"
        style={{ paddingInline: GUTTER, scrollPaddingInline: GUTTER }}
        aria-label={`The ${RECOMMENDATIONS.length} recommendations from the ${UTAH_FORUM}`}
      >
        {RECOMMENDATIONS.map(([text, pct]) => (
          <li
            key={text}
            className="flex w-72 shrink-0 snap-start flex-col justify-between rounded-2xl bg-white p-6 shadow-soft sm:w-80"
          >
            <p className="font-display text-xl leading-snug text-maroon-900">{text}</p>
            <p className="mt-8 border-t border-blush-200 pt-4 font-display font-medium tracking-tight text-bloom-500">
              <span className="text-4xl">{pct}%</span>
              <span className="ml-2 text-lg">approval</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
