"use client";
import type { Attribution } from "./leads";

const KEY = "sb_first_touch";

/** Capture first-touch attribution in the browser (fixes the blank-UTM problem of server-side capture). */
export function captureFirstTouch() {
  try {
    if (localStorage.getItem(KEY)) {
      sessionStorage.setItem("sb_returning", "1");
      return;
    }
    const p = new URLSearchParams(location.search);
    const w = window.innerWidth;
    const first: Attribution = {
      landingPage: location.pathname + location.search,
      referrer: document.referrer ? new URL(document.referrer).hostname : "",
      utmSource: p.get("utm_source") ?? (document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "direct"),
      utmMedium: p.get("utm_medium") ?? undefined,
      utmCampaign: p.get("utm_campaign") ?? undefined,
      device: w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop",
    };
    localStorage.setItem(KEY, JSON.stringify(first));
  } catch {
    /* storage unavailable */
  }
}

export function getAttribution(): Attribution {
  let first: Attribution = {};
  try {
    first = JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {}
  const w = window.innerWidth;
  return { ...first, sourcePage: location.pathname, device: first.device ?? (w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop"), returning: sessionStorage.getItem("sb_returning") === "1" };
}
