/**
 * 宇宙のシーンの開始と停止（.users/requirements/screens.md §4）
 *
 * HomeScene.astro のスクリプトから、Home を開くたびに startScene を呼び、離れるときに返り値の関数で止める。
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
}

/**
 * シーンを始める。返り値の関数を呼ぶと、描画とイベントリスナーをすべて止める。
 * prefers-reduced-motion のときは、動かさずに1枚だけ描く（画面の大きさが変わったら描き直す）
 */
export function startScene(root: HTMLElement, options: SceneOptions = {}): () => void {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  let frameId = 0;
  let lastT: number | null = null;
  const frame = (now: number) => {
    const t = now / 1000;
    const dt = lastT === null ? 0 : Math.min(t - lastT, 0.1);
    lastT = t;
    updateOrbit(orbit, planets, t, coarsePointer.matches);
    sky.draw(t, { orbit, planets, intro });
    updateMoons(moons, t, intro.done || t - intro.start > intro.bang);
    drawPlanets(planets, t, dt, intro);
    if (!reducedMotion) frameId = requestAnimationFrame(frame);
  };

  const onResize = () => {
    layout();
    if (reducedMotion) frame(performance.now());
  };
  window.addEventListener('resize', onResize);
  frameId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize);
    saveOrbitAngle(orbit.angle);
  };
}
