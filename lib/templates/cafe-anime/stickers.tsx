// lib/templates/cafe-anime/stickers.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface StickerConfig {
  id: number;
  src: string;
  top: string;    // % down the full page (not viewport) — scrolls with content
  left: string;   // % across
  size: number;
  rotate: number;
  opacity: number;
}

// Pool of sticker images, cycled through as the random slots below are
// generated. Replace with your own external URLs, or point these at files
// in public/anime/stickers/ if you'd rather self-host. Add as many distinct
// images here as you have — with only one image, 80 stickers will just be
// the same picture repeated 80 times at different sizes/positions.
const STICKER_IMAGE_POOL = [
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555663/images__9_-removebg-preview_zhmxlc.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555656/images__11_-removebg-preview_b9ydiu.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555662/e33c2fa94c03efa06678116f80d62d0d_1c4bccf2-0e38-4f4c-8dcd-f51830857d15_708x-removebg-preview_gnuzab.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555655/images__10_-removebg-preview_vjxzkw.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555654/images__12_-removebg-preview_unr9ed.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555654/images__12_-removebg-preview_unr9ed.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555654/3c171372e2ef27248f5f99e66231e1d9-removebg-preview_pwk1gf.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555654/images__14_-removebg-preview_hclvo4.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555654/images__13_-removebg-preview_xr4abt.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555653/images__15_-removebg-preview_bgquaq.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555653/images__16_-removebg-preview_kt2hep.png",
  "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789555653/images__17_-removebg-preview_axapoo.png",
];

const STICKER_COUNT = 80;

// Virtual canvas used ONLY for collision math at generation time — real
// page height isn't known until the browser lays out your actual menu
// content. Positions get computed in this pixel space, then converted to
// percentages, so if your real page ends up taller or shorter than this,
// spacing stretches/compresses proportionally but should stay
// overlap-free either way. If stickers still look cramped once live
// (e.g. you have way more menu items than this assumes), bump
// CANVAS_HEIGHT up so there's more "room" to space things out into.
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 5200;

// Your menu content sits in a centered column (max-w-3xl). This defines
// that column as a fraction of CANVAS_WIDTH so stickers can be kept out
// of it — 0.30 to 0.70 means the middle 40% of the canvas is off-limits,
// leaving a 30%-wide margin band on each side for stickers to live in.
// Narrow this (e.g. 0.35–0.65) to give stickers more room if you want a
// wider content column protected, or widen it if you want stickers to
// creep closer to the menu.
const CONTENT_ZONE_LEFT = 0.3;
const CONTENT_ZONE_RIGHT = 0.7;

// How many random spots to try per sticker before giving up and shrinking
// it to make room. Higher = better spacing but slower generation.
const MAX_PLACEMENT_ATTEMPTS = 40;

// Extra breathing room enforced between sticker edges, on top of their
// own radii — prevents stickers from technically not-overlapping but
// still touching edge-to-edge.
const MIN_GAP_PX = 6;

// Size tiers, weighted toward small/medium so the page doesn't turn into
// wall-to-wall images — but "large" and a rarer "huge" tier are in the mix
// so a handful of stickers really stand out.
function randomSize() {
  const roll = Math.random();
  if (roll < 0.45) return 16 + Math.random() * 24;    // small: 16–40px (45%)
  if (roll < 0.75) return 40 + Math.random() * 40;    // medium: 40–80px (30%)
  if (roll < 0.92) return 80 + Math.random() * 70;    // large: 80–150px (17%)
  return 150 + Math.random() * 130;                    // huge: 150–280px (8%)
}

function circlesOverlap(
  ax: number, ay: number, ar: number,
  bx: number, by: number, br: number
) {
  const dx = ax - bx;
  const dy = ay - by;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < ar + br + MIN_GAP_PX;
}

// Picks an x-coordinate for a sticker of the given radius, confined to
// the LEFT margin band (before CONTENT_ZONE_LEFT) or RIGHT margin band
// (after CONTENT_ZONE_RIGHT) — never inside the protected center column.
// Returns null if the sticker is too big to fit in either band at all,
// so the caller can shrink it and retry.
function randomSideX(radius: number): number | null {
  const leftBandWidth = CONTENT_ZONE_LEFT * CANVAS_WIDTH;
  const rightBandStart = CONTENT_ZONE_RIGHT * CANVAS_WIDTH;
  const rightBandWidth = CANVAS_WIDTH - rightBandStart;

  const goLeft = Math.random() < 0.5;
  const bandWidth = goLeft ? leftBandWidth : rightBandWidth;

  // Sticker's full diameter must fit inside the chosen band.
  if (radius * 2 > bandWidth) return null;

  if (goLeft) {
    return radius + Math.random() * (leftBandWidth - radius * 2);
  }
  return rightBandStart + radius + Math.random() * (rightBandWidth - radius * 2);
}

function generateStickers(): StickerConfig[] {
  // Tracks every sticker already placed, as a center point + radius, so
  // each new one can be checked against all previous ones.
  const placedCircles: { x: number; y: number; radius: number }[] = [];
  const stickers: StickerConfig[] = [];

  for (let i = 0; i < STICKER_COUNT; i++) {
    let size = randomSize();
    let centerX = 0;
    let centerY = 0;
    let placedOk = false;

    // Try random spots (confined to the side margin bands) at the rolled
    // size. If the bands are getting full and nothing clear turns up,
    // shrink this sticker ~25% and try the search again rather than
    // force an overlap or spill into the content column.
    for (let shrinkStep = 0; shrinkStep < 4 && !placedOk; shrinkStep++) {
      const radius = size / 2;

      for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt++) {
        const candidateX = randomSideX(radius);
        if (candidateX === null) break; // too big for either band at this size — shrink and retry

        const candidateY = radius + Math.random() * Math.max(CANVAS_HEIGHT - size, 0);

        const collides = placedCircles.some((p) =>
          circlesOverlap(candidateX, candidateY, radius, p.x, p.y, p.radius)
        );

        if (!collides) {
          centerX = candidateX;
          centerY = candidateY;
          placedOk = true;
          break;
        }
      }
      if (!placedOk) size *= 0.75;
    }

    // Extremely rare fallback: if even the smallest retry found no clear
    // spot in either side band, place it anyway (still confined to a
    // side band, just possibly overlapping slightly) rather than
    // silently dropping the sticker or letting it land in the content
    // column.
    if (!placedOk) {
      const radius = size / 2;
      const fallbackX = randomSideX(radius);
      centerX = fallbackX ?? radius; // last resort: pin to left edge
      centerY = radius + Math.random() * Math.max(CANVAS_HEIGHT - size, 0);
    }

    placedCircles.push({ x: centerX, y: centerY, radius: size / 2 });

    stickers.push({
      id: i,
      src: STICKER_IMAGE_POOL[i % STICKER_IMAGE_POOL.length],
      top: `${((centerY - size / 2) / CANVAS_HEIGHT) * 100}%`,
      left: `${((centerX - size / 2) / CANVAS_WIDTH) * 100}%`,
      size,
      rotate: Math.random() * 40 - 20, // -20deg to 20deg
      opacity: 1 + Math.random() * 0.4, // 0.3–0.7
    });
  }

  return stickers;
}

export function AnimeStickers() {
  const [stickers, setStickers] = useState<StickerConfig[] | null>(null);

  // Generated client-side only, after mount. Doing this during the render
  // Next.js uses for SSR would make the server-rendered HTML and the
  // client's first render disagree (a hydration mismatch); waiting for
  // useEffect sidesteps that. Trade-off: stickers pop in a beat after
  // first paint instead of being present immediately.
  useEffect(() => {
    setStickers(generateStickers());
  }, []);

  if (!stickers) return null;

  return (
    <div
      aria-hidden="true"
      // `absolute inset-0` (not `fixed`) anchors this layer to the height
      // of its positioned ancestor (the <main> in CafeAnimeTemplate, which
      // is `relative`). With top/right/bottom/left all 0, the browser
      // stretches this div to match <main>'s full rendered height —
      // including content added by menu items, not just the viewport —
      // so top:"%" positions spread across the *whole page* and scroll
      // normally instead of staying pinned to the screen.
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {stickers.map((s) => (
        <Image
          key={s.id}
          src={s.src}
          alt=""
          width={Math.round(s.size)}
          height={Math.round(s.size)}
          className="absolute select-none"
          style={{
            top: s.top,
            left: s.left,
            transform: `rotate(${s.rotate}deg)`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}