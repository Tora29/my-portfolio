/**
 * 背景の星・銀河と、惑星をつなぐ線（.users/requirements/screens.md §4.2・§4.4）
 *
 * - 中央に渦巻きの銀河（ゆっくり回転）。名前の後ろにあり、名前の周りの暗いぼかしで文字を読みやすくする
 * - 星はまたたきながら流れる。手前の星ほど速く動く（視差）
 * - 軌道の線、Career の軌跡（公転の後に残る）、Tech から他の惑星へ伸びる点線
 * - イントロのビッグバン（閃光と衝撃波）。星・銀河は中心から広がるように現れる
 */
import { introElapsed, type IntroTimeline } from './intro';
import { clamp01, easeOutCubic, lerp, pixelRatio } from './math';
import { orbitPoint } from '@/lib/orbit';
import type { Orbit, Planet } from './planets';

/** 星の流れる速さ（px/s。奥 → 手前）と向き（ほぼ横、少し下へ） */
const STAR_DRIFT = { min: 0.6, max: 3.2, dx: -0.96, dy: 0.28 };
/** 星の色。白を多めにし、ときどき青白い星・赤みのある星を混ぜる */
const STAR_TINTS = ['255,255,255', '255,255,255', '200,215,255', '255,230,200'];
/**
 * 銀河の粒子の数。PC の標準的な画面（1440×900）で 4,800 個とし、画面が小さいほど減らす（最少で 30%）。
 * 小さい画面では粒子が詰まって見えるうえ、スマートフォンでは描画の負荷が重くなるため
 */
const galaxyCount = (w: number, h: number) =>
  Math.round(4800 * Math.min(1, Math.max(0.3, (w * h) / (1440 * 900))));

/** 背景のうっすらとした星雲（画面に対する位置・色・濃さ） */
const NEBULAE: [number, number, string, number][] = [
  [0.82, 0.18, '139,92,246', 0.07],
  [0.12, 0.85, '56,189,248', 0.05],
  [0.25, 0.1, '244,114,182', 0.035],
];

/**
 * 星雲と銀河の中心の光（背景の光）は動かないため、画面の大きさが変わったときに1枚の画像へ描いておき、毎フレームはそれを貼るだけにする。
 * 画面全体のグラデーションを毎フレーム何枚も描くと、スマートフォンではそれだけで描画が間に合わず、コマ落ちするため。
 * ぼんやりした光で細部がないため、画素数を減らして描き、引き伸ばして貼る
 */
const BACKDROP_SCALE = 0.5;

/** 星・銀河が広がりきってから、Career の軌跡と Tech の点線が現れきるまでの秒数 */
const LINKS_FADE_IN = 0.6;

interface Star {
  x: number;
  y: number;
  r: number;
  /** 0 が奥、1 が手前。手前ほど明るく速く流れる */
  depth: number;
  phase: number;
  speed: number;
  /** 色（rgb(...)）。濃さは描くときに globalAlpha で付ける */
  color: string;
}

interface GalaxyParticle {
  r: number;
  angle: number;
  /** 回転の速さ。中心に近いほど速い */
  omega: number;
  size: number;
  color: string;
}

export interface Sky {
  resize(): void;
  draw(t: number, scene: { orbit: Orbit; planets: Planet[]; intro: IntroTimeline }): void;
}

export function createSky(canvas: HTMLCanvasElement): Sky {
  const ctx = canvas.getContext('2d')!;
  let W = 0;
  let H = 0;
  let galaxyR = 0;
  let stars: Star[] = [];
  let galaxy: GalaxyParticle[] = [];
  const backdrop = document.createElement('canvas');
  const backdropCtx = backdrop.getContext('2d')!;

  /** 背景の光を描いておく。中心の光は星や銀河と同じく加算で重ねる（draw で貼るときは、この画像全体の濃さだけを変える） */
  function drawBackdrop() {
    backdrop.width = Math.ceil(W * BACKDROP_SCALE);
    backdrop.height = Math.ceil(H * BACKDROP_SCALE);
    const b = backdropCtx;
    b.setTransform(BACKDROP_SCALE, 0, 0, BACKDROP_SCALE, 0, 0);
    for (const [nx, ny, rgb, a] of NEBULAE) {
      const g = b.createRadialGradient(nx * W, ny * H, 0, nx * W, ny * H, Math.max(W, H) * 0.45);
      g.addColorStop(0, `rgba(${rgb},${a})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      b.fillStyle = g;
      b.fillRect(0, 0, W, H);
    }
    b.globalCompositeOperation = 'lighter';
    const cx = W / 2;
    const cy = H / 2;
    const core = b.createRadialGradient(cx, cy, 0, cx, cy, galaxyR * 0.32);
    core.addColorStop(0, 'rgba(255,225,190,0.24)');
    core.addColorStop(0.4, 'rgba(200,170,255,0.08)');
    core.addColorStop(1, 'rgba(0,0,0,0)');
    b.fillStyle = core;
    b.fillRect(0, 0, W, H);
    b.globalCompositeOperation = 'source-over';
  }

  /** 画面の大きさに合わせて、星と銀河・背景の光を作り直す（星の数は画面の広さに比例させる） */
  function resize() {
    const dpr = pixelRatio();
    W = innerWidth;
    H = innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = Array.from({ length: Math.round((W * H) / 2400) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() ** 3 * 1.4 + 0.25,
      depth: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.6,
      color: `rgb(${STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)]})`,
    }));

    // 2本の腕を持つ渦巻き。粒子は中心に集める（d を偏らせる）。中心は暖色、外側は青紫
    galaxyR = Math.max(W, H) * 0.42;
    galaxy = Array.from({ length: galaxyCount(W, H) }, (_, i) => {
      const d = Math.random() ** 1.7;
      const inArm = Math.random() < 0.72;
      const spread = inArm ? (Math.random() - 0.5) * (0.9 - d * 0.45) : Math.random() * Math.PI * 2;
      const warm = Math.max(0, 1 - d * 2.2);
      const violet = Math.random() < 0.3;
      const rgb = [
        Math.round(lerp(violet ? 190 : 140, 255, warm)),
        Math.round(lerp(violet ? 140 : 160, 225, warm)),
        Math.round(lerp(255, 190, warm)),
      ];
      return {
        r: d * galaxyR,
        angle: (i % 2) * Math.PI + d * 4.4 + spread,
        omega: 0.018 / (0.25 + d),
        size: Math.random() * 1.3 + 0.5,
        color: `rgba(${rgb.join(',')},${(0.16 + (1 - d) * 0.5) * (inArm ? 1 : 0.55)})`,
      };
    });

    drawBackdrop();
  }

  /** Career の軌跡：すでに通った軌道上に、薄れていく粒子を残す（歩み） */
  function drawCareerTrail(orbit: Orbit, planets: Planet[]) {
    const career = planets.find((p) => p.key === 'career');
    if (!career) return;
    const N = 70;
    for (let k = 1; k <= N; k++) {
      const pos = orbitPoint(orbit, career.th - k * 0.006);
      const f = 1 - k / N;
      const s = (0.6 + 1.8 * f) * (0.6 + 0.55 * pos.depth);
      ctx.fillStyle = `rgba(${career.rgb},${0.4 * f * f * (0.4 + 0.6 * pos.depth)})`;
      ctx.fillRect(pos.x - s / 2, pos.y - s / 2, s, s);
    }
  }

  /** Tech から他の惑星への点線（つながり）。Tech のホバー中は明るくする。線の上を光が流れる */
  function drawTechLinks(planets: Planet[], t: number) {
    const tech = planets.find((p) => p.key === 'tech');
    if (!tech) return;
    const boost = 1 + 2.5 * tech.hover;
    planets.forEach((p, i) => {
      if (p === tech) return;
      const g = ctx.createLinearGradient(tech.x, tech.y, p.x, p.y);
      g.addColorStop(0, `rgba(${tech.rgb},${Math.min(1, 0.2 * boost)})`);
      g.addColorStop(1, `rgba(${p.rgb},${Math.min(1, 0.1 * boost)})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.moveTo(tech.x, tech.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const u = (t * 0.12 + i * 0.33) % 1;
      ctx.fillStyle = `rgba(${tech.rgb},${Math.min(1, 0.6 * Math.sin(u * Math.PI) * boost)})`;
      ctx.beginPath();
      ctx.arc(lerp(tech.x, p.x, u), lerp(tech.y, p.y, u), 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * 1フレームを描く。
   * 1. ビッグバンの前は何も描かない（暗闇）
   * 2. 星雲・星・銀河。ビッグバンから広がりきるまでは、中心から広がるように描く
   * 3. 軌道の線・Career の軌跡・Tech の点線（惑星が揃ってから）
   * 4. ビッグバンの閃光と衝撃波（暗い画面でまぶしすぎないよう控えめにする）
   */
  function draw(t: number, { orbit, planets, intro }: Parameters<Sky['draw']>[1]) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);

    // 1.
    const it = introElapsed(intro, t);
    if (it < intro.bang) return;
    const e = clamp01((it - intro.bang) / intro.expand);
    const grow = easeOutCubic(e);
    const cx = W / 2;
    const cy = H / 2;

    // 2.
    ctx.globalAlpha = Math.min(1, e * 1.5);
    ctx.drawImage(backdrop, 0, 0, W, H);

    ctx.globalCompositeOperation = 'lighter';
    // 流れ始めるのはビッグバンから（爆発は中心から広がって見えるように）。
    // イントロの前後で同じ基準の時刻を使う。終わった後だけ t（ページを開いてからの秒数）に切り替えると、
    // ページの読み込みにかかった秒数の分だけ、すべての星が一斉に跳んでしまう
    const driftT = Math.max(0, t - intro.start - intro.bang);
    // 星ごとに色の文字列を作ると負荷が大きいため、色は固定し、またたきは globalAlpha で表す
    const baseAlpha = ctx.globalAlpha;
    for (const s of stars) {
      const a = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed));
      const v = STAR_DRIFT.min + (STAR_DRIFT.max - STAR_DRIFT.min) * s.depth;
      const x = (((s.x + driftT * v * STAR_DRIFT.dx) % W) + W) % W;
      const y = (((s.y + driftT * v * STAR_DRIFT.dy) % H) + H) % H;
      ctx.globalAlpha = baseAlpha * a * (0.4 + s.depth * 0.6);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(cx + (x - cx) * grow, cy + (y - cy) * grow, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = baseAlpha;

    // 銀河は傾けて平たくした円盤。ビッグバンの間は外へ渦を巻きながら広がる
    const tilt = -0.42;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    for (const p of galaxy) {
      const a = p.angle + p.omega * t + (1 - grow) * 2.5;
      const x = Math.cos(a) * p.r * grow;
      const y = Math.sin(a) * p.r * 0.38 * grow;
      ctx.fillStyle = p.color;
      ctx.fillRect(cx + x * cosT - y * sinT, cy + x * sinT + y * cosT, p.size, p.size);
    }

    // 3.
    if (orbit.a) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(orbit.cx, orbit.cy, orbit.a * grow, orbit.b * grow, orbit.tilt, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
    }
    // 広がりきってから、軌跡と点線をフェードインさせる（いきなり現れると、そこで画面が切り替わったように見えるため）
    const reveal = clamp01((it - intro.bang - intro.expand) / LINKS_FADE_IN);
    if (reveal > 0) {
      ctx.globalAlpha = reveal;
      drawCareerTrail(orbit, planets);
      drawTechLinks(planets, t);
    }
    ctx.globalAlpha = 1;

    // 4.
    const since = it - intro.bang;
    const maxR = Math.hypot(W, H);
    // 閃光は 0.5 秒で消える。消えた後も画面全体のグラデーションを描き続けると重いため、描くのは消えるまで
    if (since < 0.5) {
      const f = since / 0.5;
      const flash = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        maxR * (0.15 + 0.6 * easeOutCubic(f)),
      );
      flash.addColorStop(0, `rgba(255,255,255,${0.5 * (1 - f)})`);
      flash.addColorStop(0.3, `rgba(220,210,255,${0.22 * (1 - f)})`);
      flash.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = flash;
      ctx.fillRect(0, 0, W, H);
    }
    if (since < 1.6) {
      const w = since / 1.6;
      ctx.strokeStyle = `rgba(255,255,255,${0.4 * (1 - w)})`;
      ctx.lineWidth = 1 + 14 * (1 - w);
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.6 * easeOutCubic(w), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  return { resize, draw };
}
