/**
 * 宇宙のシーンの開始と停止（.users/requirements/screens.md §4）
 *
 * HomeScene.astro のスクリプトから、Home を開くたびに startScene を呼び、離れるときに返り値の stop で止める。
 * ClientRouter によるページ遷移ではページが読み込み直されないため、止めないと
 * requestAnimationFrame とイベントリスナーが遷移のたびに重複する（astro-components.md）。
 *
 * このシーンは Home だけで動き、他の機能から import しない（directory-structure.md）。
 */
import { loadOrbitAngle, saveOrbitAngle } from '@/lib/orbit';
import { finishedIntro, type IntroTimeline } from './intro';
import { createMoons, updateMoons } from './moons';
import { createOrbit, createPlanets, drawPlanets, layoutPlanets, updateOrbit } from './planets';
import { createSky } from './sky';

export interface SceneOptions {
  /** イントロ。省略すると、完成した状態から始める */
  intro?: IntroTimeline;
  /** 止めた状態で始める（1枚だけ描く） */
  paused?: boolean;
}

export interface Scene {
  /** 描画とイベントリスナーをすべて止める（Home を離れるとき） */
  stop(): void;
  /**
   * 動きを止める・再開する（停止ボタン。WCAG 2.2.2）。
   * 止めている間の時間は数えず、再開したときに星や惑星が飛ばないようにする
   */
  setPaused(paused: boolean): void;
}

/** シーンを始める。止めた状態で始めたときや、止めている間は、画面の大きさが変わったときだけ描き直す */
export function startScene(root: HTMLElement, options: SceneOptions = {}): Scene {
  const coarsePointer = matchMedia('(pointer: coarse)');
  const intro = options.intro ?? finishedIntro();

  const skyCanvas = root.querySelector<HTMLCanvasElement>('[data-sky]')!;
  const sky = createSky(skyCanvas);
  const orbit = createOrbit(loadOrbitAngle());
  const planets = createPlanets(root);
  const moons = createMoons(planets);

  // 惑星の要素の位置と見た目をシーンが引き継ぐ（HomeScene.astro の group-data-scene の切り替え）
  root.dataset.scene = '';

  const layout = () => {
    sky.resize();
    layoutPlanets(orbit, planets);
  };
  layout();

  let paused = options.paused ?? false;
  let frameId = 0;
  let lastT: number | null = null;
  /** 止めていた時間の合計（秒）。シーンの時刻から差し引く */
  let pausedTotal = 0;
  let pausedAt = 0;

  const sceneTime = (now: number) => now / 1000 - pausedTotal;

  const draw = (now: number) => {
    const t = sceneTime(now);
    const dt = lastT === null ? 0 : Math.min(t - lastT, 0.1);
    lastT = t;
    updateOrbit(orbit, planets, t, coarsePointer.matches);
    sky.draw(t, { orbit, planets, intro });
    updateMoons(moons, t, intro.done || t - intro.start > intro.bang);
    drawPlanets(planets, t, dt, intro);
  };
  /**
   * タッチ端末（スマートフォン・タブレット）では、1秒に30回だけ描く。
   * 動きはゆっくり（公転は1周110秒）なので30回でも滑らかに見え、描画の負荷と電池の消費が半分になる
   */
  const minInterval = coarsePointer.matches ? 1000 / 30 : 0;
  let lastDrawn = -Infinity;
  const frame = (now: number) => {
    // 描く間隔の端数で間引きが偏らないよう、少し早めに来たフレームも描く
    if (now - lastDrawn >= minInterval - 4) {
      lastDrawn = now;
      draw(now);
    }
    if (!paused) frameId = requestAnimationFrame(frame);
  };

  const onResize = () => {
    layout();
    if (paused) draw(pausedAt * 1000);
  };
  window.addEventListener('resize', onResize);

  if (paused) {
    pausedAt = performance.now() / 1000;
    draw(performance.now());
  } else {
    frameId = requestAnimationFrame(frame);
  }

  return {
    stop() {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      saveOrbitAngle(orbit.angle);
    },
    setPaused(next) {
      if (next === paused) return;
      paused = next;
      if (paused) {
        cancelAnimationFrame(frameId);
        pausedAt = performance.now() / 1000;
      } else {
        pausedTotal += performance.now() / 1000 - pausedAt;
        frameId = requestAnimationFrame(frame);
      }
    },
  };
}
