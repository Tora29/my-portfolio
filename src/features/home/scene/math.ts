/**
 * 宇宙のシーンで使う計算の補助
 */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOutCubic = (v: number) => 1 - (1 - v) ** 3;

/**
 * CSS の色を Canvas で透明度を付けて使える形（"244,114,182"）にする。
 * 惑星の色は CSS（global.css のセクションの色）を唯一の定義にし、スクリプトに色の値を重複して書かないため。
 *
 * ビルド時の圧縮で rgb() が #rrggbb に書き換わるなど、CSS に書いた形のままとは限らないため、
 * Canvas に色を解釈させて #rrggbb の形に揃えてから読む
 */
export function toRgbTriplet(color: string): string {
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = color.trim();
  const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(ctx.fillStyle);
  if (!hex) return '255,255,255';
  return hex
    .slice(1)
    .map((h) => parseInt(h, 16))
    .join(',');
}

/** 高解像度の画面でも粗く見えないよう、Canvas を画素数に合わせる。負荷を抑えるため2倍までにする */
export const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);
