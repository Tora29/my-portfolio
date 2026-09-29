/**
 * 惑星の衛星（.users/requirements/screens.md §4.2）
 *
 * 衛星の数は、そのセクションの件数（data-moons。load-home.ts）に連動する。中身が増えるほど惑星がにぎやかになる。
 * 衛星は惑星の要素の中に置いた小さな円で、傾いた楕円軌道を回る。軌道の手前側では惑星より前に出る。
 */
import { planetScale, type Planet } from './planets';

interface Moon {
  el: HTMLElement;
  planet: Planet;
  /** 軌道の半径（惑星の半径に対する倍率） */
  a: number;
  b: number;
  /** 軌道の傾き（rad） */
  rad: number;
  /** 公転の速さ（rad/s。向きを交互に変える） */
  speed: number;
  phase: number;
}

/**
 * 惑星ごとの衛星の軌道。seed を惑星ごとに変え、同じ数の衛星でも軌道がそろわないようにする。
 * 1つ目の衛星だけを大きくし、残りは小さくする（数が多いときにうるさくならないように）
 */
const moonConfigs = (count: number, seed: number) =>
  Array.from({ length: count }, (_, i) => ({
    a: 1.1 + 0.06 * i,
    b: 0.22 + 0.06 * ((i * 7 + seed) % 4),
    tilt: -30 + ((i * 37 + seed * 23) % 60),
    speed: (i % 2 ? -1 : 1) * (0.35 + 0.12 * ((i + seed) % 4)),
    size: i === 0 ? 5.5 : 3 + ((i + seed) % 3),
    phase: i * 2.1 + seed,
  }));

const SEEDS: Record<string, number> = { works: 0, notes: 1, career: 3, tech: 4 };

/** 衛星の要素を作って惑星に加える。要素は惑星と一緒にページ遷移で破棄される */
export function createMoons(planets: Planet[]): Moon[] {
  return planets.flatMap((planet) =>
    moonConfigs(Number(planet.wrap.dataset.moons ?? 0), SEEDS[planet.key] ?? 0).map((cfg) => {
      const el = document.createElement('div');
      el.setAttribute('aria-hidden', 'true');
      el.className =
        'pointer-events-none absolute top-1/2 left-1/2 rounded-full bg-radial-[at_35%_30%] from-white via-(--p)/95 via-45% to-bg shadow-[0_0_8px_var(--p)] transition-opacity duration-300 will-change-transform';
      el.style.width = el.style.height = `${cfg.size}px`;
      el.style.margin = `${-cfg.size / 2}px 0 0 ${-cfg.size / 2}px`;
      planet.wrap.append(el);
      return {
        el,
        planet,
        a: cfg.a,
        b: cfg.b,
        rad: (cfg.tilt * Math.PI) / 180,
        speed: cfg.speed,
        phase: cfg.phase,
      };
    }),
  );
}

/** 衛星を動かす。惑星の呼吸と奥行きによる拡大率に合わせて、軌道の大きさも変える */
export function updateMoons(moons: Moon[], t: number, visible: boolean) {
  for (const m of moons) {
    if (!visible) {
      m.el.style.opacity = '0';
      continue;
    }
    // 惑星の半径は layoutPlanets で求めた値を使う（毎フレーム offsetWidth を読むと、
    // 直前に書き換えた惑星の位置のためにレイアウトの再計算が走り、重くなるため）
    const R = (m.planet.R / m.planet.dpr) * planetScale(m.planet.key, t) * m.planet.ds;
    const ang = m.phase + m.speed * t;
    const x = Math.cos(ang) * m.a * R;
    const y = Math.sin(ang) * m.b * R;
    // 楕円の下半分は惑星より手前
    const front = Math.sin(ang) > 0;
    const X = x * Math.cos(m.rad) - y * Math.sin(m.rad);
    const Y = x * Math.sin(m.rad) + y * Math.cos(m.rad);
    m.el.style.transform = `translate(${X}px, ${Y}px) scale(${front ? 1 : 0.75})`;
    m.el.style.zIndex = front ? '3' : '0';
    m.el.style.opacity = front ? '1' : '0.4';
  }
}
