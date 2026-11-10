"use client";

import { useEffect, useRef } from "react";

type Pair = [string, string];
type LeafType = "maple" | "oak" | "birch" | "aspen" | "ginkgo";

const PALETTES: Record<LeafType, Pair[]> = {
  maple: [["#e5532d", "#9b1c12"], ["#f0892f", "#b2410f"], ["#d03a2a", "#7a1410"]],
  oak: [["#b9732f", "#6b3a14"], ["#a8562a", "#5e2a10"], ["#c28a3a", "#7a4f1a"]],
  birch: [["#f2d04a", "#c9962a"], ["#e9bd3c", "#b57f1c"]],
  aspen: [["#f5c93a", "#d49a1e"], ["#eeb92f", "#c0801a"]],
  ginkgo: [["#f7dc5a", "#d9a824"], ["#f2d048", "#cf9a1c"]],
};

// how often each type shows up (more maple/oak = classic autumn look)
const TYPE_POOL: LeafType[] = ["maple", "maple", "oak", "oak", "birch", "aspen", "ginkgo"];

// relative on-screen size per type
const TYPE_SCALE: Record<LeafType, number> = {
  maple: 1.1, oak: 1.1, birch: 0.8, aspen: 0.85, ginkgo: 0.85,
};

// width profile for the "profile-based" leaves (oak / birch / aspen)
const PROFILES: Record<string, { w: number; p: number; q: number; mod: (t: number) => number }> = {
  oak: { w: 23, p: 0.75, q: 0.8, mod: (t) => 1 + 0.3 * Math.cos(t * Math.PI * 6) },
  birch: { w: 19, p: 1.35, q: 0.75, mod: (t) => 1 - 0.09 * Math.abs(Math.sin(t * Math.PI * 10)) },
  aspen: { w: 25, p: 1.1, q: 0.55, mod: () => 1 },
};

const MAPLE_HALF: [number, number][] = [
  [36, 15], [44, 11], [42, 23], [59, 20], [50, 33], [57, 43], [41, 42], [34, 50], [32, 58],
];

function makeSprite(type: LeafType, [light, dark]: Pair) {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.lineJoin = "round";
  g.lineCap = "round";

  const curve = (Math.random() - 0.5) * 6; // gentle natural bend
  const cx = (t: number) => 32 + curve * Math.sin(Math.PI * t);
  const veins: [number, number, number, number][] = [];

  g.beginPath();
  if (type === "maple") {
    g.moveTo(32, 3);
    MAPLE_HALF.forEach(([x, y]) => g.lineTo(x, y));
    for (let i = MAPLE_HALF.length - 1; i >= 0; i--) g.lineTo(64 - MAPLE_HALF[i][0], MAPLE_HALF[i][1]);
    [[32, 5], [44, 13], [57, 21], [55, 41], [9, 21], [20, 13], [8, 41]].forEach(([x, y]) =>
      veins.push([32, 54, x, y])
    );
  } else if (type === "ginkgo") {
    g.moveTo(32, 58);
    g.bezierCurveTo(16, 46, 2, 32, 6, 14);
    g.quadraticCurveTo(19, 4, 32, 16);
    g.quadraticCurveTo(45, 4, 58, 14);
    g.bezierCurveTo(62, 32, 48, 46, 32, 58);
    [[10, 18], [17, 11], [25, 11], [32, 16], [39, 11], [47, 11], [54, 18]].forEach(([x, y]) =>
      veins.push([32, 56, x, y])
    );
  } else {
    const { w, p, q, mod } = PROFILES[type];
    const N = 36, y0 = 4, y1 = 56;
    const half = (t: number) =>
      w * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(t, p))), q) * mod(t);
    g.moveTo(cx(0), y0);
    for (let i = 1; i <= N; i++) { const t = i / N; g.lineTo(cx(t) + half(t), y0 + t * (y1 - y0)); }
    for (let i = N; i >= 0; i--) { const t = i / N; g.lineTo(cx(t) - half(t), y0 + t * (y1 - y0)); }
    veins.push([cx(0), y0, cx(1), y1]);
    for (let i = 1; i <= 5; i++) {
      const t = 0.12 + i * 0.15;
      const tt = Math.max(0, t - 0.1);
      const y = y0 + t * (y1 - y0);
      const x = cx(t);
      const hw = half(tt) * 0.8;
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
  g.strokeStyle = "rgba(0,0,0,0.18)";
  g.lineWidth = 1;
  g.stroke();

  // veins
  g.strokeStyle = "rgba(0,0,0,0.24)";
  g.lineWidth = 1;
  g.beginPath();
  veins.forEach(([x1, y1, x2, y2]) => { g.moveTo(x1, y1); g.lineTo(x2, y2); });
  g.stroke();

  // stem
  g.strokeStyle = dark;
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(32, type === "maple" ? 57 : 55);
  g.lineTo(32 + curve * 0.4, 63);
  g.stroke();

  return c;
}

type Leaf = {
  x: number; y: number; size: number; vy: number; vx: number;
  amp: number; freq: number; phase: number;
  rot: number; rotSpeed: number;
  flip: number; flipSpeed: number;
  sprite: HTMLCanvasElement; alpha: number;
  resp: number; drag: number; lift: number;
  temp: boolean;
};

type Gust = { start: number; dur: number; strength: number; dir: 1 | -1 };

export default function FallingLeaves() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const sprites: Record<LeafType, HTMLCanvasElement[]> = {
      maple: [], oak: [], birch: [], aspen: [], ginkgo: [],
    };
    (Object.keys(PALETTES) as LeafType[]).forEach((type) =>
      PALETTES[type].forEach((pair) => sprites[type].push(makeSprite(type, pair)))
    );

    let w = 0, h = 0, raf = 0, last = performance.now(), running = true;
    let leaves: Leaf[] = [];
    let gust: Gust | null = null;
    let nextGust = performance.now() + 7000 + Math.random() * 3000; // first gust after ~7-10s

    const spawn = (initial: boolean, fromSide?: 1 | -1): Leaf => {
      const depth = Math.random(); // 0 = far, 1 = near
      const type = TYPE_POOL[Math.floor(Math.random() * TYPE_POOL.length)];
      const list = sprites[type];
      const leaf: Leaf = {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -40,
        size: (12 + depth * 22) * TYPE_SCALE[type],
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
        resp: 0.5 + Math.random() * 0.8,        // how strongly wind pushes this leaf
        drag: 0.015 + Math.random() * 0.03,     // how slowly it catches the wind
        lift: Math.random() * 0.9,              // how much a gust can lift it
        temp: false,
      };
      if (fromSide) {
        leaf.temp = true;
        leaf.x = fromSide > 0 ? -20 - Math.random() * 300 : w + 20 + Math.random() * 300;
        leaf.y = Math.random() * h * 0.7;
        leaf.vx = fromSide * 2;
      }
      return leaf;
    };

    const baseCount = () => (w < 640 ? 10 : 18);
    const extraCount = () => (w < 640 ? 4 : 8);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      leaves = Array.from({ length: baseCount() }, () => spawn(true));
    };

    const startGust = (t: number) => {
      gust = {
        start: t,
        dur: 4500 + Math.random() * 2500,
        strength: 0.8 + Math.random() * 1.0,
        dir: Math.random() < 0.7 ? 1 : -1,
      };
      // bring in extra leaves blown in from the windward edge
      for (let i = 0; i < extraCount(); i++) leaves.push(spawn(false, gust.dir));
    };

    const frame = (t: number) => {
      if (!running) return;
      const dt = Math.min(t - last, 50) / 16.67;
      last = t;

      if (!gust && t >= nextGust) startGust(t);

      let env = 0;
      let dir = 1;
      if (gust) {
        const u = (t - gust.start) / gust.dur;
        if (u >= 1) {
          gust = null;
          nextGust = t + 14000 + Math.random() * 14000; // next gust in ~14-28s
        } else {
          const s = Math.sin(Math.PI * u);
          env = s * s * gust.strength;
          dir = gust.dir;
        }
      }
      const breeze = Math.sin(t * 0.0003) * 0.25 + 0.15;
      const windTarget = breeze + env * dir * 2.6;

      ctx.clearRect(0, 0, w, h);

      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        l.vx += (windTarget * l.resp - l.vx) * l.drag * dt;
        l.x += l.vx * dt;
        l.y += (l.vy - env * l.lift) * dt;
        l.phase += l.freq * 16.67 * dt * (1 + env * 1.2);
        l.rot += (l.rotSpeed * (1 + env * 3) + env * dir * 0.02) * dt;
        l.flip += l.flipSpeed * dt * (1 + env * 2.5);

        const sx = l.x + Math.sin(l.phase) * l.amp * (1 + env * 0.5);

        if (l.y > h + 40 || l.y < -160 || sx > w + 100 || sx < -400) {
          if (l.temp) { leaves.splice(i, 1); continue; }
          if (l.y > h + 40 || l.y < -160 || sx > w + 100 || sx < -100) {
            leaves[i] = spawn(false);
            continue;
          }
        }

        const c = Math.abs(Math.cos(l.flip));
        ctx.save();
        ctx.globalAlpha = l.alpha * (0.7 + 0.3 * c);
        ctx.translate(sx, l.y);
        ctx.rotate(l.rot);
        ctx.scale(Math.max(0.12, c), 1); // tumbling in 3D
        ctx.drawImage(l.sprite, -l.size / 2, -l.size / 2, l.size, l.size);
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}