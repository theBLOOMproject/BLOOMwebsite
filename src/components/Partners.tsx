/**
 * Partners: logo wall on the homepage.
 *
 * To add a logo: put the file in public/partners/ and set `logo` below. Partners without one show their name.
 * Each partner links to its website via `url`. Still to confirm: AEGIX, Engage Forum, Child First Policy Center,
 * Oregon's Kitchen Table and CrownShy (shown unlinked until a URL is set).
 */
import { useState } from "react";
import { Eyebrow } from "./ui";
import { INSTITUTION } from "../content/terms";
import { assetHref } from "../utils/href";

const PARTNERS: { name: string; url?: string; logo?: string }[] = [
  { name: "Utah Common Ground", url: "https://www.utahcommonground.org/", logo: "partners/utah-common-ground.png" },
  { name: "Mormon Women for Ethical Government", url: "https://www.mormonwomenforethicalgovernment.org/", logo: "partners/mweg.png" }, // small source (157px); swap for a larger file when available
  { name: "Central Oregon Civic Action Project (COCAP)", url: "https://cocap.us/", logo: "partners/cocap.png" },
  { name: "Braver Angels", url: "https://braverangels.org/", logo: "partners/braver-angels.png" },
  { name: "AEGIX AI Ethics & Governance Institute", logo: "partners/aegix.png" },
  { name: "Center for Anticipatory Intelligence, Utah State University", url: "https://www.usu.edu/cai/", logo: "partners/center-anticipatory-intelligence.png" },
  { name: "Engage Forum", logo: "partners/engage-forum.png" },
  { name: "Child First Policy Center", logo: "partners/child-first-policy-center.png" },
  { name: "Oregon\u2019s Kitchen Table", logo: "partners/oregons-kitchen-table.png" },
  { name: "Central Oregon Community College", url: "https://www.cocc.edu/", logo: "partners/central-oregon-community-college.png" },
  { name: "Central Oregon Intergovernmental Council", url: "https://coic.org/", logo: "partners/coic.png" },
  { name: "Citizens4Community", url: "https://citizens4community.com/", logo: "partners/citizens4community.png" },
  { name: "Metagov", url: "https://metagov.org/", logo: "partners/metagov.png" },
  { name: "CrownShy", logo: "partners/crownshy.png" },
];

/** Size each logo by area rather than width, so wide wordmarks and square marks carry similar weight. */
const LOGO_AREA = 8600;
const MAX_W = 220;
const MAX_H = 96;

function Logo({ src, name }: { src: string; name: string }) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  return (
    <img
      src={assetHref(src)}
      alt={name}
      loading="lazy"
      onLoad={(e) => {
        const ratio = e.currentTarget.naturalWidth / e.currentTarget.naturalHeight;
        let width = Math.min(MAX_W, Math.sqrt(LOGO_AREA * ratio));
        let height = width / ratio;
        if (height > MAX_H) {
          height = MAX_H;
          width = height * ratio;
        }
        setSize({ width: Math.round(width), height: Math.round(height) });
      }}
      style={size ?? { maxHeight: MAX_H, maxWidth: MAX_W }}
      className="max-w-full object-contain"
    />
  );
}

export default function Partners() {
  return (
    <section id="partners" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="max-w-2xl">
          <Eyebrow>Partners</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight text-bloom-500 sm:text-5xl">
            Bigger than any one organization.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-maroon-900/80">
            The {INSTITUTION} is built by civic groups, coalitions and technology partners working together.
          </p>
        </div>

        <ul className="mt-16 flex flex-wrap justify-center gap-y-14 border-t border-blush-200 pt-14">
          {PARTNERS.map(({ name, url, logo }) => {
            const mark = logo ? (
              <Logo src={logo} name={name} />
            ) : (
              <span className="max-w-[14rem] font-display text-lg leading-snug text-maroon-900/80">{name}</span>
            );
            return (
              <li key={name} className="flex h-24 basis-1/2 items-center justify-center px-4 text-center sm:basis-1/3 lg:basis-1/4">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} (opens in a new tab)`}
                    className="flex items-center justify-center rounded-lg transition-opacity hover:opacity-75"
                  >
                    {mark}
                  </a>
                ) : (
                  mark
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-16 text-center font-display text-xl text-maroon-900 sm:text-2xl">
          And growing. Partner with us:{" "}
          <a
            href="mailto:hello@bloom-project.org?subject=Partnering%20with%20BLOOM"
            className="text-bloom-500 underline decoration-bloom-300 underline-offset-4 hover:text-bloom-600"
          >
            hello@bloom-project.org
          </a>
        </p>
      </div>
    </section>
  );
}
