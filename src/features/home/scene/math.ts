/**
 * 宇宙のシーンで使う計算の補助
 */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOutCubic = (v: number) => 1 - (1 - v) ** 3;

/**
 * 値を目標へ少しずつ近づけるときの、このフレームで近づける割合。
 * perFrame は 60fps の1フレームで近づける割合で、経過時間 dt（秒）に合わせて換算する
 * （タッチ端末で1秒に30回へ間引いたときや、高リフレッシュレートの画面でも、近づく速さを同じにするため）
 */
export const approachRate = (perFrame: number, dt: number) => 1 - (1 - perFrame) ** (dt * 60);

/** 高解像度の画面でも粗く見えないよう、Canvas を画素数に合わせる。負荷を抑えるため2倍までにする */
export const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);
