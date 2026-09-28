/**
 * 宇宙のシーンで使う計算の補助
 */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOutCubic = (v: number) => 1 - (1 - v) ** 3;

/** 高解像度の画面でも粗く見えないよう、Canvas を画素数に合わせる。負荷を抑えるため2倍までにする */
export const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);
