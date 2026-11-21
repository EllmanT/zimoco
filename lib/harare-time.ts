import { openingHours as H } from "./site";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const OPEN = toMin(H.open);
const CLOSE = toMin(H.close);
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** The current wall-clock time in Harare, independent of the visitor's timezone. */
export function harareNow(at: Date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: H.timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  );
  const y = Number(parts.year), mo = Number(parts.month), d = Number(parts.day);
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const weekday = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  return { y, mo, d, minutes, weekday };
}

export type OpenStatus = { open: boolean; headline: string; detail: string };

export function openStatus(at: Date = new Date()): OpenStatus {
  const n = harareNow(at);
  const isDay = (H.days as readonly number[]).includes(n.weekday);
  if (isDay && n.minutes >= OPEN && n.minutes < CLOSE) {
    const left = CLOSE - n.minutes;
    return { open: true, headline: "Open now", detail: left <= 60 ? `Closes in ${left} min, at ${H.close}` : `Open until ${H.close} today` };
  }
  // Find the next opening moment.
  for (let i = 0; i <= 7; i++) {
    const wd = (n.weekday + i) % 7;
    if (!(H.days as readonly number[]).includes(wd)) continue;
    if (i === 0 && n.minutes >= OPEN) continue; // already past today's opening
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAY_NAMES[wd];
    return { open: false, headline: "Closed right now", detail: `Opens ${when} at ${H.open}` };
  }
  return { open: false, headline: "Closed right now", detail: `Hours: ${H.open} to ${H.close}` };
}

export type ViewingDay = { iso: string; short: string; long: string; slots: string[] };

/** The next open days (default 6) with bookable half-hour slots. Today only offers slots at least an hour ahead. */
export function viewingDays(count = 6, at: Date = new Date()): ViewingDay[] {
  const n = harareNow(at);
  const out: ViewingDay[] = [];
  for (let i = 0; out.length < count && i < 21; i++) {
    const dt = new Date(Date.UTC(n.y, n.mo - 1, n.d + i));
    if (!(H.days as readonly number[]).includes(dt.getUTCDay())) continue;
    const slots: string[] = [];
    for (let m = OPEN; m + H.slotMinutes <= CLOSE; m += H.slotMinutes) {
      if (i === 0 && m < n.minutes + 60) continue;
      slots.push(hhmm(m));
    }
    if (!slots.length) continue;
    const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(dt);
    out.push({
      iso: dt.toISOString().slice(0, 10),
      short: out.length === 0 && i === 0 ? "Today" : i === 1 ? "Tomorrow" : f({ weekday: "short" }),
      long: f({ weekday: "long", day: "numeric", month: "long" }),
      slots,
    });
  }
  return out;
}
