/**
 * Home の惑星の軌道（.users/requirements/screens.md §4.2）
 *
 * 名前を中心とした傾いた楕円軌道の形と、軌道上の位置の計算。
 * Home のシーン（features/home/scene/）と、セクションを開く・閉じる演出・セクションの背景の光
 * （layouts/SectionTransition.astro）の両方で使う。セクションのページからも惑星の位置を知る必要があるため、
 * DOM に依存しない形でここに置く。
 */

/**
 * Home の惑星になるセクションと、その公転の順（90°間隔）。
 * Home の惑星の並び（load-home.ts）と、開閉の演出の行き先（entryCircle）の両方がこの順を使う。
 * 別々に持つと、閉じたときに縮んでいく先が実際の惑星の位置とずれるため、ここだけで定義する
 */
export const PLANET_ORDER = ['career', 'works', 'tech', 'notes'] as const;

export type PlanetId = (typeof PLANET_ORDER)[number];

export const isPlanetId = (id: string): id is PlanetId =>
  (PLANET_ORDER as readonly string[]).includes(id);

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

/** 円（中心と半径）。セクションの入口の位置と大きさを表す */
export interface Circle {
  x: number;
  y: number;
  r: number;
}

/**
 * Home での、セクションの入口の位置（width × height の画面）。
 * セクションを閉じるときの戻り先と、セクションのページの背景の光の位置に使う。
 * - Career / Works / Tech / Notes：公転の角度 angle にあるその惑星
 * - Activity：右下（幅の狭い画面では下の中央）の最新 Activity
 * - それ以外（About）：中央の名前
 */
export function entryCircle(section: string, width: number, height: number, angle: number): Circle {
  if (isPlanetId(section)) {
    const index = PLANET_ORDER.indexOf(section);
    const orbit = orbitGeometry(width, height);
    const point = orbitPoint(orbit, planetAngle(angle, index));
    return { x: point.x, y: point.y, r: (orbit.size / 2) * depthScale(point.depth) };
  }
  if (section === 'activity') {
    // HomeScene.astro の右下の配置（sm 以上は右寄せ、未満は下の中央）に合わせる
    const wide = width >= 640;
    return { x: wide ? width - 160 : width / 2, y: height - (wide ? 44 : 26), r: 12 };
  }
  return { x: width / 2, y: height / 2, r: 60 };
}

// ─── 公転の角度の保存 ─────────────────────────────────────────
// セクションを開いている間は公転を止める。離れた時点の角度を保存し、
// 開いた位置・セクションの背景の光・閉じて戻る惑星が、すべて同じ位置になるようにする
// （公転を進めると、ページを移るたびに光の位置がずれ、閉じたときも開いた場所と違う位置へ縮んでしまう）

const STORAGE_KEY = 'home-orbit';

/** 保存した角度。保存がない・読めないときは既定の角度 */
export function loadOrbitAngle(): number {
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    return typeof saved === 'number' ? saved : DEFAULT_ORBIT_ANGLE;
  } catch {
    // 保存できない環境（プライベートブラウズ等）では、既定の位置から始める
    return DEFAULT_ORBIT_ANGLE;
  }
}

/** 公転の角度を保存する。保存できない環境では何もしない */
export function saveOrbitAngle(angle: number) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(angle));
  } catch {
    // 上と同じ理由で無視する
  }
}
