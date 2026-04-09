'use client';

import React, { useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════
 *  PLANET-INSPIRED AMBIENT BACKGROUNDS  (v2 — refined aesthetics)
 *
 *  jupiter  → Warm nebula clouds, swirling vortex glow
 *  neptune  → Deep blue/cyan aurora ribbons + ocean glow
 *  saturn   → Golden concentric ring orbits + dust
 *  mars     → Red dust storm vortexes + rising embers
 *  venus    → Acid-green atmospheric haze + volcanic lightning
 *  mercury  → Silver gleams, solar flare arcs, heat shimmer
 * ═══════════════════════════════════════════════════════════════════ */

/* ─── Noise Helpers ─────────────────────────────────────────────── */
function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return (h ^ (h >> 16)) / 2147483648;
}
function smoothstep(t: number) { return t * t * (3 - 2 * t); }
function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = smoothstep(x - ix), fy = smoothstep(y - iy);
  const a = hash(ix, iy), b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}
function fbm(x: number, y: number, oct = 4): number {
  let v = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { v += a * valueNoise(x * f, y * f); a *= 0.5; f *= 2.1; }
  return v;
}

/* ─── Types ─────────────────────────────────────────────────────── */
interface Particle {
  x: number; y: number; baseX: number; baseY: number;
  vx: number; vy: number; size: number; alpha: number;
  hue: number; speed: number; angle: number;
  orbitRadius: number; orbitSpeed: number; phase: number; life: number;
}

export type PlanetTheme = 'jupiter' | 'neptune' | 'saturn' | 'mars' | 'venus' | 'mercury';

interface AmbientBackgroundProps {
  planet: PlanetTheme;
  intensity?: number;
}

const PLANET = {
  jupiter: { hue: 25, hue2: 15, sat: 75 },
  neptune: { hue: 210, hue2: 190, sat: 80 },
  saturn:  { hue: 42, hue2: 50, sat: 70 },
  mars:    { hue: 10, hue2: 20, sat: 65 },
  venus:   { hue: 75, hue2: 55, sat: 60 },
  mercury: { hue: 220, hue2: 240, sat: 10 },
};

export default function AmbientBackground({ planet, intensity = 0.7 }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const animRef = useRef(0);
  const dprRef = useRef(1);
  const P = PLANET[planet];

  const createParticles = useCallback((w: number, h: number) => {
    const count = planet === 'saturn' ? 100 : planet === 'mars' ? 90 : 65;
    const ps: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      ps.push({
        x, y, baseX: x, baseY: y, vx: 0, vy: 0,
        size: 0.5 + Math.random() * 2.5,
        alpha: 0.08 + Math.random() * 0.35,
        hue: P.hue + (Math.random() - 0.5) * 50,
        speed: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: 15 + Math.random() * 70,
        orbitSpeed: 0.001 + Math.random() * 0.004,
        phase: Math.random() * Math.PI * 2,
        life: Math.random(),
      });
    }
    return ps;
  }, [planet, P.hue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    const resize = () => {
      const r = canvas.parentElement?.getBoundingClientRect();
      if (!r) return;
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`; canvas.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(r.width, r.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      const p = canvas.parentElement;
      if (!p) return;
      const r = p.getBoundingClientRect();
      mouseRef.current.tx = e.clientX - r.left;
      mouseRef.current.ty = e.clientY - r.top;
    };
    const onLeave = () => { mouseRef.current.tx = -1000; mouseRef.current.ty = -1000; };
    window.addEventListener('mousemove', onMouse);
    document.addEventListener('mouseleave', onLeave);

    const draw = () => {
      const w = canvas.width / dpr, h = canvas.height / dpr, t = timeRef.current;
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.07; m.y += (m.ty - m.y) * 0.07;
      ctx.clearRect(0, 0, w, h);

      switch (planet) {
        case 'jupiter': drawJupiter(ctx, w, h, t, m, intensity, P); break;
        case 'neptune': drawNeptune(ctx, w, h, t, m, intensity, P); break;
        case 'saturn':  drawSaturn(ctx, w, h, t, m, intensity, P); break;
        case 'mars':    drawMars(ctx, w, h, t, m, intensity, P); break;
        case 'venus':   drawVenus(ctx, w, h, t, m, intensity, P); break;
        case 'mercury': drawMercury(ctx, w, h, t, m, intensity, P); break;
      }

      drawParticles(ctx, particlesRef.current, m, t, intensity, P);
      drawCursorAura(ctx, m, w, h, t, intensity, P);
      drawConnections(ctx, particlesRef.current, m, intensity, P);

      timeRef.current += 0.016;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [planet, intensity, P, createParticles]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <canvas ref={canvasRef} style={{ pointerEvents: 'none', position: 'absolute', inset: 0 }} />
      <div className="noise-overlay" />
    </div>
  );
}

/* ─── Mouse helper ──────────────────────────────────────────────── */
type Mouse = { x: number; y: number };
type PlanetCfg = typeof PLANET.jupiter;

/* ═══════════════════════════════════════════════════════════════════
 *  JUPITER — Warm nebula clouds + glowing vortex core
 *  No lines — only soft, organic radial blobs that breathe & drift
 * ═══════════════════════════════════════════════════════════════════ */
function drawJupiter(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: Mouse, int: number, P: PlanetCfg,
) {
  // ─── 1. Soft nebula cloud blobs ───
  // Multiple organic gradient blobs that drift with noise
  const blobs = [
    { cx: 0.25, cy: 0.35, r: 200, hOff: 0, speed: 0.08 },
    { cx: 0.65, cy: 0.55, r: 250, hOff: 15, speed: 0.06 },
    { cx: 0.45, cy: 0.25, r: 180, hOff: -10, speed: 0.1 },
    { cx: 0.8, cy: 0.3, r: 160, hOff: 25, speed: 0.07 },
    { cx: 0.15, cy: 0.7, r: 190, hOff: 5, speed: 0.09 },
    { cx: 0.55, cy: 0.75, r: 170, hOff: -5, speed: 0.05 },
    { cx: 0.35, cy: 0.5, r: 220, hOff: 10, speed: 0.04 },
  ];

  for (const blob of blobs) {
    const nx = fbm(blob.cx * 3 + t * blob.speed, blob.cy * 3 + t * blob.speed * 0.8, 3);
    const ny = fbm(blob.cx * 3 + t * blob.speed * 0.7 + 100, blob.cy * 3 + t * blob.speed + 100, 3);
    const bx = blob.cx * w + (nx - 0.5) * 120;
    const by = blob.cy * h + (ny - 0.5) * 90;

    // Mouse influence — blobs gently drift toward cursor
    const mdx = m.x - bx, mdy = m.y - by;
    const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
    const mI = Math.max(0, 1 - mDist / 350) * int;
    const fx = bx + mdx * mI * 0.08;
    const fy = by + mdy * mI * 0.08;

    const pulseR = blob.r + Math.sin(t * 0.5 + blob.hOff) * 30 + mI * 40;
    const hue = P.hue + blob.hOff + fbm(blob.cx + t * 0.05, blob.cy, 2) * 30;
    const alpha = (0.04 + fbm(blob.cx * 2 + t * 0.03, blob.cy * 2, 2) * 0.04 + mI * 0.04) * int;

    const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, pulseR);
    grad.addColorStop(0, `hsla(${hue}, ${P.sat}%, 55%, ${alpha * 1.5})`);
    grad.addColorStop(0.3, `hsla(${hue + 10}, ${P.sat - 10}%, 45%, ${alpha})`);
    grad.addColorStop(0.6, `hsla(${hue + 20}, ${P.sat - 20}%, 40%, ${alpha * 0.4})`);
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(fx, fy, pulseR, 0, Math.PI * 2);
    ctx.fill();
  }

  // ─── 2. Great Storm vortex — a softly glowing, spinning focal point ───
  const stormX = w * 0.6 + Math.sin(t * 0.12) * 30;
  const stormY = h * 0.42 + Math.cos(t * 0.1) * 20;
  const sDist = Math.sqrt((m.x - stormX) ** 2 + (m.y - stormY) ** 2);
  const sI = Math.max(0, 1 - sDist / 300) * int;

  // Multiple layered glow rings (no strokes — all fills)
  for (let ring = 0; ring < 4; ring++) {
    const r = 50 + ring * 35 + Math.sin(t * 0.4 + ring * 1.5) * 12 + sI * 20;
    const rotatedAngle = t * 0.15 * (ring % 2 === 0 ? 1 : -1);
    // Slightly offset center per ring for organic feel
    const rx = stormX + Math.cos(rotatedAngle + ring) * ring * 4;
    const ry = stormY + Math.sin(rotatedAngle + ring) * ring * 3;
    const hue = 15 + ring * 8;
    const alpha = (0.04 - ring * 0.006 + sI * 0.03) * int;

    const grad = ctx.createRadialGradient(rx, ry, r * 0.3, rx, ry, r);
    grad.addColorStop(0, `hsla(${hue}, 85%, 60%, ${alpha})`);
    grad.addColorStop(0.5, `hsla(${hue + 10}, 75%, 50%, ${alpha * 0.5})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Storm core — bright warm dot
  const coreR = 20 + Math.sin(t * 0.8) * 5 + sI * 12;
  const coreGrad = ctx.createRadialGradient(stormX, stormY, 0, stormX, stormY, coreR);
  coreGrad.addColorStop(0, `hsla(30, 90%, 70%, ${(0.1 + sI * 0.08) * int})`);
  coreGrad.addColorStop(0.5, `hsla(20, 85%, 55%, ${(0.05 + sI * 0.04) * int})`);
  coreGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(stormX, stormY, coreR, 0, Math.PI * 2);
  ctx.fill();
}

/* ═══════════════════════════════════════════════════════════════════
 *  NEPTUNE — Deep ocean aurora ribbons + glowing deep-sea patches
 * ═══════════════════════════════════════════════════════════════════ */
function drawNeptune(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: Mouse, int: number, P: PlanetCfg,
) {
  // ─── Smooth aurora ribbons (quadratic curves, not straight lines) ───
  const ribbons = 5;
  for (let r = 0; r < ribbons; r++) {
    const baseY = h * 0.12 + (r / ribbons) * h * 0.76;
    const pts: { x: number; y: number }[] = [];

    for (let x = -20; x <= w + 20; x += 12) {
      const progress = x / w;
      const n1 = fbm(progress * 2.5 + t * 0.1 + r * 8, r * 0.7 + t * 0.04, 4);
      const wave = Math.sin(progress * Math.PI * 2.5 + t * 0.25 + r * 1.8) * 0.5 + 0.5;
      const mdx = m.x - x, mdy = m.y - baseY;
      const mD = Math.sqrt(mdx * mdx + mdy * mdy);
      const attract = Math.max(0, 1 - mD / 220) * 40 * int;
      const y = baseY + (n1 - 0.5) * 50 * wave + Math.sin(progress * 5 + t * 0.4 + r) * 18
        + Math.sign(mdy) * attract;
      pts.push({ x, y });
    }

    // Draw smooth curve
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const cpx = (pts[i].x + pts[i + 1].x) / 2;
      const cpy = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, cpx, cpy);
    }

    const hue = P.hue + r * 18 + Math.sin(t * 0.2 + r) * 8;
    const ribbonAlpha = (0.045 + Math.sin(t * 0.4 + r * 2) * 0.015) * int;

    // Glow layer first
    ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${ribbonAlpha * 0.35})`;
    ctx.lineWidth = 14;
    ctx.filter = 'blur(8px)';
    ctx.stroke();
    ctx.filter = 'none';

    // Core line
    ctx.strokeStyle = `hsla(${hue}, 85%, 68%, ${ribbonAlpha})`;
    ctx.lineWidth = 1.5 + Math.sin(t * 0.3 + r * 3) * 0.5;
    ctx.stroke();
  }

  // ─── Deep ocean glow patches ───
  const patches = [
    { cx: 0.2, cy: 0.5 }, { cx: 0.5, cy: 0.4 }, { cx: 0.75, cy: 0.6 }, { cx: 0.4, cy: 0.7 },
  ];
  for (let i = 0; i < patches.length; i++) {
    const px = patches[i].cx * w + Math.sin(t * 0.12 + i * 3) * 50;
    const py = patches[i].cy * h + Math.cos(t * 0.1 + i * 2) * 35;
    const mD = Math.sqrt((m.x - px) ** 2 + (m.y - py) ** 2);
    const mI = Math.max(0, 1 - mD / 280) * int;
    const pr = 90 + mI * 40 + Math.sin(t * 0.25 + i) * 20;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, pr);
    grad.addColorStop(0, `hsla(${P.hue + i * 12}, 80%, 55%, ${(0.05 + mI * 0.04) * int})`);
    grad.addColorStop(0.5, `hsla(${P.hue + i * 12 + 10}, 70%, 45%, ${(0.025 + mI * 0.02) * int})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  SATURN — Concentric tilted ring orbits + glowing dust motes
 * ═══════════════════════════════════════════════════════════════════ */
function drawSaturn(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: Mouse, int: number, P: PlanetCfg,
) {
  const cx = w * 0.5, cy = h * 0.5;
  const mDist = Math.sqrt((m.x - cx) ** 2 + (m.y - cy) ** 2);
  const mI = Math.max(0, 1 - mDist / 380) * int;

  // ─── Planet core glow ───
  const coreR = 50 + Math.sin(t * 0.3) * 8 + mI * 20;
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
  coreGrad.addColorStop(0, `hsla(${P.hue}, 70%, 65%, ${(0.08 + mI * 0.05) * int})`);
  coreGrad.addColorStop(0.5, `hsla(${P.hue + 10}, 60%, 50%, ${(0.04 + mI * 0.025) * int})`);
  coreGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = coreGrad;
  ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fill();

  // ─── Concentric tilted rings ───
  const rings = 10;
  for (let r = 0; r < rings; r++) {
    const rx = 90 + r * 32 + Math.sin(t * 0.18 + r) * 8 + mI * 15;
    const ry = rx * 0.28 + Math.sin(t * 0.12 + r * 0.5) * 4;
    const rotAngle = t * 0.015 * (r % 2 === 0 ? 1 : -1) + r * 0.08;

    ctx.save();
    ctx.translate(
      cx + (m.x - cx) * mI * 0.04,
      cy + (m.y - cy) * mI * 0.04
    );
    ctx.rotate(rotAngle);

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    const hue = P.hue + r * 5 + Math.sin(t * 0.25 + r) * 8;
    const alpha = (0.03 + Math.sin(t * 0.4 + r * 1.3) * 0.012 + mI * 0.025) * int;
    ctx.strokeStyle = `hsla(${hue}, ${P.sat}%, 62%, ${alpha})`;
    ctx.lineWidth = 1 + Math.sin(t * 0.35 + r * 2) * 0.4;
    ctx.setLineDash([5 + r * 0.5, 3 + r * 0.3]);
    ctx.lineDashOffset = -t * 18 * (r % 2 === 0 ? 1 : -1);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ─── Ring dust motes orbiting along rings ───
  for (let i = 0; i < 35; i++) {
    const ringIdx = (i * 7) % rings;
    const angle = (i / 35) * Math.PI * 2 + t * 0.08 * (i % 2 === 0 ? 1 : -1.2);
    const rx = 90 + ringIdx * 32;
    const ry = rx * 0.28;
    const rot = t * 0.015 * (ringIdx % 2 === 0 ? 1 : -1) + ringIdx * 0.08;
    const cosR = Math.cos(rot), sinR = Math.sin(rot);
    const lx = Math.cos(angle) * rx, ly = Math.sin(angle) * ry;
    const dx = cx + lx * cosR - ly * sinR + (m.x - cx) * mI * 0.04;
    const dy = cy + lx * sinR + ly * cosR + (m.y - cy) * mI * 0.04;

    const dM = Math.sqrt((m.x - dx) ** 2 + (m.y - dy) ** 2);
    const glow = Math.max(0, 1 - dM / 130) * int;
    const s = 1 + glow * 4;
    ctx.fillStyle = `hsla(${P.hue + i * 3}, 65%, 72%, ${(0.18 + glow * 0.45) * int})`;
    ctx.beginPath(); ctx.arc(dx, dy, s, 0, Math.PI * 2); ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  MARS — Dust storm spirals + floating volcanic embers
 * ═══════════════════════════════════════════════════════════════════ */
function drawMars(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: Mouse, int: number, P: PlanetCfg,
) {
  // ─── Dust storm vortex clouds (soft radial blobs, not line spirals) ───
  const vortexes = [
    { x: 0.3, y: 0.4, r: 140 },
    { x: 0.7, y: 0.55, r: 110 },
    { x: 0.5, y: 0.3, r: 90 },
  ];

  for (const vx of vortexes) {
    const vcx = vx.x * w + Math.sin(t * 0.1 + vx.x * 10) * 30;
    const vcy = vx.y * h + Math.cos(t * 0.08 + vx.y * 10) * 25;
    const mD = Math.sqrt((m.x - vcx) ** 2 + (m.y - vcy) ** 2);
    const mI = Math.max(0, 1 - mD / 260) * int;

    // Multiple overlapping rotating blobs per vortex
    for (let arm = 0; arm < 4; arm++) {
      const angle = t * 0.2 + arm * (Math.PI / 2);
      const dist = vx.r * 0.4 + Math.sin(t * 0.3 + arm * 2) * 15;
      const bx = vcx + Math.cos(angle) * dist + (m.x - vcx) * mI * 0.12;
      const by = vcy + Math.sin(angle) * dist * 0.7 + (m.y - vcy) * mI * 0.12;
      const br = 50 + Math.sin(t * 0.4 + arm) * 15 + mI * 20;

      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      const hue = P.hue + arm * 10;
      const alpha = (0.04 + mI * 0.03) * int;
      grad.addColorStop(0, `hsla(${hue}, ${P.sat}%, 50%, ${alpha * 1.2})`);
      grad.addColorStop(0.5, `hsla(${hue + 8}, ${P.sat - 10}%, 40%, ${alpha * 0.5})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
    }

    // Central vortex core
    const coreGrad = ctx.createRadialGradient(vcx, vcy, 0, vcx, vcy, 30 + mI * 15);
    coreGrad.addColorStop(0, `hsla(${P.hue + 15}, 80%, 60%, ${(0.06 + mI * 0.04) * int})`);
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath(); ctx.arc(vcx, vcy, 30 + mI * 15, 0, Math.PI * 2); ctx.fill();
  }

  // ─── Rising ember particles ───
  for (let i = 0; i < 20; i++) {
    const baseX = (i / 20) * w + Math.sin(i * 13.7) * 80;
    const baseY = h - (t * 12 + i * 50) % (h + 80) + 40;
    const shimmer = Math.sin(t * 2.5 + i * 2.5) * 5;
    const ex = baseX + shimmer + fbm(i * 0.5, t * 0.15, 2) * 15;
    const ey = baseY;
    const mD = Math.sqrt((m.x - ex) ** 2 + (m.y - ey) ** 2);
    const glow = Math.max(0, 1 - mD / 130) * int;
    const size = 1.5 + glow * 4 + Math.sin(t * 3 + i) * 0.5;
    const alpha = (0.25 + glow * 0.4) * int * Math.max(0, Math.min(1, (ey + 20) / 80));

    if (alpha > 0.01) {
      const grad = ctx.createRadialGradient(ex, ey, 0, ex, ey, size * 3);
      grad.addColorStop(0, `hsla(${P.hue + 20}, 90%, 65%, ${alpha})`);
      grad.addColorStop(0.4, `hsla(${P.hue + 5}, 80%, 50%, ${alpha * 0.4})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(ex, ey, size * 3, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ─── Ground haze ───
  const hazeGrad = ctx.createLinearGradient(0, h, 0, h * 0.75);
  hazeGrad.addColorStop(0, `hsla(${P.hue}, 45%, 28%, ${0.06 * int})`);
  hazeGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = hazeGrad;
  ctx.fillRect(0, h * 0.75, w, h * 0.25);
}

/* ═══════════════════════════════════════════════════════════════════
 *  VENUS — Dense atmospheric clouds + volcanic lightning
 * ═══════════════════════════════════════════════════════════════════ */
function drawVenus(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: Mouse, int: number, P: PlanetCfg,
) {
  // ─── Dense atmospheric cloud layers (soft horizontal glow bands) ───
  for (let layer = 0; layer < 5; layer++) {
    const baseY = h * (0.12 + layer * 0.17);
    const n = fbm(layer * 0.5 + t * 0.03, t * 0.015, 3);

    // Each layer is a series of overlapping soft blobs
    for (let blob = 0; blob < 5; blob++) {
      const bx = (blob / 5) * w + fbm(blob + t * 0.04 * (layer % 2 === 0 ? 1 : -1), layer + t * 0.02, 3) * 100;
      const by = baseY + (n - 0.5) * 25 + Math.sin(t * 0.2 + blob * 2 + layer) * 12;
      const mD = Math.sqrt((m.x - bx) ** 2 + (m.y - by) ** 2);
      const mI = Math.max(0, 1 - mD / 200) * int;
      const br = 80 + mI * 25 + Math.sin(t * 0.3 + blob + layer) * 15;
      const hue = P.hue + layer * 10 + Math.sin(t * 0.08 + layer) * 6;
      const alpha = (0.025 + fbm(blob * 0.3 + layer, t * 0.03, 2) * 0.02 + mI * 0.025) * int;

      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      grad.addColorStop(0, `hsla(${hue}, ${P.sat}%, 48%, ${alpha * 1.3})`);
      grad.addColorStop(0.5, `hsla(${hue + 8}, ${P.sat - 10}%, 40%, ${alpha * 0.5})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ─── Volcanic lightning — jagged flashes near mouse ───
  const mInView = m.x > 0 && m.x < w && m.y > 0 && m.y < h;
  if (mInView && Math.sin(t * 7) > 0.93) {
    const branches = 2 + Math.floor(Math.random() * 2);
    for (let b = 0; b < branches; b++) {
      ctx.beginPath();
      let lx = m.x + (Math.random() - 0.5) * 70;
      let ly = m.y + (Math.random() - 0.5) * 70;
      ctx.moveTo(lx, ly);
      const steps = 5 + Math.floor(Math.random() * 5);
      for (let s = 0; s < steps; s++) {
        lx += (Math.random() - 0.5) * 35;
        ly += 12 + Math.random() * 22;
        ctx.lineTo(lx, ly);
      }
      ctx.strokeStyle = `hsla(${P.hue + 30}, 90%, 82%, ${(0.35 + Math.random() * 0.25) * int})`;
      ctx.lineWidth = 0.5 + Math.random() * 0.8;
      ctx.stroke();

      // Flash glow at end
      const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 25);
      grad.addColorStop(0, `hsla(${P.hue + 30}, 90%, 80%, ${0.12 * int})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(lx, ly, 25, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ─── Sulfuric haze glow ───
  for (let i = 0; i < 3; i++) {
    const hx = w * (0.25 + i * 0.25) + Math.sin(t * 0.07 + i * 4) * 45;
    const hy = h * 0.5 + Math.cos(t * 0.05 + i * 3) * 55;
    const mD = Math.sqrt((m.x - hx) ** 2 + (m.y - hy) ** 2);
    const mI = Math.max(0, 1 - mD / 220) * int;
    const r = 65 + mI * 25 + Math.sin(t * 0.25 + i * 2) * 12;
    const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, r);
    grad.addColorStop(0, `hsla(${P.hue + i * 15}, 65%, 52%, ${(0.04 + mI * 0.035) * int})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  MERCURY — Solar flare arcs + metallic surface gleams
 * ═══════════════════════════════════════════════════════════════════ */
function drawMercury(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: Mouse, int: number, P: PlanetCfg,
) {
  // ─── Subtle heat shimmer (very faint horizontal waves) ───
  for (let i = 0; i < 8; i++) {
    const baseY = (i / 8) * h;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 6) {
      const shimmer = Math.sin(x * 0.025 + t * 1.8 + i * 1.5) * 2.5
        + Math.sin(x * 0.008 + t * 0.6 + i * 3) * 4;
      const mD = Math.sqrt((m.x - x) ** 2 + (m.y - baseY) ** 2);
      const mW = Math.max(0, 1 - mD / 170) * 6 * int;
      ctx.lineTo(x, baseY + shimmer + mW * Math.sin(x * 0.04 + t * 2.5));
    }
    ctx.strokeStyle = `hsla(${P.hue}, ${P.sat + 15}%, 68%, ${(0.012 + Math.sin(t * 0.8 + i) * 0.004) * int})`;
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }

  // ─── Solar flare arcs from edges (smooth curves, not hard lines) ───
  const flares = [
    { x: -10, y: h * 0.3, dir: 1 },
    { x: w + 10, y: h * 0.6, dir: -1 },
    { x: w * 0.5, y: -10, dir: 1 },
  ];
  for (const flare of flares) {
    const mD = Math.sqrt((m.x - flare.x) ** 2 + (m.y - flare.y) ** 2);
    const mI = Math.max(0, 1 - mD / 320) * int;

    ctx.beginPath();
    const pts: { x: number; y: number }[] = [];
    for (let a = 0; a <= Math.PI; a += 0.06) {
      const r = 55 + Math.sin(a * 3 + t * 0.4) * 25 + mI * 25;
      pts.push({
        x: flare.x + Math.cos(a) * r * flare.dir,
        y: flare.y + Math.sin(a) * r * 0.45,
      });
    }
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const cpx = (pts[i].x + pts[i + 1].x) / 2;
      const cpy = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, cpx, cpy);
    }

    // Glow pass
    ctx.strokeStyle = `hsla(40, 75%, 68%, ${(0.03 + mI * 0.03) * int})`;
    ctx.lineWidth = 6;
    ctx.filter = 'blur(4px)';
    ctx.stroke();
    ctx.filter = 'none';

    // Core
    ctx.strokeStyle = `hsla(45, 85%, 78%, ${(0.04 + mI * 0.035) * int})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ─── Metallic surface gleams ───
  for (let i = 0; i < 6; i++) {
    const gx = w * (0.1 + i * 0.16) + Math.sin(t * 0.08 + i * 4) * 25;
    const gy = h * (0.3 + Math.sin(t * 0.06 + i * 3) * 0.2);
    const mD = Math.sqrt((m.x - gx) ** 2 + (m.y - gy) ** 2);
    const glow = Math.max(0, 1 - mD / 200) * int;
    const r = 35 + glow * 22 + Math.sin(t * 0.3 + i * 2) * 8;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
    grad.addColorStop(0, `hsla(215, 15%, 82%, ${(0.035 + glow * 0.05) * int})`);
    grad.addColorStop(0.5, `hsla(225, 10%, 68%, ${(0.018 + glow * 0.025) * int})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(gx, gy, r, 0, Math.PI * 2); ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  SHARED HELPERS — Particles, Cursor Aura, Connections
 * ═══════════════════════════════════════════════════════════════════ */
function drawParticles(
  ctx: CanvasRenderingContext2D, particles: Particle[],
  m: Mouse, t: number, int: number, P: PlanetCfg,
) {
  particles.forEach((p) => {
    const nAngle = fbm(p.baseX * 0.005 + t * 0.1, p.baseY * 0.005 + t * 0.08, 3) * Math.PI * 4;
    p.angle += p.orbitSpeed;
    const tx = p.baseX + Math.cos(nAngle + p.phase) * p.orbitRadius * 0.5 + Math.cos(p.angle) * p.orbitRadius * 0.3;
    const ty = p.baseY + Math.sin(nAngle + p.phase) * p.orbitRadius * 0.5 + Math.sin(p.angle) * p.orbitRadius * 0.3;

    const mdx = m.x - p.x, mdy = m.y - p.y;
    const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
    let fx = 0, fy = 0;
    if (mDist < 180) {
      if (mDist < 80) {
        const f = (1 - mDist / 80) * 3.5 * int;
        fx = -mdx / mDist * f; fy = -mdy / mDist * f;
      } else {
        const f = (1 - mDist / 180) * 1.2 * int;
        fx = (-mdy / mDist) * f + mdx / mDist * f * 0.15;
        fy = (mdx / mDist) * f + mdy / mDist * f * 0.15;
      }
    }
    p.vx += (tx - p.x) * 0.01 + fx;
    p.vy += (ty - p.y) * 0.01 + fy;
    p.vx *= 0.95; p.vy *= 0.95;
    p.x += p.vx; p.y += p.vy;
    p.life += 0.005;

    const pulse = 0.5 + 0.5 * Math.sin(p.life * 2 + p.phase);
    const mg = Math.max(0, 1 - mDist / 150) * int;
    const gs = p.size + mg * 5;
    const ga = p.alpha * pulse * int + mg * 0.35;

    if (mg > 0.05) {
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gs * 3);
      glow.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${ga * 0.2})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.x, p.y, gs * 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${ga})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, gs, 0, Math.PI * 2); ctx.fill();

    const cw = ctx.canvas.width / (window.devicePixelRatio || 1);
    const ch = ctx.canvas.height / (window.devicePixelRatio || 1);
    if (p.x < -50) p.x = cw + 50; if (p.x > cw + 50) p.x = -50;
    if (p.y < -50) p.y = ch + 50; if (p.y > ch + 50) p.y = -50;
  });
}

function drawCursorAura(
  ctx: CanvasRenderingContext2D, m: Mouse,
  w: number, h: number, t: number, int: number, P: PlanetCfg,
) {
  if (m.x < 0 || m.x > w || m.y < 0 || m.y > h) return;

  const r1 = 22 + Math.sin(t * 2) * 7;
  const r2 = 50 + Math.sin(t * 1.5 + 1) * 10;
  const r3 = 85 + Math.sin(t + 2) * 14;

  const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r1);
  glow.addColorStop(0, `hsla(${P.hue}, 80%, 65%, ${0.1 * int})`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(m.x, m.y, r1, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = `hsla(${P.hue2}, 65%, 58%, ${0.06 * int})`;
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(m.x, m.y, r2, 0, Math.PI * 2); ctx.stroke();

  ctx.strokeStyle = `hsla(${P.hue}, 45%, 55%, ${0.03 * int})`;
  ctx.lineWidth = 0.4;
  ctx.beginPath(); ctx.arc(m.x, m.y, r3, 0, Math.PI * 2); ctx.stroke();

  // Electric sparks
  for (let i = 0; i < 6; i++) {
    const sa = (i / 6) * Math.PI * 2 + t * 1.3;
    const sr = 11 + Math.sin(t * 2.5 + i * 1.2) * 7;
    const sx = m.x + Math.cos(sa) * sr, sy = m.y + Math.sin(sa) * sr;
    const er = sr + 5 + Math.sin(t * 4.5 + i * 2) * 3.5;
    const j = (Math.random() - 0.5) * 0.25;
    const ex = m.x + Math.cos(sa + j) * er, ey = m.y + Math.sin(sa + j) * er;
    ctx.strokeStyle = `hsla(${P.hue + i * 7}, 80%, 75%, ${0.25 * int})`;
    ctx.lineWidth = 0.4;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  }
}

function drawConnections(
  ctx: CanvasRenderingContext2D, particles: Particle[],
  m: Mouse, int: number, P: PlanetCfg,
) {
  particles.forEach((p1, i) => {
    if (Math.sqrt((m.x - p1.x) ** 2 + (m.y - p1.y) ** 2) > 170) return;
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      if (Math.sqrt((m.x - p2.x) ** 2 + (m.y - p2.y) ** 2) > 170) continue;
      const d = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
      if (d < 95) {
        ctx.strokeStyle = `hsla(${P.hue}, 50%, 60%, ${(1 - d / 95) * 0.1 * int})`;
        ctx.lineWidth = 0.35;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
    }
  });
}
