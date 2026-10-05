/**
 * 演出で使う計算の補助
 *
 * Home の宇宙のシーン（features/home/scene/）と、セクションを開く・閉じる粒子（lib/burst.ts）の両方で使う。
 */

/** v を 0〜1 の範囲に収める */
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** a から b への、割合 t（0〜1）の位置の値 */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 始めが速く、終わりにかけてゆっくり止まる動き（0〜1 → 0〜1） */
export const easeOutCubic = (v: number) => 1 - (1 - v) ** 3;
