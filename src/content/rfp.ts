/**
 * The 2027 Civic Hosts call (RFP): dates, links and the open/close logic, shared by
 * /cohort/ and the homepage teasers.
 *
 * The cohort page's wording (including the timeline dates and funding amounts shown on
 * the page) lives in content/cohort.json. If you change OPENS or CLOSES here, update the
 * timeline there too, and keep both matched to the RFP slide deck (RFP_PDF).
 */

/** Airtable application form. Opens in a new tab. */
export const APPLY_URL = "https://airtable.com/appWfFclW2rKc7Ot1/pagikLlEpAcW0r6ZY/form";
/** The same form, embedded at the bottom of /cohort/ while applications are open. */
export const APPLY_EMBED_URL = "https://airtable.com/embed/appWfFclW2rKc7Ot1/pagikLlEpAcW0r6ZY/form";

export const CONTACT_EMAIL = "hello@bloom-project.org";

/** Substack post announcing the call. Linked under the cohort page intro. */
export const ANNOUNCEMENT_URL = "https://bloomproject.substack.com/p/introducing-the-public-assembly-on";

/**
 * The Call for Civic Hosts (CFP) as a PDF in public/. The download link shows once this is set and
 * applications have opened. The old address (rfp/founding-civic-hosts-rfp.pdf) is kept as a copy of
 * the same file so links shared before the rename still work; update both when the PDF changes.
 */
export const RFP_PDF = "cfp/call-for-civic-hosts.pdf";

/** Pacific time (Oct 15 is daylight time, UTC−7). Before OPENS the site shows "Get notified"; after CLOSES it says applications are closed. Applications open at 2:00 PM PT. */
export const OPENS = new Date("2026-10-15T14:00:00-07:00");
export const CLOSES = new Date("2026-11-20T23:59:59-08:00");
export const OPENS_LABEL = "October 15, 2026, at 2:00 PM PT";
/** Used on the day applications open, e.g. "today, October 15, at 2:00 PM PT". */
export const OPENS_TODAY_LABEL = "today, October 15, at 2:00 PM PT";
export const CLOSES_LABEL = "November 20, 2026";

export type RfpStatus = "upcoming" | "open" | "closed";

/**
 * ?rfp=upcoming|open|closed shows the page as it will look on those dates, locally and on the live
 * site (for sharing previews with the team). It only changes which buttons show; the form and PDF are public anyway.
 */
function previewOverride(): RfpStatus | null {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("rfp");
  return v === "upcoming" || v === "open" || v === "closed" ? v : null;
}

export function rfpStatus(now = new Date()): RfpStatus {
  const override = previewOverride();
  if (override) return override;
  if (now < OPENS) return "upcoming";
  if (now > CLOSES) return "closed";
  return "open";
}

/** State or regional civic hubs inquire by email rather than applying. */
export const HUB_INQUIRY_MAILTO = `mailto:${CONTACT_EMAIL}?subject=State%20or%20regional%20civic%20hub%20(2027%20Cohort)`;

/** Zoom registration for the "Call for Civic Hosts Info Session | Public Assembly on AI". */
export const INFO_SESSION_URL = "https://us02web.zoom.us/meeting/register/E6q9UVGJQx-UnN02WG5wuA";
/**
 * Info sessions, in order. Each one drops off the page once it has ended (allowing an hour), and the
 * registration links hide after the last one. Both are 10:00 AM Pacific.
 */
export const INFO_SESSIONS = [
  { label: "Thursday, October 22", ends: new Date("2026-10-22T11:00:00-07:00") },
  { label: "Tuesday, November 10", ends: new Date("2026-11-10T11:00:00-08:00") },
];
export const INFO_SESSION_TIME = "10:00 AM PT / 1:00 PM ET";
export const INFO_SESSION_ENDS = INFO_SESSIONS[INFO_SESSIONS.length - 1].ends;

/** e.g. "Thursday, October 22 or Tuesday, November 10 · 10:00 AM PT / 1:00 PM ET" — only sessions still ahead. */
export function infoSessionWhen(now = new Date()) {
  const upcoming = INFO_SESSIONS.filter((s) => now < s.ends).map((s) => s.label);
  return upcoming.length ? `${upcoming.join(" or ")} · ${INFO_SESSION_TIME}` : "";
}

export function infoSessionUpcoming(now = new Date()) {
  return Boolean(INFO_SESSION_URL) && now < INFO_SESSION_ENDS && rfpStatus(now) !== "closed";
}

/**
 * Draft sections that stay hidden unless the link asks for them, e.g. /cohort/?preview=moment.
 * Several can be combined: ?preview=moment,other
 */
export function previewEnabled(name: string) {
  if (typeof window === "undefined") return false;
  const v = new URLSearchParams(window.location.search).get("preview");
  return Boolean(v && v.split(",").includes(name));
}
