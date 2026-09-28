/**
 * 色の変換（ブラウザでのみ使う。Canvas に色を解釈させるため）
 */

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
