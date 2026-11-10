"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Pair = [string, string];
type LeafType = "chinar" | "poplar" | "apricot" | "willow" | "walnut";

/**
 * Skardu / Baltistan autumn:
 *  - chinar   (Platanus orientalis): big 5-lobed leaves, orange -> crimson
 *  - poplar   (Populus):            pointed diamond leaves, golden yellow
 *  - apricot  (orchards):           pointed oval leaves, orange -> red
 *  - willow   (along streams):      long narrow leaves, pale yellow
 *  - walnut   (leaflets):           pointed elliptical, yellow-brown
 */
const PALETTES: Record<LeafType, Pair[]> = {
  chinar: [["#f08a2c", "#a8340f"], ["#e0642a", "#8a1f10"], ["#f2a23a", "#b4501a"], ["#d9482a", "#7a1810"]],
  poplar: [["#fbe05a", "#d49a1c"], ["#f5cd3c", "#c08414"], ["#ffe987", "#d8a82a"]],
  apricot: [["#f3873a", "#b53d12"], ["#e86a2e", "#9a2a10"], ["#f6b13f", "#c8641a"]],
  willow: [["#e9e27a", "#b9a73a"], ["#f2e68c", "#c8b44a"], ["#d8d86a", "#a79a30"]],
  walnut: [["#c99a3a", "#7d5518"], ["#d7ac45", "#8a601c"], ["#b9812f", "#6d4414"]],
};

const TYPE_POOL: LeafType[] = [
  "chinar", "chinar", "chinar",
  "poplar", "poplar", "poplar",
  "apricot", "apricot",
  "willow", "willow",
  "walnut",
];

const TYPE_SCALE: Record<LeafType, number> = {
  chinar: 1.3, poplar: 0.95, apricot: 0.95, willow: 1.15, walnut: 0.95,
};

const PROFILES: Record<
  string,
  { w: number; p: number; q: number; teeth: number; serr: number; veins: number }
> = {
  poplar: { w: 22, p: 1.3, q: 0.8, teeth: 14, serr: 0.05, veins: 5 },
  apricot: { w: 21, p: 1.45, q: 0.7, teeth: 20, serr: 0.035, veins: 6 },
  willow: { w: 7.5, p: 1.0, q: 0.95, teeth: 0, serr: 0, veins: 0 },
  walnut: { w: 15, p: 1.0, q: 0.95, teeth: 0, serr: 0, veins: 6 },
};

const CHINAR_HALF: [number, number][] = [
  [35, 13], [37, 20], [40, 25], [57, 22], [48, 30], [45, 34], [53, 47], [42, 44], [37, 50], [34, 56],
];

// --- tuning knobs ---
const SPRITE_SIZE = 96;       // biggest leaf is ~47 CSS px, i.e. ~94 device px at 2x DPR
const MAX_DPR = 2;            // cap the canvas resolution so 3x phones don't pay for it
const VARIANTS_PER_TYPE = 4;  // 20 sprites in total
const MAX_FPS = 30;           // motion is slow, 30fps is hard to tell apart and halves the work
const LIGHT_ANGLE = -0.9;     // direction the light comes from (radians), upper-left
const SHAFT_ALPHA = 0.14;     // max strength of the sun shafts (keep it subtle)
const SCROLL_WIND = 0.035;    // how much scroll speed turns into wind
const RESIZE_DEBOUNCE = 150;  // ms
const DEFAULT_Z_INDEX = 40;

type Sprite = {
  img: HTMLCanvasElement;  // the leaf itself
  dark: HTMLCanvasElement; // dark silhouette, overlaid on the shaded side
  glow: HTMLCanvasElement; // warm silhouette, overlaid on the lit side
};

function makeLeafCanvas(type: LeafType, [light, dark]: Pair) {
  const S = SPRITE_SIZE;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.scale(S / 64, S / 64);
  g.lineJoin = "round";
  g.lineCap = "round";

  const curve = (Math.random() - 0.5) * 6;
  const cx = (t: number) => 32 + curve * Math.sin(Math.PI * t);
  const veins: [number, number, number, number][] = [];
  let stemTop = 55;

  g.beginPath();
  if (type === "chinar") {
    const jitter = () => (Math.random() - 0.5) * 1.6;
    const half = CHINAR_HALF.map(([x, y]) => [x + jitter(), y + jitter()] as [number, number]);
    g.moveTo(32, 3);
    half.forEach(([x, y]) => g.lineTo(x, y));
    for (let i = half.length - 1; i >= 0; i--) g.lineTo(64 - half[i][0], half[i][1]);
    [[32, 4], [57, 22], [53, 47], [7, 22], [11, 47]].forEach(([x, y]) => veins.push([32, 55, x, y]));
    stemTop = 56;
  } else {
    const { w, p, q, teeth, serr, veins: nv } = PROFILES[type];
    const N = 48, y0 = 3, y1 = 56;
    const half = (t: number) => {
      const base = w * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(t, p))), q);
      const saw = teeth ? ((t * teeth) % 1) - 0.5 : 0;
      return base * (1 + serr * 2 * saw * Math.sin(Math.PI * t));
    };
    g.moveTo(cx(0), y0);
    for (let i = 1; i <= N; i++) { const t = i / N; g.lineTo(cx(t) + half(t), y0 + t * (y1 - y0)); }
    for (let i = N; i >= 0; i--) { const t = i / N; g.lineTo(cx(t) - half(t), y0 + t * (y1 - y0)); }
    veins.push([cx(0), y0, cx(1), y1]);
    for (let i = 1; i <= nv; i++) {
      const t = 0.14 + (i / (nv + 1)) * 0.75;
      const tt = Math.max(0, t - 0.12);
      const y = y0 + t * (y1 - y0);
      const x = cx(t);
      const hw = half(tt) * 0.85;
      veins.push([x, y, x + hw, y0 + tt * (y1 - y0)]);
      veins.push([x, y, x - hw, y0 + tt * (y1 - y0)]);
    }
  }
  g.closePath();

  const grad = g.createLinearGradient(10, 6, 54, 58);
  grad.addColorStop(0, light);
  grad.addColorStop(1, dark);
  g.fillStyle = grad;
  g.fill();

  g.save();
  g.clip();

  const shade = g.createLinearGradient(8, 0, 56, 0);
  shade.addColorStop(0, "rgba(255,255,255,0.14)");
  shade.addColorStop(0.5, "rgba(255,255,255,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.16)");
  g.fillStyle = shade;
  g.fillRect(0, 0, 64, 64);

  const tipTone = g.createLinearGradient(0, 0, 0, 30);
  tipTone.addColorStop(0, "rgba(90,40,10,0.22)");
  tipTone.addColorStop(1, "rgba(90,40,10,0)");
  g.fillStyle = tipTone;
  g.fillRect(0, 0, 64, 30);

  const spots = Math.floor(Math.random() * 4);
  for (let i = 0; i < spots; i++) {
    g.fillStyle = `rgba(70,30,10,${0.1 + Math.random() * 0.12})`;
    g.beginPath();
    g.arc(18 + Math.random() * 28, 12 + Math.random() * 40, 1 + Math.random() * 2.2, 0, Math.PI * 2);
    g.fill();
  }

  g.strokeStyle = "rgba(60,25,5,0.3)";
  g.lineWidth = 0.9;
  g.beginPath();
  veins.forEach(([x1, y1, x2, y2]) => { g.moveTo(x1, y1); g.lineTo(x2, y2); });
  g.stroke();
  g.restore();

  g.strokeStyle = "rgba(0,0,0,0.2)";
  g.lineWidth = 0.9;
  g.stroke();

  g.strokeStyle = dark;
  g.lineWidth = 1.8;
  g.beginPath();
  g.moveTo(32, stemTop);
  g.lineTo(32 + curve * 0.4, 63);
  g.stroke();

  return c;
}

// a flat-colored copy of the leaf silhouette (used for lighting overlays)
function tinted(img: HTMLCanvasElement, color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = img.width;
  const g = c.getContext("2d")!;
  g.drawImage(img, 0, 0);
  g.globalCompositeOperation = "source-atop";
  g.fillStyle = color;
  g.fillRect(0, 0, c.width, c.height);
  return c;
}

function buildSprite(type: LeafType, pair: Pair): Sprite {
  const img = makeLeafCanvas(type, pair);
  return {
    img,
    dark: tinted(img, "rgb(40,14,4)"),
    glow: tinted(img, "rgb(255,226,150)"),
  };
}

// Sun shafts + glow as pure CSS. Only the opacity changes, which the browser composites on the GPU.
const RAYS_STYLE: CSSProperties = {
  opacity: SHAFT_ALPHA,
  willChange: "opacity",
  background: [
    "radial-gradient(ellipse 90% 70% at 20% -5%, rgba(255,228,160,0.5), rgba(255,228,160,0) 70%)",
    "linear-gradient(115deg, transparent 6%, rgba(255,226,150,0.8) 10%, transparent 15%)",
    "linear-gradient(115deg, transparent 24%, rgba(255,226,150,0.6) 28%, transparent 36%)",
    "linear-gradient(115deg, transparent 44%, rgba(255,226,150,0.9) 47%, transparent 52%)",
    "linear-gradient(115deg, transparent 62%, rgba(255,226,150,0.55) 67%, transparent 76%)",
    "linear-gradient(115deg, transparent 82%, rgba(255,226,150,0.7) 85%, transparent 90%)",
  ].join(","),
  WebkitMaskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 70%, transparent 100%)",
  maskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 70%, transparent 100%)",
};

type Leaf = {
  x: number; y: number; size: number; vy: number; vx: number;
  amp: number; freq: number; phase: number;
  rot: number; rotSpeed: number;
  flip: number; flipSpeed: number;
  sprite: Sprite; alpha: number;
  resp: number; drag: number; lift: number;
  temp: boolean;
  depth: number;   // 0 = far, 1 = near
  swirl: number;   // random sign/strength of scroll turbulence
  kick: number;    // upward pop when stirred off the ground (decays)
  canLand: boolean;
  landY: number;   // how far above the bottom edge it comes to rest
  landed: boolean;
  settle: number;  // 1 -> 0 after touchdown, so it slides to a stop instead of freezing
  stir: number;    // wind energy needed to lift it off the ground again
};

type Gust = { start: number; dur: number; strength: number; dir: 1 | -1 };

type Props = {
  /** Stacking order of the overlay. Raise/lower it relative to your modals, toasts and header. */
  zIndex?: number;
};

export default function FallingLeaves({ zIndex = DEFAULT_Z_INDEX }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);

  // Start as "reduced" so nothing (not even the sun shafts) renders on the server or on the
  // first client paint. The real preference is read in the effect below and then tracked live.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const canvas = ref.current;
    if (!canvas) return;
    const raysEl = raysRef.current;
    const ctx = canvas.getContext("2d")!;
    const MIN_FRAME = 1000 / MAX_FPS - 2;

    let cancelled = false;
    let started = false;
    let idleHandle = 0;
    let resizeTimer = 0;

    const sprites = {} as Record<LeafType, Sprite[]>;
    let w = 0, h = 0, dpr = 1, raf = 0, last = performance.now(), running = true;
    let leaves: Leaf[] = [];
    let gust: Gust | null = null;
    let nextGust = performance.now() + 6000 + Math.random() * 3000;

    let calm = 1; // 1 = calm (light visible), 0 = windy / scrolling fast (light dims)
    let shaftShown = SHAFT_ALPHA;
    let landedCount = 0;

    // scroll tracking
    let lastScrollY = window.scrollY;
    let scrollAcc = 0;
    let scrollV = 0;

    const spawn = (initial: boolean, fromSide?: 1 | -1): Leaf => {
      const depth = Math.random();
      const type = TYPE_POOL[Math.floor(Math.random() * TYPE_POOL.length)];
      const list = sprites[type];
      const leaf: Leaf = {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -40,
        size: (12 + depth * 24) * TYPE_SCALE[type],
        vy: 0.35 + depth * 0.8,
        vx: 0,
        amp: 15 + Math.random() * 35,
        freq: 0.0006 + Math.random() * 0.0008,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.01 + Math.random() * 0.03,
        sprite: list[Math.floor(Math.random() * list.length)],
        alpha: 0.5 + depth * 0.45,
        resp: 0.5 + Math.random() * 0.8,
        drag: 0.015 + Math.random() * 0.03,
        lift: Math.random() * 0.9,
        temp: false,
        depth,
        swirl: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.5),
        kick: 0,
        canLand: depth > 0.3 && Math.random() < 0.35,
        landY: 2 + Math.random() * 16,
        landed: false,
        settle: 0,
        stir: 0,
      };
      if (fromSide) {
        leaf.temp = true;
        leaf.canLand = false;
        leaf.x = fromSide > 0 ? -20 - Math.random() * 300 : w + 20 + Math.random() * 300;
        leaf.y = Math.random() * h * 0.7;
        leaf.vx = fromSide * 2;
      }
      return leaf;
    };

    const baseCount = () => (w < 640 ? 24 : 46);
    const extraCount = () => (w < 640 ? 9 : 18);
    const maxLanded = () => (w < 640 ? 7 : 14);

    // Sizes the canvas. Leaves are only respawned when the width changes, so the mobile
    // URL bar showing/hiding (height-only resize) doesn't reset the whole scene.
    // Does nothing until the sprites exist (a resize can arrive before init has run).
    const applySize = () => {
      if (!started || cancelled) return;
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      const widthChanged = nw !== w;
      w = nw;
      h = nh;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // fixed CSS size: if the viewport changes before the next applySize, the canvas is
      // cropped/padded instead of stretched
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (widthChanged || leaves.length === 0) {
        landedCount = 0;
        leaves = Array.from({ length: baseCount() }, () => spawn(true));
      } else {
        for (const l of leaves) if (l.landed) l.y = h - l.landY;
      }
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applySize, RESIZE_DEBOUNCE);
    };

    const startGust = (t: number) => {
      gust = {
        start: t,
        dur: 4500 + Math.random() * 2500,
        strength: 0.8 + Math.random() * 1.0,
        dir: Math.random() < 0.7 ? 1 : -1,
      };
      for (let i = 0; i < extraCount(); i++) leaves.push(spawn(false, gust.dir));
    };

    // draws one leaf (in CSS px, scaled by dpr), then a light/dark overlay depending on its angle
    const drawLeaf = (l: Leaf, sx: number, y: number, c: number) => {
      const sc = Math.max(0.12, c);
      const a = l.alpha * (0.7 + 0.3 * c);
      const s = l.size;
      const cr = Math.cos(l.rot);
      const sr = Math.sin(l.rot);

      // one setTransform instead of save/translate/rotate/scale/restore
      ctx.setTransform(cr * sc * dpr, sr * sc * dpr, -sr * dpr, cr * dpr, sx * dpr, y * dpr);
      ctx.globalAlpha = a;
      ctx.drawImage(l.sprite.img, -s / 2, -s / 2, s, s);

      // lit from one side: glows warm when facing the light, darkens when turned away
      const facing = Math.cos(l.flip) >= 0 ? 1 : -1;
      const lit = Math.cos(l.rot - LIGHT_ANGLE) * facing;
      if (lit > 0.05) {
        ctx.globalAlpha = a * lit * 0.22;
        ctx.drawImage(l.sprite.glow, -s / 2, -s / 2, s, s);
      } else if (lit < -0.05) {
        ctx.globalAlpha = a * -lit * 0.32;
        ctx.drawImage(l.sprite.dark, -s / 2, -s / 2, s, s);
      }
    };

    const step = (t: number) => {
      // frame cap
      if (t - last < MIN_FRAME) return;
      const dt = Math.min(t - last, 50) / 16.67;
      last = t;

      // ---- scroll-driven wind ----
      const sd = Math.max(-200, Math.min(200, scrollAcc)) / Math.max(dt, 0.1); // px per frame
      scrollAcc = 0;
      scrollV += (sd - scrollV) * Math.min(1, 0.12 * dt);
      const sv = Math.max(-60, Math.min(60, scrollV));
      const turb = Math.min(1.5, Math.abs(scrollV) * SCROLL_WIND);

      // ---- gusts ----
      if (!gust && t >= nextGust) startGust(t);

      let env = 0;
      let dir = 1;
      if (gust) {
        const u = (t - gust.start) / gust.dur;
        if (u >= 1) {
          gust = null;
          nextGust = t + 12000 + Math.random() * 12000;
        } else {
          const s = Math.sin(Math.PI * u);
          env = s * s * gust.strength;
          dir = gust.dir;
        }
      }

      const e = env + turb * 0.7; // total "wind energy" from gusts + scrolling
      const breeze = Math.sin(t * 0.0003) * 0.25 + 0.15;
      const windTarget = breeze + env * dir * 2.6 + turb * 1.2;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ---- sun shafts (CSS layer): visible in calm moments, dim when windy ----
      if (raysEl) {
        const calmTarget = Math.max(0, 1 - e * 1.4);
        calm += (calmTarget - calm) * Math.min(1, 0.03 * dt);
        const flick =
          (0.8 + 0.2 * Math.sin(t * 0.0011) * Math.sin(t * 0.0029 + 1.3)) *
          (0.85 + 0.15 * Math.sin(t * 0.0004));
        const target = SHAFT_ALPHA * calm * flick;
        if (Math.abs(target - shaftShown) > 0.004) {
          shaftShown = target;
          raysEl.style.opacity = target.toFixed(3);
        }
      }

      // ---- leaves ----
      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];

        // resting on the ground
        if (l.landed) {
          l.settle *= Math.pow(0.9, dt);
          l.x += l.vx * l.settle * dt;
          l.rot += l.rotSpeed * l.settle * dt;
          l.flip += l.flipSpeed * l.settle * dt;

          if (e > l.stir) {
            // stirred up by the wind: pop off the ground and rejoin the air
            l.landed = false;
            landedCount--;
            l.x -= Math.sin(l.phase) * l.amp * (1 + e * 0.5); // keep position continuous
            l.kick = -(1.5 + Math.random() * 2.5) * (0.6 + e);
            l.vx += dir * (0.5 + Math.random()) * (1 + e);
            l.rotSpeed = (Math.random() - 0.5) * 0.05;
            l.canLand = Math.random() < 0.5;
            l.landY = 2 + Math.random() * 16;
            // falls through to the normal update below
          } else {
            // a light gust still nudges and rustles the ones that stay
            if (e > l.stir * 0.5) {
              l.x += dir * e * 0.5 * dt;
              l.rot += dir * e * 0.015 * dt;
            }
            const c = Math.max(0.5, Math.abs(Math.cos(l.flip)));
            drawLeaf(l, l.x, h - l.landY, c);
            continue;
          }
        }

        // airborne
        l.vx += (windTarget * l.resp - l.vx) * l.drag * dt;
        l.vx += l.swirl * turb * 0.12 * dt; // scrolling makes leaves flutter unpredictably
        l.x += l.vx * dt;
        l.kick *= Math.pow(0.96, dt);

        const dy = l.vy - env * l.lift + l.kick;
        // scrolling down pushes leaves up past the viewport; near leaves move more (parallax)
        l.y += dy * dt - sv * (0.1 + 0.3 * l.depth) * dt;

        l.phase += l.freq * 16.67 * dt * (1 + e * 1.2);
        l.rot += (l.rotSpeed * (1 + e * 3) + env * dir * 0.02) * dt;
        l.flip += l.flipSpeed * dt * (1 + e * 2.5);

        const sx = l.x + Math.sin(l.phase) * l.amp * (1 + e * 0.5);

        // touch down (only in calm air, only while moving downward)
        if (
          l.canLand && !l.temp && dy > 0 && e < 0.25 &&
          landedCount < maxLanded() &&
          l.y >= h - l.landY && sx > 10 && sx < w - 10
        ) {
          l.landed = true;
          landedCount++;
          l.x = sx;
          l.y = h - l.landY;
          l.settle = 1;
          l.kick = 0;
          l.stir = 0.12 + Math.random() * 0.9; // some leave on the next gust, some wait
          drawLeaf(l, l.x, l.y, Math.max(0.5, Math.abs(Math.cos(l.flip))));
          continue;
        }

        // off-screen handling. Gust leaves (temp) are spawned up to ~320px outside the
        // viewport on either side, so they get a wide horizontal margin on both sides
        // and are discarded once they leave it. Regular leaves are recycled at the top.
        const offY = l.y > h + 40 || l.y < -160;
        if (l.temp) {
          if (offY || sx > w + 400 || sx < -400) {
            leaves.splice(i, 1);
            continue;
          }
        } else if (offY || sx > w + 100 || sx < -100) {
          leaves[i] = spawn(false);
          continue;
        }

        drawLeaf(l, sx, l.y, Math.abs(Math.cos(l.flip)));
      }
    };

    const frame = (t: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      try {
        step(t);
      } catch (err) {
        // stop instead of throwing on every frame
        running = false;
        cancelAnimationFrame(raf);
        console.error("FallingLeaves stopped:", err);
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      scrollAcc += y - lastScrollY;
      lastScrollY = y;
    };

    const onVisibility = () => {
      if (!started) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        lastScrollY = window.scrollY;
        scrollAcc = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    // build sprites when the browser is idle so first paint isn't blocked
    const init = () => {
      if (cancelled) return;
      (Object.keys(PALETTES) as LeafType[]).forEach((type) => {
        sprites[type] = [];
        const pal = PALETTES[type];
        for (let i = 0; i < VARIANTS_PER_TYPE; i++) {
          sprites[type].push(buildSprite(type, pal[i % pal.length]));
        }
      });
      started = true;
      applySize();
      last = performance.now();
      if (!document.hidden) raf = requestAnimationFrame(frame);
      else running = false;
    };

    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, o?: { timeout: number }) => number)
      | undefined;
    if (ric) idleHandle = ric(init, { timeout: 600 });
    else idleHandle = window.setTimeout(init, 80);

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      const cic = (window as any).cancelIdleCallback as ((h: number) => void) | undefined;
      if (ric && cic) cic(idleHandle);
      else clearTimeout(idleHandle);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  // reduced motion: render nothing at all (no canvas, no sun shafts)
  if (reduced) return null;

  return (
    <>
      <div
        ref={raysRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ ...RAYS_STYLE, zIndex }}
      />
      <canvas
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0"
        style={{ zIndex }}
      />
    </>
  );
}