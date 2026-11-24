"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type FlakeKind = "dot" | "crystal";

/**
 * Winter theme:
 *  - dot:     soft round snowflakes (the bulk of the snowfall, great for depth)
 *  - crystal: six-armed ice crystals that slowly tumble
 * Plus a cold, pale-blue glow at the top of the screen that dims when the wind picks up.
 */
const KIND_POOL: FlakeKind[] = [
  "dot", "dot", "dot", "dot", "dot",
  "crystal", "crystal", "crystal", "crystal",
];

// --- tuning knobs ---
const DOT_SPRITE_SIZE = 48;
const CRYSTAL_SPRITE_SIZE = 96;
const MAX_DPR = 2;             // cap the canvas resolution so 3x phones don't pay for it
const DOT_VARIANTS = 3;
const CRYSTAL_VARIANTS = 6;
const MAX_FPS = 30;            // motion is slow, 30fps is hard to tell apart and halves the work
const GLOW_ALPHA = 0.12;       // max strength of the frosty light (keep it subtle)
const SCROLL_WIND = 0.035;     // how much scroll speed turns into wind
const RESIZE_DEBOUNCE = 150;   // ms
const DEFAULT_Z_INDEX = 2147483647; // above everything (cart slider, modals, toasts)
const PX_PER_FLAKE = 24;       // one flake per this many px of screen width, so wide screens stay full
const MIN_FLAKES = 40;
const MAX_FLAKES = 130;
const SIDE_MARGIN = 0.12;      // flakes spawn this far (share of width) beyond each edge

type Sprite = HTMLCanvasElement;

// soft round flake with an icy-blue falloff so it stays visible on light backgrounds too
function makeDotSprite(hardness: number): Sprite {
  const S = DOT_SPRITE_SIZE;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const r = S / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25 + hardness * 0.25, "rgba(246,251,255,0.95)");
  grad.addColorStop(0.7, "rgba(190,220,250,0.5)");
  grad.addColorStop(1, "rgba(165,205,245,0)");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(r, r, r, 0, Math.PI * 2);
  g.fill();
  return c;
}

// six-armed ice crystal; branches are mirrored on all arms so it looks like a real snowflake
function makeCrystalSprite(): Sprite {
  const S = CRYSTAL_SPRITE_SIZE;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.scale(S / 64, S / 64);
  g.translate(32, 32);
  g.lineCap = "round";
  g.lineJoin = "round";

  const R = 24 + Math.random() * 5;
  const branchCount = 2 + Math.floor(Math.random() * 2); // 2 or 3 pairs of branches
  const branches = Array.from({ length: branchCount }, (_, i) => ({
    d: R * (0.38 + (i / branchCount) * 0.5 + Math.random() * 0.05),
    len: R * (0.22 + Math.random() * 0.16) * (1 - i * 0.12),
    ang: Math.PI / 3 + (Math.random() - 0.5) * 0.25,
  }));
  const tipFork = Math.random() < 0.5;

  const drawArms = () => {
    for (let a = 0; a < 6; a++) {
      g.save();
      g.rotate((a * Math.PI) / 3);
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(0, -R);
      branches.forEach(({ d, len, ang }) => {
        [-1, 1].forEach((s) => {
          g.moveTo(0, -d);
          g.lineTo(s * Math.sin(ang) * len, -d - Math.cos(ang) * len);
        });
      });
      if (tipFork) {
        [-1, 1].forEach((s) => {
          g.moveTo(0, -R);
          g.lineTo(s * 3.2, -R - 3.6);
        });
      }
      g.stroke();
      g.restore();
    }
  };

  // soft icy glow underneath, then a crisp white core on top
  g.shadowColor = "rgba(120,180,240,0.9)";
  g.shadowBlur = 5;
  g.strokeStyle = "rgba(160,205,245,0.6)";
  g.lineWidth = 3.2;
  drawArms();

  g.shadowBlur = 0;
  g.strokeStyle = "#ffffff";
  g.lineWidth = 1.6;
  drawArms();

  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(0, 0, 2.4, 0, Math.PI * 2);
  g.fill();

  return c;
}

// Cold light + glow as pure CSS. Only the opacity changes, which the browser composites on the GPU.
const GLOW_STYLE: CSSProperties = {
  opacity: GLOW_ALPHA,
  willChange: "opacity",
  background: [
    "radial-gradient(ellipse 100% 70% at 50% -10%, rgba(200,228,255,0.7), rgba(200,228,255,0) 70%)",
    "linear-gradient(105deg, transparent 8%, rgba(210,235,255,0.55) 12%, transparent 17%)",
    "linear-gradient(105deg, transparent 30%, rgba(210,235,255,0.45) 34%, transparent 42%)",
    "linear-gradient(105deg, transparent 54%, rgba(210,235,255,0.6) 57%, transparent 62%)",
    "linear-gradient(105deg, transparent 74%, rgba(210,235,255,0.4) 78%, transparent 86%)",
  ].join(","),
  WebkitMaskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 65%, transparent 100%)",
  maskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 65%, transparent 100%)",
};

/**
 * Flakes live in screen coordinates. They always enter from above the top edge, drift down
 * across the whole width, leave below the bottom edge (or off a side) and are immediately
 * re-spawned at the top, so the snowfall never stops and never bunches up in one place.
 */
type Flake = {
  x: number; y: number; size: number; vy: number; vx: number;
  amp: number; freq: number; phase: number;
  rot: number; rotSpeed: number;
  flip: number; flipSpeed: number;
  kind: FlakeKind;
  sprite: Sprite; alpha: number;
  resp: number; drag: number; lift: number;
  temp: boolean;
  depth: number;   // 0 = far, 1 = near
  swirl: number;   // random sign/strength of scroll turbulence
};

type Gust = { start: number; dur: number; strength: number; dir: 1 | -1 };

type Props = {
  /** Stacking order of the overlay. Defaults to the maximum so it draws above everything. */
  zIndex?: number;
};

export default function FallingSnow({ zIndex = DEFAULT_Z_INDEX }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Start as "reduced" so nothing (not even the glow) renders on the server or on the
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
    const glowEl = glowRef.current;
    const ctx = canvas.getContext("2d")!;
    const MIN_FRAME = 1000 / MAX_FPS - 2;

    let cancelled = false;
    let started = false;
    let idleHandle = 0;
    let resizeTimer = 0;

    const sprites = { dot: [], crystal: [] } as Record<FlakeKind, Sprite[]>;
    let w = 0, h = 0, dpr = 1, raf = 0, last = performance.now(), running = true;
    let flakes: Flake[] = [];
    let gust: Gust | null = null;
    let nextGust = performance.now() + 6000 + Math.random() * 3000;

    let calm = 1; // 1 = calm (glow visible), 0 = windy / scrolling fast (glow dims)
    let glowShown = GLOW_ALPHA;

    // scroll tracking
    let lastScrollY = window.scrollY;
    let scrollAcc = 0;
    let scrollV = 0;

    // flake count follows the screen width, so wide screens are as full as phones
    const baseCount = () =>
      Math.max(MIN_FLAKES, Math.min(MAX_FLAKES, Math.round(w / PX_PER_FLAKE)));
    const extraCount = () => (w < 640 ? 14 : 28);

    // Regular flakes spawn across the full width (plus a margin past both edges, so sideways
    // drift keeps the edges as busy as the middle) and always enter from above the top edge,
    // at staggered heights so they don't arrive in rows. `initial` spreads them over the screen.
    const spawn = (initial: boolean, fromSide?: 1 | -1): Flake => {
      const depth = Math.random();
      const kind = KIND_POOL[Math.floor(Math.random() * KIND_POOL.length)];
      const list = sprites[kind];
      const size = kind === "dot" ? 6 + depth * 12 : 11 + depth * 19;
      const flake: Flake = {
        x: -w * SIDE_MARGIN + Math.random() * w * (1 + SIDE_MARGIN * 2),
        y: initial ? Math.random() * h : -size - Math.random() * h * 0.5,
        size,
        vy: 0.25 + depth * 0.75,
        vx: 0,
        amp: 10 + Math.random() * 28,
        freq: 0.0005 + Math.random() * 0.0007,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: kind === "crystal" ? (Math.random() - 0.5) * 0.02 : 0,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.008 + Math.random() * 0.02,
        kind,
        sprite: list[Math.floor(Math.random() * list.length)],
        alpha: 0.45 + depth * 0.5,
        resp: 0.5 + Math.random() * 0.8,
        drag: 0.015 + Math.random() * 0.03,
        lift: Math.random() * 0.9,
        temp: false,
        depth,
        swirl: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.5),
      };
      if (fromSide) {
        flake.temp = true;
        flake.x = fromSide > 0 ? -20 - Math.random() * 300 : w + 20 + Math.random() * 300;
        flake.y = Math.random() * h * 0.7;
        flake.vx = fromSide * 2;
      }
      return flake;
    };

    // Sizes the canvas. Flakes are only respawned when the width changes, so the mobile
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
      if (widthChanged || flakes.length === 0) {
        flakes = Array.from({ length: baseCount() }, () => spawn(true));
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
        dir: Math.random() < 0.5 ? 1 : -1,
      };
      for (let i = 0; i < extraCount(); i++) flakes.push(spawn(false, gust.dir));
    };

    // draws one flake (in CSS px, scaled by dpr). Crystals tilt like they're tumbling in 3D.
    const drawFlake = (f: Flake, sx: number, y: number, tw: number) => {
      const sc = f.kind === "crystal" ? 0.55 + 0.45 * Math.abs(Math.cos(f.flip)) : 1;
      const a = f.alpha * tw;
      const s = f.size;
      const cr = Math.cos(f.rot);
      const sr = Math.sin(f.rot);

      // one setTransform instead of save/translate/rotate/scale/restore
      ctx.setTransform(cr * sc * dpr, sr * sc * dpr, -sr * dpr, cr * dpr, sx * dpr, y * dpr);
      ctx.globalAlpha = a;
      ctx.drawImage(f.sprite, -s / 2, -s / 2, s, s);
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
      // calm breeze averages to zero so flakes don't all drift to one side
      const breeze = Math.sin(t * 0.0003) * 0.25;
      const windTarget = breeze + env * dir * 2.6 + turb * 1.2;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ---- frosty glow (CSS layer): visible in calm moments, dims when windy ----
      if (glowEl) {
        const calmTarget = Math.max(0, 1 - e * 1.4);
        calm += (calmTarget - calm) * Math.min(1, 0.03 * dt);
        const flick =
          (0.8 + 0.2 * Math.sin(t * 0.0011) * Math.sin(t * 0.0029 + 1.3)) *
          (0.85 + 0.15 * Math.sin(t * 0.0004));
        const target = GLOW_ALPHA * calm * flick;
        if (Math.abs(target - glowShown) > 0.004) {
          glowShown = target;
          glowEl.style.opacity = target.toFixed(3);
        }
      }

      // ---- flakes ----
      for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i];

        f.vx += (windTarget * f.resp - f.vx) * f.drag * dt;
        f.vx += f.swirl * turb * 0.12 * dt; // scrolling makes flakes flutter unpredictably
        f.x += f.vx * dt;

        // gusts can slow the fall a little but never stop or reverse it
        const dy = Math.max(0.12, f.vy - env * f.lift * 0.4);
        // scrolling down pushes flakes up past the viewport; near flakes move more (parallax)
        f.y += dy * dt - sv * (0.1 + 0.3 * f.depth) * dt;

        f.phase += f.freq * 16.67 * dt * (1 + e * 1.2);
        f.rot += (f.rotSpeed * (1 + e * 3) + (f.kind === "crystal" ? env * dir * 0.01 : 0)) * dt;
        f.flip += f.flipSpeed * dt * (1 + e * 2);

        const sx = f.x + Math.sin(f.phase) * f.amp * (1 + e * 0.5);

        // Off-screen handling. Gust flakes (temp) are spawned up to ~320px outside the
        // viewport on either side, so they get a wide horizontal margin and are discarded
        // once they leave it. Regular flakes go back to above the top edge, so the snowfall
        // never stops.
        const offY = f.y > h + f.size || f.y < -h * 0.6 - 160;
        if (f.temp) {
          if (offY || sx > w + 400 || sx < -400) {
            flakes.splice(i, 1);
            continue;
          }
        } else if (offY || sx > w * (1 + SIDE_MARGIN) + 60 || sx < -w * SIDE_MARGIN - 60) {
          flakes[i] = spawn(false);
          continue;
        }

        // crystals shimmer a little as they turn
        const tw = f.kind === "crystal" ? 0.8 + 0.2 * Math.sin(f.flip * 1.7) : 1;
        drawFlake(f, sx, f.y, tw);
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
        console.error("FallingSnow stopped:", err);
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
      for (let i = 0; i < DOT_VARIANTS; i++) {
        sprites.dot.push(makeDotSprite(i / Math.max(1, DOT_VARIANTS - 1)));
      }
      for (let i = 0; i < CRYSTAL_VARIANTS; i++) {
        sprites.crystal.push(makeCrystalSprite());
      }
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

  // reduced motion: render nothing at all (no canvas, no glow)
  if (reduced) return null;

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ ...GLOW_STYLE, zIndex }}
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