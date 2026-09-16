"use client";

import { useEffect } from "react";

// Actually downloads the video into the browser's Cache Storage during
// idle time (not just a "hint" like rel=prefetch, which browsers often
// only partially honor for video/range-requested resources). Once cached,
// the exact same URL requested later by <video src=...> is served from
// this cache instantly — no network round trip, no buffering delay.
export default function VideoPreloader({ url }: { url: string }) {
  useEffect(() => {
    if (!url || typeof window === "undefined") return;
    if (!("caches" in window)) return; // very old browsers: silently skip

    let cancelled = false;
    const w = window as any;

    const warmCache = async () => {
      try {
        const cache = await caches.open("video-preload-v1");
        const existing = await cache.match(url);
        if (existing || cancelled) return; // already cached, nothing to do

        const res = await fetch(url, { mode: "cors", credentials: "omit" });
        if (!cancelled && res.ok) {
          await cache.put(url, res.clone());
        }
      } catch {
        // Network hiccup or CORS issue — fail silently, video will just
        // load normally (with the original delay) on the restaurant page.
      }
    };

    let idleId: number;
    const usingIdleCallback = "requestIdleCallback" in w;

    if (usingIdleCallback) {
      idleId = w.requestIdleCallback(warmCache, { timeout: 4000 });
    } else {
      idleId = w.setTimeout(warmCache, 1500);
    }

    return () => {
      cancelled = true;
      if (usingIdleCallback) {
        w.cancelIdleCallback(idleId);
      } else {
        w.clearTimeout(idleId);
      }
    };
  }, [url]);

  return null;
}