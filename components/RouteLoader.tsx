"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * RouteLoader
 * ------------------------------------------------------------------
 * A tiny, dependency-free top progress bar (like YouTube/GitHub).
 *
 * How it works:
 * 1. A single document-level click listener detects clicks on any
 *    internal <a> link (including Next.js <Link>) and instantly shows
 *    the bar — so the user gets feedback the moment they tap, even
 *    before Next.js starts fetching/rendering the next page.
 * 2. When the route actually changes (pathname or search params),
 *    we know the new page has taken over, so we finish the bar and
 *    fade it out.
 *
 * This is intentionally framework-light:
 * - No external packages (no nprogress, no nextjs-toploader)
 * - Pure CSS transition for the animation (no JS-driven frame loop)
 * - Client Component only — has zero effect on server-rendered HTML,
 *   so it doesn't affect SEO/crawling in any way.
 *
 * Mount this ONCE in app/layout.tsx, inside <body>, and it applies
 * automatically to every page/link across the whole site.
 */
export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Show the bar the instant a same-site link is clicked.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external links, new-tab links, hash links, and downloads —
      // those don't trigger a Next.js route change.
      const isExternal = anchor.target === "_blank" || href.startsWith("http") || href.startsWith("//");
      const isHash = href.startsWith("#");
      const isDownload = anchor.hasAttribute("download");
      const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

      if (isExternal || isHash || isDownload || isModifiedClick) return;

      setLoading(true);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // 2. Hide the bar once the route has actually changed.
  useEffect(() => {
    if (!loading) return;

    // Small delay so the finishing animation is visible even on very
    // fast navigations — avoids an abrupt flash.
    timeoutRef.current = setTimeout(() => setLoading(false), 250);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 h-[3px] bg-purple-600 z-[9999] transition-all ease-out ${
        loading ? "w-full opacity-100 duration-[600ms]" : "w-0 opacity-0 duration-200"
      }`}
    />
  );
}