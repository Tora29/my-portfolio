/**
 * Home の惑星の軌道（.users/requirements/screens.md §4.2）
 *
 * 名前を中心とした傾いた楕円軌道の形と、軌道上の位置の計算。
 * Home のシーン（features/home/scene/）と、セクションを閉じて Home へ戻る演出（layouts/SectionTransition.astro）の
 * 両方で使う。閉じる演出は Home を表示する前に惑星の位置を知る必要があるため、DOM に依存しない形でここに置く。
 */

/** 公転の順（90°間隔） */
export const PLANET_ORDER = ['career', 'works', 'tech', 'notes'] as const;

/** 1周の秒数 */
export const ORBIT_PERIOD = 110;

/** 保存した角度がない（初めて Home を開いた）ときの公転の角度 */
export const DEFAULT_ORBIT_ANGLE = 0.5;

export interface OrbitGeometry {
  cx: number;
  cy: number;
  /** 楕円の横・縦の半径（px） */
  a: number;
  b: number;
  /** 画面内での傾き（rad） */
  tilt: number;
  /** 惑星の大きさ（px） */
  size: number;
}

/**
 * 画面の大きさから軌道の形を決める。
 * - 縦長の画面：縦に長い軌道にして上下の余白を使う（横長の軌道だと中央の細い帯に惑星が詰まる）
 * - 横長の画面：軌道と惑星の大きさを一緒に変え、ラベルが名前に重ならないようにする。
 *   幅の狭い画面では、名前が軌道に対して大きいため丸い軌道にする
 */
export function orbitGeometry(width: number, height: number): OrbitGeometry {
  const base = { cx: width / 2, cy: height / 2, tilt: -0.1 };
  if (height > width * 1.15) {
    const a = Math.min(width * 0.34, 300);
    return {
      ...base,
      a,
      b: Math.min(height * 0.26, a * 1.6),
      size: Math.max(64, Math.min(150, width * 0.2)),
    };
  }
  const a = Math.min(width * 0.36, height * 0.6, 560);
  return {
    ...base,
    a,
    b: a * (width < 900 ? 0.66 : 0.48),
    size: Math.max(70, Math.min(170, a * 0.34)),
  };
}

/** 軌道上の点。depth は 0 が奥（軌道の上半分）、1 が手前 */
export function orbitPoint(orbit: OrbitGeometry, th: number) {
  const cosT = Math.cos(orbit.tilt);
  const sinT = Math.sin(orbit.tilt);
  const ox = Math.cos(th) * orbit.a;
  const oy = Math.sin(th) * orbit.b;
  return {
    x: orbit.cx + ox * cosT - oy * sinT,
    y: orbit.cy + ox * sinT + oy * cosT,
    depth: (Math.sin(th) + 1) / 2,
  };
}

/** i 番目の惑星の軌道上の角度 */
export const planetAngle = (orbitAngle: number, index: number) =>
  orbitAngle + (index * Math.PI) / 2;

/** 奥行きによる惑星の拡大率（手前ほど大きい） */
export const depthScale = (depth: number) => 0.7 + 0.45 * depth;

// ─── 公転の角度の保存 ─────────────────────────────────────────
// Home を離れても惑星が動き続けているように見せるため、離れた時点の角度と時刻を保存し、
// 戻るときは経過時間の分だけ進めた角度から再開する

const STORAGE_KEY = 'home-orbit';

/** 保存した角度から、now の時点の角度を求める。保存がなければ undefined */
export function restoreOrbitAngle(
  saved: { angle: number; at: number } | null,
  now: number,
): number | undefined {
  if (!saved) return undefined;
  return saved.angle + ((now - saved.at) / 1000) * ((Math.PI * 2) / ORBIT_PERIOD);
}

export function loadOrbitAngle(now = Date.now()): number | undefined {
  try {
    return restoreOrbitAngle(JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null'), now);
  } catch {
    // 保存できない環境（プライベートブラウズ等）では、既定の位置から始める
    return undefined;
  }
}

export function saveOrbitAngle(angle: number, now = Date.now()) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ angle, at: now }));
  } catch {
    // 上と同じ理由で無視する
  }
}
