/**
 * 惑星の公転と描画（.users/requirements/screens.md §4.2）
 *
 * - 名前を中心とした傾いた楕円軌道を、Career → Works → Tech → Notes の順に90°間隔で公転する
 * - 手前（軌道の下半分）ほど大きく明るく、奥ほど小さく暗く表示する
 * - 各惑星は、表面の粒子（球面上に均等に並べた点）を回転させて描き、セクションごとの模様を持つ
 *
 * 惑星の位置は、HTML のリンク（HomeScene.astro の [data-planet]）を動かして表す。
 * リンクそのものが押せる領域になるため、Canvas の上で当たり判定を計算しなくて済む。
 */
import { clamp01, easeOutCubic, pixelRatio, toRgbTriplet } from './math';
import { introElapsed, type IntroTimeline } from './intro';

export interface Planet {
  key: string;
  wrap: HTMLElement;
  link: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** 惑星の色（"r,g,b"） */
  rgb: string;
  /** ホバーの度合い（0〜1。滑らかに変える） */
  hover: number;
  /** ホバーしているか（hover の目標値） */
  target: number;
  /** 自転の角度 */
  spin: number;
  /** 中心（名前）の方向。中心に向いた面を明るくする */
  light: { x: number; y: number };
  /** Canvas の1辺の画素数と、惑星の半径（画素） */
  px: number;
  R: number;
  dpr: number;
  /** 軌道上の位置・角度・奥行きによる拡大率 */
  x: number;
  y: number;
  th: number;
  ds: number;
}

/**
 * セクションごとの惑星の性格。
 * ring：Works（粒子の輪。作ったもの） / lines：Notes（横縞。文章の行）
 * spiral：Career（極から極へ巻きつく帯。歩み） / network：Tech（ノードを線で結ぶ。つながり）
 * spin・breathe（呼吸の周期）・phase を惑星ごとにずらし、4つが揃って動かないようにする
 */
const TRAITS: Record<
  string,
  {
    spin: number;
    tilt: number;
    roll: number;
    breathe: number;
    phase: number;
    ring?: boolean;
    lines?: boolean;
    spiral?: boolean;
    network?: boolean;
  }
> = {
  works: { spin: 1, tilt: 0.38, roll: -0.25, breathe: 9.5, phase: 0, ring: true },
  notes: { spin: 1.9, tilt: 0.12, roll: 0.35, breathe: 7.2, phase: 1.7, lines: true },
  career: { spin: 0.6, tilt: 0.55, roll: 0.1, breathe: 12.8, phase: 3.9, spiral: true },
  tech: { spin: -1.3, tilt: 0.25, roll: -0.45, breathe: 10.6, phase: 5.2, network: true },
};

/** 自転の基本の速さ（rad/s） */
const SPIN = 0.16;
/** 呼吸するように半径を ±2.5% 変える */
const BREATHE_AMOUNT = 0.025;

/** 呼吸による大きさの倍率。衛星の軌道も同じ倍率で動かす（moons.ts） */
export function planetScale(key: string, t: number): number {
  const trait = TRAITS[key];
  return 1 + BREATHE_AMOUNT * Math.sin((t * Math.PI * 2) / trait.breathe + trait.phase);
}

// ─── 表面の粒子 ─────────────────────────────────────────────

interface SpherePoint {
  lat: number;
  lon: number;
  phase: number;
  white: boolean;
  /** イントロで、散らばった状態から集まってくるときのずれと距離 */
  jx: number;
  jy: number;
  dist: number;
  /** Tech のネットワークのノードか。ノードは描いた位置を proj に記録し、線を引くのに使う */
  node?: boolean;
  v3?: { x: number; y: number; z: number };
  proj?: { x: number; y: number; depth: number };
}

// 球面上に均等に並べた点（フィボナッチ格子）。どの角度から見ても粒子の密度が偏らない
const SPHERE_POINTS: SpherePoint[] = Array.from({ length: 900 }, (_, i) => ({
  lat: Math.asin(1 - (2 * (i + 0.5)) / 900),
  lon: i * 2.399963,
  phase: Math.random() * Math.PI * 2,
  white: Math.random() < 0.12,
  jx: (Math.random() - 0.5) * 1.4,
  jy: (Math.random() - 0.5) * 1.4,
  dist: 0.4 + Math.random() * 0.8,
}));

// Works の輪の粒子
const RING_POINTS = Array.from({ length: 320 }, () => ({
  ang: Math.random() * Math.PI * 2,
  r: 1.5 + Math.random() ** 1.5 * 0.4,
  size: Math.random() * 0.8 + 0.4,
  white: Math.random() < 0.2,
}));

// Tech の表面のネットワーク：均等に間引いた点をノードにし、それぞれ近い2点と結ぶ
const NETWORK_NODES = SPHERE_POINTS.filter((_, i) => i % 32 === 16);
for (const q of NETWORK_NODES) {
  q.node = true;
  q.v3 = {
    x: Math.cos(q.lat) * Math.sin(q.lon),
    y: Math.sin(q.lat),
    z: Math.cos(q.lat) * Math.cos(q.lon),
  };
}
const NETWORK_EDGES: [number, number][] = [];
NETWORK_NODES.forEach((q, i) => {
  NETWORK_NODES.map((o, j) => ({
    j,
    d: (q.v3!.x - o.v3!.x) ** 2 + (q.v3!.y - o.v3!.y) ** 2 + (q.v3!.z - o.v3!.z) ** 2,
  }))
    .filter(({ j }) => j !== i)
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
    .forEach(({ j }) => {
      // 同じ辺を2回引かない
      if (!NETWORK_EDGES.some(([a, b]) => a === j && b === i)) NETWORK_EDGES.push([i, j]);
    });
});

/** 単位球面上の点を回転させる（自転 → 手前への傾き → 画面内での回転） */
function sphere(lat: number, lon: number, spin: number, tilt: number, roll: number) {
  const cl = Math.cos(lat);
  const x = cl * Math.sin(lon + spin);
  const y = Math.sin(lat);
  const z = cl * Math.cos(lon + spin);
  const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
  const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
  return {
    x: x * Math.cos(roll) + y2 * Math.sin(roll),
    y: x * Math.sin(roll) - y2 * Math.cos(roll),
    z: z2,
  };
}

/** Works の輪。back：惑星の奥側（上半分）/ 手前側（下半分）。惑星を挟んで2回に分けて描く */
function drawRing(p: Planet, R: number, c: number, back: boolean, alpha: number) {
  const { ctx, rgb, dpr } = p;
  const roll = TRAITS[p.key].roll;
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  for (const q of RING_POINTS) {
    const a = q.ang + p.spin * 0.35;
    const sa = Math.sin(a);
    if (sa < 0 !== back) continue;
    const x = Math.cos(a) * q.r * R;
    const y = sa * q.r * R * 0.26;
    const s = q.size * dpr * (back ? 0.8 : 1.1);
    ctx.fillStyle = q.white
      ? `rgba(255,255,255,${alpha * (back ? 0.25 : 0.6)})`
      : `rgba(${rgb},${alpha * (back ? 0.3 : 0.75)})`;
    ctx.fillRect(c + x * cr - y * sr - s / 2, c + x * sr + y * cr - s / 2, s, s);
  }
}

/** Tech のネットワーク。奥側の線とノードは薄くする */
function drawNetwork(p: Planet, alpha: number) {
  const { ctx, rgb, dpr } = p;
  ctx.lineWidth = 0.8 * dpr;
  for (const [i, j] of NETWORK_EDGES) {
    const a = NETWORK_NODES[i].proj!;
    const b = NETWORK_NODES[j].proj!;
    const la = alpha * 0.55 * Math.min(a.depth, b.depth) ** 2 * (1 + p.hover);
    if (la < 0.02) continue;
    ctx.strokeStyle = `rgba(${rgb},${Math.min(1, la)})`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  for (const q of NETWORK_NODES) {
    const { x, y, depth } = q.proj!;
    const na = alpha * depth ** 2;
    if (na < 0.02) continue;
    ctx.fillStyle = `rgba(${rgb},${Math.min(1, na * 0.5)})`;
    ctx.beginPath();
    ctx.arc(x, y, (1.6 + 1.6 * depth) * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${Math.min(1, na)})`;
    ctx.beginPath();
    ctx.arc(x, y, (0.6 + 0.7 * depth) * dpr, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 1つの惑星を描く。
 * 1. 背景を暗くする円と、惑星の色のにじみ（星や銀河の上でも粒子が見えるように）
 * 2. 表面の粒子。中心に向いた面を明るく、奥の粒子を暗く小さくする。セクションごとの模様を濃淡で付ける
 * 3. Tech のネットワークと Works の輪の手前側
 */
function drawPlanet(p: Planet, t: number, intro: IntroTimeline) {
  const { ctx, px, rgb, light, dpr } = p;
  const trait = TRAITS[p.key];
  const R = p.R * planetScale(p.key, t);
  const c = px / 2;
  const h = p.hover;
  // イントロでは、ビッグバンの直後に散らばった粒子が集まって惑星になる。イントロ後は常に 1
  const form = easeOutCubic(clamp01((introElapsed(intro, t) - intro.bang - 0.1) / 1.3));
  if (form <= 0) return;

  if (trait.ring) {
    ctx.globalCompositeOperation = 'lighter';
    drawRing(p, R, c, true, form);
    ctx.globalCompositeOperation = 'source-over';
  }

  // 1.
  ctx.globalAlpha = form;
  const core = ctx.createRadialGradient(c, c, 0, c, c, R * 1.04);
  core.addColorStop(0, 'rgba(6,6,11,0.8)');
  core.addColorStop(0.85, 'rgba(6,6,11,0.75)');
  core.addColorStop(1, 'rgba(6,6,11,0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(c, c, R * 1.04, 0, Math.PI * 2);
  ctx.fill();

  const glow = ctx.createRadialGradient(c, c, 0, c, c, R * 1.1);
  glow.addColorStop(0, `rgba(${rgb},${0.16 + 0.1 * h})`);
  glow.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, px, px);
  ctx.globalAlpha = 1;

  // 2.
  ctx.globalCompositeOperation = 'lighter';
  for (const q of SPHERE_POINTS) {
    const v = sphere(q.lat, q.lon, p.spin, trait.tilt, trait.roll);
    // ホバー中は粒子が少し膨らんで揺らぐ
    let expand = 1 + h * (0.1 + 0.07 * Math.sin(t * 2 + q.phase));
    const bx = (1 - form) * q.jx * R;
    const by = (1 - form) * q.jy * R;
    expand *= 1 + (1 - form) * (1.5 + q.dist * 1.5);
    const depth = (v.z + 1) / 2;
    const lit = 0.65 + 0.7 * Math.max(0, v.x * light.x + v.y * light.y);
    let a = Math.min(1, (0.15 + depth * depth) * lit) * form;
    if (trait.lines) a *= Math.cos(q.lat * 15) > 0.15 ? 1.2 : 0.3;
    // 螺旋の帯は、帯に沿ってゆっくり流れる
    if (trait.spiral)
      a = Math.min(1, a * (Math.cos(q.lon - q.lat * 5 + t * 0.6) > 0.55 ? 1.6 : 0.3));
    // ネットワークを目立たせるため、表面の粒子は控えめにする
    if (trait.network) a *= 0.65;
    const size = (0.5 + 1.4 * depth) * dpr;
    const sx = c + v.x * R * expand + bx;
    const sy = c + v.y * R * expand + by;
    if (q.node) q.proj = { x: sx, y: sy, depth };
    ctx.fillStyle = q.white ? `rgba(255,255,255,${a})` : `rgba(${rgb},${a})`;
    ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
  }

  // 3.
  if (trait.network) drawNetwork(p, form);
  if (trait.ring) drawRing(p, R, c, false, form);
  ctx.globalCompositeOperation = 'source-over';
}

// ─── 公転 ───────────────────────────────────────────────────

/**
 * 軌道。中心の周りの傾いた楕円で、下半分が手前。
 * period：1周の秒数 / tilt：画面内での傾き / flatten：横長の画面での縦横比
 */
export interface Orbit {
  period: number;
  tilt: number;
  flatten: number;
  /** 公転の角度。ページを離れても続きから再開できるよう、保存・復元する（scene.ts） */
  angle: number;
  /** 公転の速さの倍率（ホバー中はほぼ止める） */
  speed: number;
  a: number;
  b: number;
  cx: number;
  cy: number;
  /** 惑星の大きさ（px） */
  size: number;
  last: number | null;
}

export const createOrbit = (angle = 0.5): Orbit => ({
  period: 110,
  tilt: -0.1,
  flatten: 0.48,
  angle,
  speed: 1,
  a: 0,
  b: 0,
  cx: 0,
  cy: 0,
  size: 0,
  last: null,
});

/** 軌道上の点。depth は 0 が奥、1 が手前 */
export function orbitPoint(orbit: Orbit, th: number) {
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

/** 惑星の要素を読み取り、描画の状態を作る */
export function createPlanets(root: HTMLElement): Planet[] {
  return [...root.querySelectorAll<HTMLElement>('[data-planet]')].map((wrap) => {
    const link = wrap.querySelector<HTMLElement>('a')!;
    const canvas = wrap.querySelector<HTMLCanvasElement>('[data-planet-canvas]')!;
    const planet: Planet = {
      key: wrap.dataset.planet!,
      wrap,
      link,
      canvas,
      ctx: canvas.getContext('2d')!,
      rgb: toRgbTriplet(getComputedStyle(wrap).getPropertyValue('--p')),
      hover: 0,
      target: 0,
      spin: Math.random() * Math.PI * 2,
      light: { x: 0, y: -1 },
      px: 0,
      R: 0,
      dpr: 1,
      x: 0,
      y: 0,
      th: 0,
      ds: 1,
    };
    // 要素ごとページ遷移で破棄されるため、解除は不要
    const on = () => (planet.target = 1);
    const off = () => (planet.target = 0);
    link.addEventListener('mouseenter', on);
    link.addEventListener('mouseleave', off);
    link.addEventListener('focus', on);
    link.addEventListener('blur', off);
    return planet;
  });
}

/** 画面の大きさに合わせて、軌道と惑星の大きさを決める */
export function layoutPlanets(orbit: Orbit, planets: Planet[]) {
  const dpr = pixelRatio();
  orbit.cx = innerWidth / 2;
  orbit.cy = innerHeight / 2;
  if (innerHeight > innerWidth * 1.15) {
    // 縦長の画面：縦に長い軌道にして、画面の上下の余白を使う（横長の軌道だと中央の細い帯に惑星が詰まる）
    orbit.a = Math.min(innerWidth * 0.34, 300);
    orbit.b = Math.min(innerHeight * 0.26, orbit.a * 1.6);
    orbit.size = Math.max(64, Math.min(150, innerWidth * 0.2));
  } else {
    // 軌道と惑星の大きさを一緒に変え、どの画面の大きさでもラベルが名前に重ならないようにする
    orbit.a = Math.min(innerWidth * 0.36, innerHeight * 0.6, 560);
    // 幅の狭い画面では、名前が軌道に対して大きいため、丸い軌道にする
    orbit.b = orbit.a * (innerWidth < 900 ? 0.66 : orbit.flatten);
    orbit.size = Math.max(70, Math.min(170, orbit.a * 0.34));
  }
  for (const p of planets) {
    p.wrap.style.width = p.wrap.style.height = `${orbit.size}px`;
    p.dpr = dpr;
    p.px = Math.round(p.canvas.offsetWidth * dpr);
    p.canvas.width = p.canvas.height = p.px;
    p.R = (p.link.offsetWidth / 2) * dpr;
  }
}

/**
 * 公転を進め、惑星の要素を軌道上に置く。
 * ホバー中はほぼ止めて押しやすくする。タッチ端末はホバーがないため、常にゆっくり回す
 */
export function updateOrbit(orbit: Orbit, planets: Planet[], t: number, coarsePointer: boolean) {
  // タブを離れて戻ったときに一気に進まないよう、1フレームの経過時間に上限を設ける
  const dt = orbit.last === null ? 0 : Math.min(t - orbit.last, 0.1);
  orbit.last = t;
  const hovering = planets.some((p) => p.target > 0);
  const target = hovering ? 0.06 : coarsePointer ? 0.12 : 1;
  orbit.speed += (target - orbit.speed) * 0.06;
  orbit.angle += dt * ((Math.PI * 2) / orbit.period) * orbit.speed;

  planets.forEach((p, i) => {
    const th = orbit.angle + (i * Math.PI) / 2;
    const { x, y, depth } = orbitPoint(orbit, th);
    p.ds = 0.7 + 0.45 * depth;
    p.x = x;
    p.y = y;
    p.th = th;
    p.wrap.style.transform = `translate3d(${x - orbit.size / 2}px, ${y - orbit.size / 2}px, 0)`;
    // 手前にある惑星は名前より前を通る
    p.wrap.style.zIndex = depth > 0.5 ? '30' : '5';
    p.wrap.style.setProperty('--ds', p.ds.toFixed(3));
    p.wrap.style.setProperty('--depth-opacity', (0.7 + 0.3 * depth).toFixed(3));
    p.wrap.style.setProperty('--r', `${(orbit.size / 2) * p.ds}px`);

    const dx = orbit.cx - x;
    const dy = orbit.cy - y;
    const len = Math.hypot(dx, dy) || 1;
    p.light = { x: dx / len, y: dy / len };
  });
}

/** すべての惑星を描く。dt は前のフレームからの秒数 */
export function drawPlanets(planets: Planet[], t: number, dt: number, intro: IntroTimeline) {
  for (const p of planets) {
    p.hover += (p.target - p.hover) * 0.08;
    // ホバー中は自転を速めて、押せることを伝える
    p.spin += dt * SPIN * TRAITS[p.key].spin * (1 + 2.5 * p.hover);
    p.ctx.clearRect(0, 0, p.px, p.px);
    drawPlanet(p, t, intro);
  }
}
