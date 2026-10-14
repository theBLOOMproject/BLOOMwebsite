/**
 * What we do (how): sticky left column with an index that follows the reader,
 * stacked feature blocks on the right (layout from Humphrey's sketch).
 * Copy lives in src/content/whatBloomIs.json and is editable in dev mode.
 */
import { useEffect, useRef, useState } from "react";
import Editable from "./Editable";
import { Eyebrow } from "./ui";
import content from "../content/whatBloomIs.json";
import { assetHref } from "../utils/href";

const FILE = "whatBloomIs.json";

export default function WhatBloomIs() {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blockRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="what-we-do" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 lg:px-10">
        {/* Sticky left column */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight text-bloom-500 sm:text-5xl">
              <Editable file={FILE} path="heading">{content.heading}</Editable>
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-maroon-900/80">
              <Editable file={FILE} path="intro">{content.intro}</Editable>
            </p>

            <ol className="mt-10 hidden space-y-3 md:block">
              {content.items.map((item, i) => (
                <li key={item.label}>
                  <a
                    href={`#wwd-${i}`}
                    className={`flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                      active === i ? "text-bloom-500" : "text-bloom-300 hover:text-bloom-500"
                    }`}
                  >
                    {item.label}
                    <span className={`h-px bg-bloom-500 transition-all duration-500 ${active === i ? "w-12" : "w-0"}`} />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Feature blocks */}
        <div className="space-y-20 md:col-span-7 md:space-y-28">
          {content.items.map((item, i) => (
            <div
              key={item.label}
              id={`wwd-${i}`}
              data-index={i}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
            >
              <h3 className="font-display text-3xl text-bloom-500">
                <Editable file={FILE} path={`items.${i}.title`}>{item.title}</Editable>
              </h3>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-maroon-900/85">
                <Editable file={FILE} path={`items.${i}.desc`}>{item.desc}</Editable>
              </p>
              <img
                src={assetHref(item.image)}
                alt={item.alt}
                loading="lazy"
                className="mt-7 aspect-[16/10] w-full rounded-2xl bg-blush-100 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
