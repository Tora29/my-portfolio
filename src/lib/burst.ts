/**
 * セクションを開く・閉じるときの粒子（.users/requirements/screens.md §4.6）
 *
 * 開く：押した惑星（名前・最新 Activity）から、そのセクションの色の粒子が画面全体へ広がる。
 * 閉じる：同じ動きを逆再生し、戻り先の惑星へ粒子が集まる。
 *
 * ブラウザでのみ動く。描画先の Canvas は layouts/SectionTransition.astro がページ遷移をまたいで残す。
 */
import { clamp01, easeOutCubic, lerp } from './math';
import type { Circle } from './orbit';

/** 粒子の数。画面を覆う密度と、描画の負荷の兼ね合い */
const COUNT = 1400;

/** 円の中心から、画面の最も遠い角までの距離 */
export const coverRadius = (c: Circle) =>
  Math.hypot(Math.max(c.x, innerWidth - c.x), Math.max(c.y, innerHeight - c.y));

/**
 * 粒子を1回再生する。返り値の関数で途中で止められる。
 * @param rgb 粒子の色（"r,g,b"）
 * @param direction out：円から画面の外へ / in：その逆再生
 */
export function playBurst(
  canvas: HTMLCanvasElement,
  c: Circle,
  rgb: string,
  direction: 'out' | 'in',
  durationMs: number,
): () => void {
  const ctx = canvas.getContext('2d')!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const reach = coverRadius(c) * 1.05;
  const parts = Array.from({ length: COUNT }, () => ({
    ang: Math.random() * Math.PI * 2,
    // 惑星の内側から始まり、画面全体に散らばって終わる
    r0: Math.sqrt(Math.random()) * c.r,
    r1: reach * (0.3 + 0.8 * Math.random() ** 0.7),
    swirl: (Math.random() - 0.5) * 0.7,
    // 一斉に動き出さないよう、出発を少しずつずらす
    delay: Math.random() * 0.25,
    size: 0.6 + Math.random() * 1.8,
    white: Math.random() < 0.2,
  }));

  const start = performance.now();
  let frame = 0;
  const step = (now: number) => {
    const k = clamp01((now - start) / durationMs);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      let u = clamp01((k - p.delay) / (1 - p.delay));
      if (direction === 'in') u = 1 - u;
      const e = easeOutCubic(u);
      const r = lerp(p.r0, p.r1, e);
      const a = p.ang + p.swirl * e;
      // 出発直後に現れ、広がるにつれて消える
      const alpha = Math.min(1, u / 0.08) * (1 - u) ** 1.2;
      if (alpha <= 0.01) continue;
      const s = p.size * (1 + 0.6 * e);
      ctx.fillStyle = p.white ? `rgba(255,255,255,${alpha})` : `rgba(${rgb},${alpha})`;
      ctx.fillRect(c.x + Math.cos(a) * r - s / 2, c.y + Math.sin(a) * r - s / 2, s, s);
    }
    ctx.globalCompositeOperation = 'source-over';
    if (k < 1) frame = requestAnimationFrame(step);
    else ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
  frame = requestAnimationFrame(step);

  return () => {
    cancelAnimationFrame(frame);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
}
