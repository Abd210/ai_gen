'use client';

import React, { useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════
 *  PLANET-INSPIRED AMBIENT BACKGROUNDS
 *  Each page gets a unique visual identity drawn from a planet:
 *
 *  jupiter  → Swirling gas bands, storm vortexes, warm amber/red
 *  neptune  → Deep blue/cyan ice crystal aurora ribbons
 *  saturn   → Golden ring orbits, particle dust belts
 *  mars     → Red dust storms, volcanic ember particles
 *  venus    → Acid green atmospheric haze, volcanic lightning
 *  mercury  → Silver metallic solar flares, heat shimmer
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
  jupiter: { hue: 25, hue2: 15, sat: 75, colors: [[210, 130, 50], [180, 80, 30], [230, 160, 90]] },
  neptune: { hue: 210, hue2: 190, sat: 80, colors: [[40, 100, 220], [30, 180, 240], [80, 140, 255]] },
  saturn:  { hue: 42, hue2: 50, sat: 70, colors: [[220, 180, 80], [200, 160, 60], [240, 200, 120]] },
  mars:    { hue: 10, hue2: 20, sat: 65, colors: [[200, 60, 40], [180, 40, 30], [220, 100, 60]] },
  venus:   { hue: 75, hue2: 55, sat: 60, colors: [[160, 200, 50], [120, 180, 30], [200, 230, 80]] },
  mercury: { hue: 220, hue2: 240, sat: 10, colors: [[180, 190, 210], [140, 150, 170], [210, 220, 230]] },
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
    const count = planet === 'saturn' ? 120 : planet === 'mars' ? 100 : 70;
    const ps: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      ps.push({
        x, y, baseX: x, baseY: y, vx: 0, vy: 0,
        size: 0.5 + Math.random() * 3,
        alpha: 0.1 + Math.random() * 0.4,
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

    /* ═══════════════ RENDER LOOP ═══════════════ */
    const draw = () => {
      const w = canvas.width / dpr, h = canvas.height / dpr, t = timeRef.current;
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.07; m.y += (m.ty - m.y) * 0.07;
      ctx.clearRect(0, 0, w, h);

      /* ─── Planet-specific rendering ─── */
      switch (planet) {
        case 'jupiter': drawJupiter(ctx, w, h, t, m, intensity, P); break;
        case 'neptune': drawNeptune(ctx, w, h, t, m, intensity, P); break;
        case 'saturn':  drawSaturn(ctx, w, h, t, m, intensity, P); break;
        case 'mars':    drawMars(ctx, w, h, t, m, intensity, P); break;
        case 'venus':   drawVenus(ctx, w, h, t, m, intensity, P); break;
        case 'mercury': drawMercury(ctx, w, h, t, m, intensity, P); break;
      }

      /* ─── Shared: Particles with mouse interaction ─── */
      drawParticles(ctx, particlesRef.current, m, t, intensity, P);

      /* ─── Shared: Mouse cursor aura ─── */
      drawCursorAura(ctx, m, w, h, t, intensity, P, planet);

      /* ─── Shared: Near-mouse connections ─── */
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

/* ═══════════════════════════════════════════════════════════════════
 *  JUPITER — Swirling gas bands + Great Red Spot vortex
 * ═══════════════════════════════════════════════════════════════════ */
function drawJupiter(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: { x: number; y: number }, int: number, P: typeof PLANET.jupiter,
) {
  // Horizontal gas bands flowing across canvas
  const bands = 8;
  for (let i = 0; i < bands; i++) {
    const bandY = (i / bands) * h;
    const bandH = h / bands * 1.2;
    ctx.beginPath();
    ctx.moveTo(0, bandY);
    for (let x = 0; x <= w; x += 8) {
      const n = fbm(x * 0.003 + t * 0.08 * (i % 2 === 0 ? 1 : -0.7), i * 0.5 + t * 0.03, 4);
      const mDist = Math.sqrt((m.x - x) ** 2 + (m.y - bandY) ** 2);
      const mBend = Math.max(0, 1 - mDist / 200) * 25 * int;
      const y = bandY + (n - 0.5) * 40 + mBend * (m.y > bandY ? 1 : -1);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, bandY + bandH);
    ctx.lineTo(0, bandY + bandH);
    ctx.closePath();

    const hue = P.hue + i * 8 + fbm(i, t * 0.1) * 30;
    const alpha = (0.03 + fbm(i * 0.3, t * 0.05) * 0.04) * int;
    ctx.fillStyle = `hsla(${hue}, ${P.sat}%, 50%, ${alpha})`;
    ctx.fill();
  }

  // Great Red Spot — a vortex that reacts to mouse
  const spotX = w * 0.65, spotY = h * 0.45;
  const spotMDist = Math.sqrt((m.x - spotX) ** 2 + (m.y - spotY) ** 2);
  const spotPull = Math.max(0, 1 - spotMDist / 250) * int;
  for (let ring = 0; ring < 5; ring++) {
    const r = 40 + ring * 20 + Math.sin(t + ring) * 8 + spotPull * 15;
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += 0.05) {
      const wobble = fbm(Math.cos(a) * 2 + t * 0.3, Math.sin(a) * 2 + ring, 3) * 15;
      const px = spotX + Math.cos(a + t * 0.2 * (ring % 2 === 0 ? 1 : -1)) * (r + wobble);
      const py = spotY + Math.sin(a + t * 0.2 * (ring % 2 === 0 ? 1 : -1)) * (r * 0.6 + wobble * 0.6);
      a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `hsla(${10 + ring * 5}, 80%, 55%, ${(0.06 - ring * 0.008 + spotPull * 0.04) * int})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  NEPTUNE — Ice crystal aurora ribbons + deep ocean flow
 * ═══════════════════════════════════════════════════════════════════ */
function drawNeptune(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: { x: number; y: number }, int: number, P: typeof PLANET.neptune,
) {
  // Aurora ribbons — smooth flowing sine ribbons across the screen
  const ribbons = 6;
  for (let r = 0; r < ribbons; r++) {
    const baseY = h * 0.15 + (r / ribbons) * h * 0.7;
    ctx.beginPath();
    for (let x = -20; x <= w + 20; x += 4) {
      const progress = x / w;
      const n1 = fbm(progress * 2 + t * 0.12 + r * 10, r * 0.5 + t * 0.05, 4);
      const n2 = Math.sin(progress * Math.PI * 3 + t * 0.3 + r * 1.5) * 0.5 + 0.5;

      // Mouse magnetic attraction
      const mdx = m.x - x, mdy = m.y - baseY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      const attract = Math.max(0, 1 - mDist / 200) * 50 * int;

      const y = baseY + (n1 - 0.5) * 60 * n2 + Math.sin(progress * 6 + t * 0.5 + r) * 20
        + (mdy > 0 ? 1 : -1) * attract;

      x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const hue = P.hue + r * 15 + Math.sin(t * 0.2 + r) * 10;
    ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${(0.06 + Math.sin(t * 0.5 + r * 2) * 0.02) * int})`;
    ctx.lineWidth = 2 + Math.sin(t * 0.3 + r * 3) * 1;
    ctx.stroke();

    // Glow layer
    ctx.strokeStyle = `hsla(${hue}, 85%, 70%, ${0.025 * int})`;
    ctx.lineWidth = 12;
    ctx.filter = 'blur(6px)';
    ctx.stroke();
    ctx.filter = 'none';
  }

  // Deep ocean glow patches
  for (let i = 0; i < 4; i++) {
    const cx = w * (0.2 + i * 0.2) + Math.sin(t * 0.15 + i * 2) * 60;
    const cy = h * 0.5 + Math.cos(t * 0.12 + i * 3) * 40;
    const mD = Math.sqrt((m.x - cx) ** 2 + (m.y - cy) ** 2);
    const mI = Math.max(0, 1 - mD / 250) * int;
    const r = 80 + mI * 40 + Math.sin(t * 0.3 + i) * 20;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, `hsla(${P.hue + i * 10}, 80%, 55%, ${(0.05 + mI * 0.04) * int})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  SATURN — Concentric ring orbits + particle dust belts
 * ═══════════════════════════════════════════════════════════════════ */
function drawSaturn(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: { x: number; y: number }, int: number, P: typeof PLANET.saturn,
) {
  const cx = w * 0.5, cy = h * 0.5;
  const mDist = Math.sqrt((m.x - cx) ** 2 + (m.y - cy) ** 2);
  const mInfluence = Math.max(0, 1 - mDist / 350) * int;

  // Concentric tilted rings
  const rings = 12;
  for (let r = 0; r < rings; r++) {
    const rx = 80 + r * 35 + Math.sin(t * 0.2 + r) * 10 + mInfluence * 20;
    const ry = rx * 0.3 + Math.sin(t * 0.15 + r * 0.5) * 5;
    const rotAngle = t * 0.02 * (r % 2 === 0 ? 1 : -1) + r * 0.1;

    ctx.save();
    ctx.translate(cx + (m.x - cx) * mInfluence * 0.05, cy + (m.y - cy) * mInfluence * 0.05);
    ctx.rotate(rotAngle);

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    const hue = P.hue + r * 6 + Math.sin(t * 0.3 + r) * 10;
    const alpha = (0.04 + Math.sin(t * 0.5 + r * 1.5) * 0.015 + mInfluence * 0.03) * int;
    ctx.strokeStyle = `hsla(${hue}, ${P.sat}%, 60%, ${alpha})`;
    ctx.lineWidth = 1 + Math.sin(t * 0.4 + r * 2) * 0.5;
    ctx.setLineDash([4 + r, 3 + r * 0.5]);
    ctx.lineDashOffset = -t * 20 * (r % 2 === 0 ? 1 : -1);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  // Ring dust — tiny dots following elliptical paths
  for (let i = 0; i < 40; i++) {
    const ringIdx = (i * 7) % rings;
    const angle = (i / 40) * Math.PI * 2 + t * 0.1 * (i % 2 === 0 ? 1 : -1.3);
    const rx = 80 + ringIdx * 35;
    const ry = rx * 0.3;
    const rotAngle = t * 0.02 * (ringIdx % 2 === 0 ? 1 : -1) + ringIdx * 0.1;

    const cos = Math.cos(rotAngle), sin = Math.sin(rotAngle);
    const lx = Math.cos(angle) * rx, ly = Math.sin(angle) * ry;
    const dx = cx + lx * cos - ly * sin + (m.x - cx) * mInfluence * 0.05;
    const dy = cy + lx * sin + ly * cos + (m.y - cy) * mInfluence * 0.05;

    const dMouse = Math.sqrt((m.x - dx) ** 2 + (m.y - dy) ** 2);
    const glow = Math.max(0, 1 - dMouse / 120) * int;
    const s = 1 + glow * 4;

    ctx.fillStyle = `hsla(${P.hue + i * 3}, 70%, 70%, ${(0.2 + glow * 0.5) * int})`;
    ctx.beginPath();
    ctx.arc(dx, dy, s, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  MARS — Red dust storms + floating volcanic embers
 * ═══════════════════════════════════════════════════════════════════ */
function drawMars(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: { x: number; y: number }, int: number, P: typeof PLANET.mars,
) {
  // Dust storm swirls — multiple vortexes
  const vortexes = [
    { x: w * 0.3, y: h * 0.4, r: 120 },
    { x: w * 0.7, y: h * 0.6, r: 90 },
    { x: w * 0.5, y: h * 0.3, r: 70 },
  ];

  for (const vx of vortexes) {
    const mD = Math.sqrt((m.x - vx.x) ** 2 + (m.y - vx.y) ** 2);
    const mI = Math.max(0, 1 - mD / 250) * int;
    const vcx = vx.x + (m.x - vx.x) * mI * 0.15;
    const vcy = vx.y + (m.y - vx.y) * mI * 0.15;

    // Spiral arms
    for (let arm = 0; arm < 3; arm++) {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 6; a += 0.08) {
        const r = a * (vx.r / (Math.PI * 6)) + mI * 20;
        const wobble = fbm(a * 0.5 + t * 0.2 + arm * 10, arm + t * 0.1, 3) * 10;
        const angle = a + t * 0.3 + arm * (Math.PI * 2 / 3);
        const px = vcx + Math.cos(angle) * (r + wobble);
        const py = vcy + Math.sin(angle) * (r + wobble) * 0.8;
        a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `hsla(${P.hue + arm * 8}, ${P.sat}%, 50%, ${(0.04 + mI * 0.03) * int})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Floating ember particles — rise upward with heat shimmer
  for (let i = 0; i < 25; i++) {
    const baseX = (i / 25) * w + Math.sin(i * 13.7) * 100;
    let baseY = h - (t * 15 + i * 40) % (h + 100) + 50;
    const shimmer = Math.sin(t * 3 + i * 2.5) * 4;
    const ex = baseX + shimmer + fbm(i * 0.5, t * 0.2, 2) * 20;
    const ey = baseY;
    const mD = Math.sqrt((m.x - ex) ** 2 + (m.y - ey) ** 2);
    const glow = Math.max(0, 1 - mD / 120) * int;
    const size = 1.5 + glow * 5 + Math.sin(t * 4 + i) * 0.5;
    const alpha = (0.3 + glow * 0.4) * int * (1 - Math.max(0, (50 - ey) / 50));

    if (alpha > 0) {
      const grad = ctx.createRadialGradient(ex, ey, 0, ex, ey, size * 3);
      grad.addColorStop(0, `hsla(${P.hue + 20}, 90%, 65%, ${alpha})`);
      grad.addColorStop(0.5, `hsla(${P.hue}, 80%, 50%, ${alpha * 0.3})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ex, ey, size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ground haze
  const hazeGrad = ctx.createLinearGradient(0, h, 0, h * 0.7);
  hazeGrad.addColorStop(0, `hsla(${P.hue}, 50%, 30%, ${0.08 * int})`);
  hazeGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = hazeGrad;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);
}

/* ═══════════════════════════════════════════════════════════════════
 *  VENUS — Thick acid atmosphere + volcanic lightning
 * ═══════════════════════════════════════════════════════════════════ */
function drawVenus(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: { x: number; y: number }, int: number, P: typeof PLANET.venus,
) {
  // Dense atmospheric layers — thick horizontal cloud bands with turbulence
  for (let layer = 0; layer < 6; layer++) {
    const baseY = h * (0.1 + layer * 0.15);
    const grad = ctx.createLinearGradient(0, baseY - 40, 0, baseY + 40);
    const hue = P.hue + layer * 12 + Math.sin(t * 0.1 + layer) * 8;
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, `hsla(${hue}, ${P.sat}%, 45%, ${(0.04 + fbm(layer, t * 0.05) * 0.03) * int})`);
    grad.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.moveTo(0, baseY - 40);
    for (let x = 0; x <= w; x += 6) {
      const n = fbm(x * 0.004 + t * 0.06 * (layer % 2 === 0 ? 1 : -1), layer + t * 0.02, 4);
      const mD = Math.sqrt((m.x - x) ** 2 + (m.y - baseY) ** 2);
      const mBend = Math.max(0, 1 - mD / 180) * 20 * int;
      ctx.lineTo(x, baseY + (n - 0.5) * 30 + mBend * Math.sign(m.y - baseY));
    }
    ctx.lineTo(w, baseY + 40);
    ctx.lineTo(0, baseY + 40);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Volcanic lightning — jagged bright flashes that trigger near mouse
  const mInViewport = m.x > 0 && m.x < w && m.y > 0 && m.y < h;
  if (mInViewport && Math.sin(t * 8) > 0.92) {
    const branches = 2 + Math.floor(Math.random() * 3);
    for (let b = 0; b < branches; b++) {
      ctx.beginPath();
      let lx = m.x + (Math.random() - 0.5) * 80;
      let ly = m.y + (Math.random() - 0.5) * 80;
      ctx.moveTo(lx, ly);
      const steps = 6 + Math.floor(Math.random() * 6);
      for (let s = 0; s < steps; s++) {
        lx += (Math.random() - 0.5) * 40;
        ly += 15 + Math.random() * 25;
        ctx.lineTo(lx, ly);
      }
      ctx.strokeStyle = `hsla(${P.hue + 30}, 90%, 80%, ${(0.4 + Math.random() * 0.3) * int})`;
      ctx.lineWidth = 0.5 + Math.random();
      ctx.stroke();

      // Flash glow
      const flashGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 30);
      flashGrad.addColorStop(0, `hsla(${P.hue + 30}, 90%, 80%, ${0.15 * int})`);
      flashGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flashGrad;
      ctx.beginPath();
      ctx.arc(lx, ly, 30, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Sulfuric haze glow patches
  for (let i = 0; i < 3; i++) {
    const hx = w * (0.25 + i * 0.25) + Math.sin(t * 0.08 + i * 4) * 50;
    const hy = h * 0.5 + Math.cos(t * 0.06 + i * 3) * 60;
    const mD = Math.sqrt((m.x - hx) ** 2 + (m.y - hy) ** 2);
    const mI = Math.max(0, 1 - mD / 200) * int;
    const r = 60 + mI * 30 + Math.sin(t * 0.3 + i * 2) * 15;
    const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, r);
    grad.addColorStop(0, `hsla(${P.hue + i * 15}, 70%, 50%, ${(0.05 + mI * 0.04) * int})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(hx, hy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  MERCURY — Solar flares + metallic heat shimmer
 * ═══════════════════════════════════════════════════════════════════ */
function drawMercury(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  m: { x: number; y: number }, int: number, P: typeof PLANET.mercury,
) {
  // Heat shimmer distortion lines — horizontal wavy lines
  for (let i = 0; i < 15; i++) {
    const baseY = (i / 15) * h;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const shimmer = Math.sin(x * 0.03 + t * 2 + i * 1.5) * 3
        + Math.sin(x * 0.01 + t * 0.8 + i * 3) * 5;
      const mD = Math.sqrt((m.x - x) ** 2 + (m.y - baseY) ** 2);
      const mW = Math.max(0, 1 - mD / 150) * 8 * int;
      ctx.lineTo(x, baseY + shimmer + mW * Math.sin(x * 0.05 + t * 3));
    }
    ctx.strokeStyle = `hsla(${P.hue}, ${P.sat + 20}%, 65%, ${(0.015 + Math.sin(t + i) * 0.005) * int})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Solar flare arcs originating from edges
  const flares = [
    { x: 0, y: h * 0.3, dir: 1 },
    { x: w, y: h * 0.6, dir: -1 },
    { x: w * 0.5, y: 0, dir: 1 },
  ];
  for (const flare of flares) {
    const mD = Math.sqrt((m.x - flare.x) ** 2 + (m.y - flare.y) ** 2);
    const mI = Math.max(0, 1 - mD / 300) * int;

    ctx.beginPath();
    for (let a = 0; a <= Math.PI; a += 0.03) {
      const r = 60 + Math.sin(a * 3 + t * 0.5) * 30 + mI * 30;
      const px = flare.x + Math.cos(a) * r * flare.dir;
      const py = flare.y + Math.sin(a) * r * 0.5;
      a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.strokeStyle = `hsla(35, 80%, 70%, ${(0.05 + mI * 0.04) * int})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner bright core
    ctx.strokeStyle = `hsla(45, 90%, 85%, ${(0.03 + mI * 0.03) * int})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Metallic surface gleams
  for (let i = 0; i < 5; i++) {
    const gx = w * (0.15 + i * 0.18) + Math.sin(t * 0.1 + i * 5) * 30;
    const gy = h * (0.3 + Math.sin(t * 0.08 + i * 3) * 0.2);
    const mD = Math.sqrt((m.x - gx) ** 2 + (m.y - gy) ** 2);
    const glow = Math.max(0, 1 - mD / 180) * int;
    const r = 40 + glow * 25;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
    grad.addColorStop(0, `hsla(210, 15%, 80%, ${(0.04 + glow * 0.06) * int})`);
    grad.addColorStop(0.5, `hsla(220, 10%, 65%, ${(0.02 + glow * 0.03) * int})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(gx, gy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  SHARED HELPERS
 * ═══════════════════════════════════════════════════════════════════ */
function drawParticles(
  ctx: CanvasRenderingContext2D, particles: Particle[],
  m: { x: number; y: number }, t: number, int: number, P: typeof PLANET.jupiter,
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
        const f = (1 - mDist / 80) * 4 * int;
        fx = -mdx / mDist * f; fy = -mdy / mDist * f;
      } else {
        const f = (1 - mDist / 180) * 1.5 * int;
        fx = (-mdy / mDist) * f + mdx / mDist * f * 0.2;
        fy = (mdx / mDist) * f + mdy / mDist * f * 0.2;
      }
    }
    p.vx += (tx - p.x) * 0.01 + fx;
    p.vy += (ty - p.y) * 0.01 + fy;
    p.vx *= 0.95; p.vy *= 0.95;
    p.x += p.vx; p.y += p.vy;
    p.life += 0.005;

    const pulse = 0.5 + 0.5 * Math.sin(p.life * 2 + p.phase);
    const mg = Math.max(0, 1 - mDist / 150) * int;
    const gs = p.size + mg * 6;
    const ga = p.alpha * pulse * int + mg * 0.4;

    if (mg > 0.05) {
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gs * 3);
      glow.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${ga * 0.25})`);
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
  ctx: CanvasRenderingContext2D, m: { x: number; y: number },
  w: number, h: number, t: number, int: number,
  P: typeof PLANET.jupiter, planet: PlanetTheme,
) {
  if (m.x < 0 || m.x > w || m.y < 0 || m.y > h) return;

  const r1 = 25 + Math.sin(t * 2) * 8;
  const r2 = 55 + Math.sin(t * 1.5 + 1) * 12;
  const r3 = 90 + Math.sin(t + 2) * 15;

  const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r1);
  glow.addColorStop(0, `hsla(${P.hue}, 80%, 65%, ${0.12 * int})`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(m.x, m.y, r1, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = `hsla(${P.hue2}, 70%, 60%, ${0.07 * int})`;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(m.x, m.y, r2, 0, Math.PI * 2); ctx.stroke();

  ctx.strokeStyle = `hsla(${P.hue}, 50%, 55%, ${0.035 * int})`;
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.arc(m.x, m.y, r3, 0, Math.PI * 2); ctx.stroke();

  // Electric sparks — planet-colored
  const sparkCount = planet === 'venus' ? 10 : planet === 'mercury' ? 8 : 6;
  for (let i = 0; i < sparkCount; i++) {
    const sa = (i / sparkCount) * Math.PI * 2 + t * 1.5;
    const sr = 12 + Math.sin(t * 3 + i * 1.2) * 8;
    const sx = m.x + Math.cos(sa) * sr, sy = m.y + Math.sin(sa) * sr;
    const er = sr + 6 + Math.sin(t * 5 + i * 2) * 4;
    const j = (Math.random() - 0.5) * 0.3;
    const ex = m.x + Math.cos(sa + j) * er, ey = m.y + Math.sin(sa + j) * er;
    ctx.strokeStyle = `hsla(${P.hue + i * 8}, 80%, 75%, ${0.3 * int})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  }
}

function drawConnections(
  ctx: CanvasRenderingContext2D, particles: Particle[],
  m: { x: number; y: number }, int: number, P: typeof PLANET.jupiter,
) {
  particles.forEach((p1, i) => {
    if (Math.sqrt((m.x - p1.x) ** 2 + (m.y - p1.y) ** 2) > 180) return;
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      if (Math.sqrt((m.x - p2.x) ** 2 + (m.y - p2.y) ** 2) > 180) continue;
      const d = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
      if (d < 100) {
        ctx.strokeStyle = `hsla(${P.hue}, 50%, 60%, ${(1 - d / 100) * 0.12 * int})`;
        ctx.lineWidth = 0.4;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
    }
  });
}
