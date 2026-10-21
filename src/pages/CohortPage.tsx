/**
 * /cohort/ — the 2027 Cohort: BLOOM's theory of change (a national network,
 * questions travelling from communities to the country) and the full call for
 * Civic Hosts.
 *
 * All wording lives in content/cohort.json. In local dev (npm run dev), click any
 * text on the page to edit it; it saves back to that file when you click away.
 * Dates, links and the open/close logic live in content/rfp.ts.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import copy from "../content/cohort.json";
import { ANNOUNCEMENT_URL, APPLY_EMBED_URL, APPLY_URL, CONTACT_EMAIL, HUB_INQUIRY_MAILTO, INFO_SESSION_URL, RFP_PDF, infoSessionUpcoming, infoSessionWhen, previewEnabled, rfpStatus } from "../content/rfp";
import Editable from "../components/Editable";
import { Eyebrow, Glow, Pill } from "../components/ui";
import { CohortCTA, cohortStatusLine } from "../components/CohortForm";
import { assetHref, sectionHref } from "../utils/href";

const SECTIONS = ["who", "host-roles", "support", "tools", "impact", "timeline", "apply", "questions"] as const;

const FILE = "cohort.json";

/** Split text so the first occurrence of each listed word becomes a link. */
function linkWords(text: string, links: Record<string, string>) {
  const words = Object.keys(links).filter((w) => text.includes(w));
  if (!words.length) return text;
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  const used = new Set<string>();
  return text.split(pattern).map((part, i) => {
    if (links[part] && !used.has(part)) {
      used.add(part);
      return (
        // Not editable, so the link still works inside click-to-edit text in local dev.
        <a key={i} href={links[part]} contentEditable={false} className="underline decoration-bloom-300 underline-offset-4 hover:text-bloom-600">
          {part}
        </a>
      );
    }
    return part;
  });
}

/**
 * Text that's click-to-edit in local dev and plain text on the live site.
 * Empty text renders nothing, so deleting a line on the page also removes its spacing.
 */
function E({
  path,
  as,
  className,
  children,
  links,
}: {
  path: string;
  as?: "span" | "p" | "div";
  className?: string;
  children: string;
  /** Words to link, e.g. { Utah: "/#work" }. The first occurrence of each becomes a link. */
  links?: Record<string, string>;
}) {
  if (!children.trim()) return null;
  // Show line breaks typed into the text (Enter) as breaks on the page.
  const cls = children.includes("\n") ? `${className ?? ""} whitespace-pre-line` : className;
  return (
    // key: rebuild the element when the saved text changes, so in-place edits never leave stale fragments.
    <Editable key={children} file={FILE} path={path} as={as} className={cls}>
      {links ? linkWords(children, links) : children}
    </Editable>
  );
}

/** Numbered card used for criteria, impact and similar short lists. */
function NumberedItem({ n, name, body, path }: { n: number; name: string; body: string; path: string }) {
  return (
    <li className="flex gap-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-100 font-display text-base text-bloom-600">
        {n}
      </span>
      <div>
        <E as="p" path={`${path}.name`} className="font-display text-xl text-maroon-900">{name}</E>
        <E as="p" path={`${path}.body`} className="mt-2 text-[15px] leading-relaxed text-maroon-900/85">{body}</E>
      </div>
    </li>
  );
}

const sectionHeading = "text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight text-bloom-500 sm:text-5xl";

/** Rings that grow with each tier: one community, several, the country. */
function TierMark({ tier }: { tier: number }) {
  const r = [0, 1, 2];
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 text-bloom-500" aria-hidden="true">
      {tier === 0 && <circle cx="32" cy="32" r="9" fill="none" stroke="currentColor" strokeWidth="3" />}
      {tier === 1 &&
        r.map((i) => {
          const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={32 + Math.cos(a) * 13} cy={32 + Math.sin(a) * 13} r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />;
        })}
      {tier === 2 && (
        <>
          <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="3.5" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={32 + Math.cos(a) * 24} cy={32 + Math.sin(a) * 24} r="4.5" fill="none" stroke="currentColor" strokeWidth="2.5" />;
          })}
        </>
      )}
    </svg>
  );
}

/** How far the reader has scrolled through the ladder, so each tier fades in as it's reached. */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh * 0.7 - rect.top) / rect.height;
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return { ref, progress };
}

/** Which section is currently in view, for highlighting the section bar. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const onScroll = () => {
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

export default function CohortPage() {
  const { ref: ladderRef, progress } = useScrollProgress<HTMLOListElement>();
  const statusLine = cohortStatusLine();
  // The RFP PDF download appears once applications open (preview early with ?rfp=open).
  const showPdf = Boolean(RFP_PDF) && rfpStatus() !== "upcoming";
  const c = copy;
  const tiers = c.ladder.tiers;
  const scopes = [
    { key: "core", s: c.work.core },
    { key: "coDesign", s: c.work.coDesign },
  ] as const;
  // The application form is embedded at the bottom while applications are open; Apply buttons jump to it.
  const showForm = rfpStatus() === "open";
  const navIds = useMemo(() => SECTIONS.filter((id) => id !== "apply" || showForm), [showForm]);
  const active = useActiveSection(navIds);
  const formAnchor = "#apply";
  // Info session registration shows until the session is over.
  const showInfoSession = infoSessionUpcoming();
  const infoButton = showInfoSession && (
    <Pill href={INFO_SESSION_URL} external variant="soft">
      {c.infoSession.button}
    </Pill>
  );
  // Session dates come from INFO_SESSIONS in content/rfp.ts; past sessions drop off automatically.
  const sessionWhen = infoSessionWhen();
  const infoWhen = showInfoSession && sessionWhen && <p className="mt-2 text-[15px] text-maroon-900/80">{sessionWhen}</p>;
  const pdfButton = showPdf && (
    <Pill href={assetHref(RFP_PDF)} external variant="soft" arrow={false}>
      {c.hero.pdfLabel}
    </Pill>
  );

  return (
    <main>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-cream pb-16 pt-36 sm:pt-44">
        <Glow className="left-1/2 top-0 h-[80vmin] w-[80vmin] -translate-x-1/2" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <h1 className="max-w-4xl font-display text-5xl font-medium leading-[1.02] tracking-tight text-bloom-500 sm:text-6xl lg:text-7xl">
            <E path="hero.heading">{c.hero.heading}</E>
          </h1>
          <E
            as="p"
            path="hero.intro"
            links={{ Utah: sectionHref("work"), Oregon: sectionHref("work") }}
            className="mt-6 block max-w-xl text-base leading-relaxed text-maroon-900/85"
          >
            {c.hero.intro}
          </E>
          {ANNOUNCEMENT_URL && c.hero.announcementLabel && (
            <a
              href={ANNOUNCEMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-bloom-600 underline decoration-bloom-300 underline-offset-4 hover:text-bloom-700"
            >
              {c.hero.announcementLabel}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </a>
          )}
          <p className="mt-8 text-sm font-semibold text-maroon-900">{statusLine}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <CohortCTA formAnchor={formAnchor} />
            {infoButton}
            {pdfButton}
          </div>
          {showInfoSession && sessionWhen && (
            <p className="mt-3 text-sm text-maroon-900/75">
              {/* "Info sessions" while two remain, "Info session" once only one is left */}
              <span className="font-medium text-maroon-900">
                {sessionWhen.includes(" or ") ? c.infoSession.heroPrefix : c.infoSession.heroPrefix.replace(/s$/, "")}
              </span>:{" "}
              {sessionWhen}
            </p>
          )}

        </div>
      </section>

      {/* Section bar: sticks under the site header while scrolling, highlights the current section */}
      <nav aria-label="On this page" className="sticky top-20 z-40 border-y border-blush-200 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 lg:px-10">
          <p className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-bloom-500 md:block">{c.navLabel}</p>
          <div className="-mx-2 flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
            {navIds.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                  active === id ? "bg-blush-100 text-bloom-600" : "text-maroon-900 hover:text-bloom-600"
                }`}
              >
                {c.nav[id]}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* The moment (draft, hidden unless the link has ?preview=moment): the choices AI raises, as questions */}
      {previewEnabled("moment") && (
      <section id="moment" className="scroll-mt-40 bg-cream pb-4 pt-14 md:pt-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Eyebrow>
            <E path="moment.eyebrow">{c.moment.eyebrow}</E>
          </Eyebrow>
          <h2 className={`${sectionHeading} max-w-4xl`}>
            <E path="moment.heading">{c.moment.heading}</E>
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {c.moment.items.map((m, i) => (
              <li key={i} className="rounded-3xl border border-blush-200 bg-white p-7 shadow-soft">
                <E as="p" path={`moment.items.${i}.label`} className="text-xs font-semibold uppercase tracking-[0.18em] text-bloom-500">
                  {m.label}
                </E>
                <E as="p" path={`moment.items.${i}.question`} className="mt-3 font-display text-xl leading-snug text-maroon-900">
                  {m.question}
                </E>
              </li>
            ))}
          </ul>
          <div className="mt-10 max-w-3xl border-l-2 border-bloom-500 pl-6">
            <E as="p" path="moment.contrast" className="text-lg leading-relaxed text-maroon-900/75">
              {c.moment.contrast}
            </E>
            <E as="p" path="moment.bridge" className="mt-3 font-display text-2xl leading-snug text-maroon-900">
              {c.moment.bridge}
            </E>
          </div>
        </div>
      </section>
      )}

      {/* From communities to the country */}
      <section className="relative overflow-hidden bg-cream py-14 md:py-20">
        <Glow tone="blush" className="-right-1/4 top-1/3 h-[60vmin] w-[60vmin]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 lg:px-10">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-40">
              <p className="font-display text-2xl leading-snug text-maroon-900 sm:text-3xl">
                <E path="ladder.heading">{c.ladder.heading}</E>
                <E path="ladder.headingAccent" className="mt-2 block text-bloom-500">
                  {c.ladder.headingAccent}
                </E>
              </p>
              <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-maroon-900/85">
                <E as="p" path="ladder.body">{c.ladder.body}</E>
                <E as="p" path="network.body">{c.network.body}</E>
                <E as="p" path="ladder.emphasis" className="font-medium text-maroon-900">
                  {c.ladder.emphasis}
                </E>
              </div>
            </div>
          </div>

          {/* The ladder */}
          <ol ref={ladderRef} className="md:col-span-6 md:col-start-7" aria-label="How questions travel">
            {tiers.map((t, i) => {
              const reached = progress >= i / tiers.length;
              return (
                <li key={i} className="flex items-center gap-6 pb-10 last:pb-0">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center transition-opacity duration-500 ${
                      reached ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <TierMark tier={i} />
                  </div>
                  <div
                    className={`flex-1 rounded-2xl bg-white p-6 shadow-soft transition-all duration-500 ${
                      reached ? "translate-y-0 opacity-100" : "translate-y-3 opacity-60"
                    }`}
                  >
                    <E as="p" path={`ladder.tiers.${i}.level`} className="text-xs font-semibold uppercase tracking-[0.2em] text-bloom-500">
                      {t.level}
                    </E>
                    <E as="p" path={`ladder.tiers.${i}.body`} className="mt-2 text-[15px] leading-relaxed text-maroon-900">
                      {t.body}
                    </E>
                  </div>
                </li>
              );
            })}
          </ol>

          <img
            src={assetHref("photos/delegates-conversation.jpg")}
            alt={c.network.imageAlt}
            loading="lazy"
            className="aspect-[21/9] w-full rounded-3xl bg-blush-100 object-cover object-[50%_30%] md:col-span-12"
          />
        </div>
      </section>

      {/* Who we're looking for */}
      <section id="who" className="relative scroll-mt-40 overflow-hidden bg-cream py-14 md:py-20">
        <Glow tone="blush" className="-right-1/4 top-0 h-[60vmin] w-[60vmin]" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <h2 className={`${sectionHeading} max-w-3xl`}>
            <E path="who.heading">{c.who.heading}</E>
          </h2>
          {/* One column: the "what's at stake" paragraph, then topics wrapping across the full width */}
          <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-maroon-900/85">
            <E as="p" path="who.whereLabel" className="text-xs font-semibold uppercase tracking-[0.18em] text-bloom-500">
              {c.who.whereLabel}
            </E>
            {c.who.where.map((p, i) => (
              <E key={i} as="p" path={`who.where.${i}`}>{p}</E>
            ))}
          </div>

          <div className="mt-10">
            <E as="p" path="who.topicsLabel" className="text-xs font-semibold uppercase tracking-[0.18em] text-bloom-500">
              {c.who.topicsLabel}
            </E>
            <E as="p" path="who.topicsIntro" className="mt-2 text-[15px] leading-relaxed text-maroon-900/85">
              {c.who.topicsIntro}
            </E>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.who.topics.map((t, i) => (
                <li key={i} className="rounded-full bg-blush-100 px-4 py-2 text-sm text-bloom-600">
                  <E path={`who.topics.${i}`}>{t}</E>
                </li>
              ))}
            </ul>
            <E as="p" path="who.influenceLabel" className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-bloom-500">
              {c.who.influenceLabel}
            </E>
            <E as="p" path="who.influence" className="mt-2 max-w-3xl text-[15px] leading-relaxed text-maroon-900/85">
              {c.who.influence}
            </E>
          </div>

          <div className="mt-10 rounded-3xl bg-white p-8 shadow-soft sm:p-12">
            <E as="p" path="who.assessHeading" className="font-display text-3xl text-maroon-900">{c.who.assessHeading}</E>
            <E as="p" path="who.assessIntro" className="mt-3 max-w-3xl text-[15px] leading-relaxed text-maroon-900/85">
              {c.who.assessIntro}
            </E>
            <ol className="mt-10 grid gap-10 md:grid-cols-2">
              {c.who.criteria.map((cr, i) => (
                <NumberedItem key={i} n={i + 1} name={cr.name} body={cr.body} path={`who.criteria.${i}`} />
              ))}
            </ol>
          </div>

          {/* State and regional civic hubs inquire rather than apply */}
          <aside id="hubs" className="mt-6 grid scroll-mt-40 gap-6 rounded-3xl border border-blush-200 bg-blush-50 p-8 sm:p-10 lg:grid-cols-12 lg:gap-10">
            <E as="p" path="who.hub.heading" className="font-display text-3xl leading-snug text-maroon-900 lg:col-span-5">
              {c.who.hub.heading}
            </E>
            <div className="lg:col-span-7">
              <E as="p" path="who.hub.body" className="text-[15px] leading-relaxed text-maroon-900/85">
                {c.who.hub.body}
              </E>
              <div className="mt-6">
                <Pill href={HUB_INQUIRY_MAILTO} variant="soft">
                  {c.who.hub.button}
                </Pill>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* The work: core and co-design community assemblies */}
      <section id="host-roles" className="relative scroll-mt-40 overflow-hidden bg-cream py-14 md:py-20">
        <Glow tone="blush" className="-left-1/4 top-1/4 h-[60vmin] w-[60vmin]" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <h2 className={`${sectionHeading} max-w-3xl`}>
            <E path="work.heading">{c.work.heading}</E>
          </h2>
          <E as="p" path="work.intro" className="mt-6 block max-w-2xl text-lg leading-relaxed text-maroon-900/85">
            {c.work.intro}
          </E>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {scopes.map(({ key, s: h }) => (
              <article key={key} className="flex flex-col rounded-3xl bg-white p-8 shadow-soft sm:p-10">
                <E as="p" path={`work.${key}.name`} className="font-display text-3xl text-maroon-900">{h.name}</E>
                <E as="p" path={`work.${key}.outcome`} className="mt-4 font-display text-2xl leading-snug text-bloom-500">
                  {h.outcome}
                </E>
                <p className="mt-4 font-display text-xl text-maroon-900">
                  <E path={`work.${key}.length`}>{h.length}</E>
                </p>
                <div className="mt-6 rounded-2xl bg-blush-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bloom-500">
                    <E path="work.fundingLabel">{c.work.fundingLabel}</E>
                  </p>
                  <p className="mt-1 font-display text-xl text-maroon-900">
                    <E path={`work.${key}.funding`}>{h.funding}</E>
                  </p>
                </div>
                <E as="p" path="work.stepsLabel" className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-bloom-500">
                  {c.work.stepsLabel}
                </E>
                <ul className="mt-4 space-y-5">
                  {h.steps.map((st, i) => (
                    <li key={i} className="flex gap-4">
                      <span aria-hidden="true" className="shrink-0 text-bloom-500">&rarr;</span>
                      <div>
                        <E as="p" path={`work.${key}.steps.${i}.name`} className="font-medium text-maroon-900">{st.name}</E>
                        <E as="p" path={`work.${key}.steps.${i}.body`} className="mt-1 text-[15px] leading-relaxed text-maroon-900/80">
                          {st.body}
                        </E>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section id="support" className="scroll-mt-40 bg-cream py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 lg:px-10">
          <div className="md:col-span-5">
            <h2 className={sectionHeading}>
              <E path="support.heading">{c.support.heading}</E>
            </h2>
            <E as="p" path="support.fundingNote" className="mt-6 text-[15px] leading-relaxed text-maroon-900/85">
              {c.support.fundingNote}
            </E>
          </div>
          <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 md:col-span-7">
            {c.support.receive.map((r, i) => (
              <li key={i}>
                <p className="flex gap-2 font-display text-xl text-maroon-900">
                  <span className="text-bloom-500" aria-hidden="true">&#10003;</span>
                  <E path={`support.receive.${i}.name`}>{r.name}</E>
                </p>
                <E as="p" path={`support.receive.${i}.body`} className="mt-2 text-[15px] leading-relaxed text-maroon-900/80">
                  {r.body}
                </E>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The tools: CivicOS, one card per tool, tied to the playbook step it supports */}
      <section id="tools" className="scroll-mt-40 bg-cream py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <h2 className={`${sectionHeading} max-w-3xl`}>
            <E path="tools.heading">{c.tools.heading}</E>
          </h2>
          <E as="p" path="tools.intro" className="mt-6 block max-w-2xl text-lg leading-relaxed text-maroon-900/85">
            {c.tools.intro}
          </E>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {c.tools.items.map((t, i) => (
              <li key={i} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft">
                <img
                  src={assetHref(t.image)}
                  alt={t.imageAlt}
                  loading="lazy"
                  className="aspect-[16/10] w-full bg-blush-50 object-cover object-top"
                />
                <div className="flex flex-1 flex-col p-7">
                  <E as="p" path={`tools.items.${i}.label`} className="text-xs font-semibold uppercase tracking-[0.18em] text-bloom-500">
                    {t.label}
                  </E>
                  <E as="p" path={`tools.items.${i}.name`} className="mt-2 font-display text-2xl text-maroon-900">
                    {t.name}
                  </E>
                  <E as="p" path={`tools.items.${i}.body`} className="mt-3 flex-1 text-[15px] leading-relaxed text-maroon-900/85">
                    {t.body}
                  </E>
                  {t.link && t.linkLabel.trim() && (
                    <a
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-4 inline-flex items-center gap-2 text-sm font-medium text-bloom-600 underline decoration-bloom-300 underline-offset-4 hover:text-bloom-700"
                    >
                      {t.linkLabel}
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="scroll-mt-40 bg-cream py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <h2 className={`${sectionHeading} max-w-3xl`}>
            <E path="impact.heading">{c.impact.heading}</E>
          </h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {c.impact.items.map((it, i) => (
              <NumberedItem key={i} n={i + 1} name={it.name} body={it.body} path={`impact.items.${i}`} />
            ))}
          </ol>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="scroll-mt-40 bg-cream py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <h2 className={`${sectionHeading} max-w-3xl`}>
            <E path="timeline.heading">{c.timeline.heading}</E>
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {c.timeline.items.map((t, i) => (
              <li key={i} className="relative border-t-2 border-blush-200 pt-5">
                <span
                  aria-hidden="true"
                  className={`absolute -top-[7px] left-0 h-3 w-3 rounded-full ${i < 2 ? "bg-bloom-500" : "bg-blush-200"}`}
                />
                <E as="p" path={`timeline.items.${i}.when`} className="font-display text-lg text-bloom-500">{t.when}</E>
                <E as="p" path={`timeline.items.${i}.what`} className="mt-1 text-[15px] text-maroon-900">{t.what}</E>
              </li>
            ))}
          </ol>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {c.timeline.notes.map((n, i) => (
              <div key={i}>
                <E as="p" path={`timeline.notes.${i}.name`} className="font-display text-xl text-maroon-900">{n.name}</E>
                <E as="p" path={`timeline.notes.${i}.body`} className="mt-2 text-[15px] leading-relaxed text-maroon-900/85">{n.body}</E>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form (embedded Airtable), only while applications are open */}
      {showForm && (
        <section id="apply" className="scroll-mt-40 bg-cream pb-16 md:pb-24">
          <div className="mx-auto max-w-4xl px-5">
            <h2 className={`${sectionHeading} max-w-3xl`}>
              <E path="applicationForm.heading">{c.applicationForm.heading}</E>
            </h2>
            <E as="p" path="applicationForm.intro" className="mt-4 text-[15px] leading-relaxed text-maroon-900/85">
              {c.applicationForm.intro}
            </E>
            <iframe
              title="Civic Host application form"
              src={APPLY_EMBED_URL}
              className="mt-8 h-[80vh] min-h-[640px] w-full rounded-3xl border border-blush-200 bg-white shadow-soft"
            />
            <p className="mt-4 text-sm text-maroon-900/75">
              <a href={APPLY_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-bloom-300 underline-offset-4 hover:text-bloom-600">
                {c.applicationForm.newTab}
              </a>
            </p>
          </div>
        </section>
      )}

      {/* Questions: info session registration until it's over, and an email to reach us */}
      <section id="questions" className="scroll-mt-40 bg-cream pb-16 md:pb-24">
        <div className="mx-auto max-w-4xl px-5">
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-blush-50 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <E as="p" path="infoSession.prompt" className="font-display text-3xl text-maroon-900">
                {c.infoSession.prompt}
              </E>
              {showInfoSession && (
                <>
                  <E as="p" path="infoSession.subtitle" className="mt-3 font-display text-xl text-bloom-500">
                    {c.infoSession.subtitle}
                  </E>
                  {infoWhen}
                </>
              )}
              <p className="mt-4 text-[15px] text-maroon-900/80">
                <E path="infoSession.emailPrompt">{c.infoSession.emailPrompt}</E>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-bloom-600 underline decoration-bloom-300 underline-offset-4 hover:text-bloom-700">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
            {showInfoSession && (
              <Pill href={INFO_SESSION_URL} external className="!px-8 !py-4 !text-base">
                {c.infoSession.rsvp}
              </Pill>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
