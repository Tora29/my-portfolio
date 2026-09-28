/**
 * イントロ（WELCOME → ビッグバン → 名前）の時間の進み方（.users/requirements/screens.md §4.5）
 *
 * シーンの各部分（星・銀河・惑星）は、ここで決めた時刻を見て、ビッグバンの前は描かず、
 * ビッグバンから広がるように描く。イントロが終わった後（done）は常に完成した状態で描く。
 */

export interface IntroTimeline {
  /** 名前が光り始める時刻（秒） */
  charge: number;
  /** ビッグバンの時刻（秒） */
  bang: number;
  /** ビッグバンから星・銀河が広がりきるまでの時間（秒） */
  expand: number;
  /** イントロを終えて操作できるようにする時刻（秒） */
  settle: number;
  /** イントロを始めた時刻（performance.now() / 1000） */
  start: number;
  done: boolean;
}

/** 初めての訪問 */
export const FULL_INTRO = { charge: 1.5, bang: 1.9, expand: 1.4, settle: 3.3 };
/** 2回目以降の訪問。何度も見る人（採用の担当者など）を待たせない */
export const QUICK_INTRO = { charge: 0.3, bang: 0.45, expand: 1.0, settle: 1.4 };

/** イントロを再生しない（終わった状態から始める） */
export const finishedIntro = (): IntroTimeline => ({
  ...FULL_INTRO,
  start: 0,
  done: true,
});

/** イントロを始めてからの秒数。終わっていれば Infinity（すべての演出が完了した状態で描く） */
export const introElapsed = (intro: IntroTimeline, t: number) =>
  intro.done ? Infinity : t - intro.start;

/** イントロを始める。quick は2回目以降の訪問（短縮版） */
export const createIntro = (quick: boolean, start: number): IntroTimeline => ({
  ...(quick ? QUICK_INTRO : FULL_INTRO),
  start,
  done: false,
});

/**
 * イントロを進める。返り値の関数で途中で止める（タイマーとイベントリスナーを解除する）。
 * 1. 時刻に合わせて root の data-intro を dark → charge → bang と進める（見た目は HomeScene.astro の CSS）
 * 2. settle の時刻、またはクリック・キー操作で終える（data-intro を消し、操作できるようにする）
 */
export function runIntro(root: HTMLElement, intro: IntroTimeline): () => void {
  const timers: number[] = [];
  const at = (sec: number, fn: () => void) => timers.push(window.setTimeout(fn, sec * 1000));

  const cleanup = () => {
    timers.forEach(clearTimeout);
    window.removeEventListener('pointerdown', skip);
    window.removeEventListener('keydown', skip);
  };
  const finish = () => {
    if (intro.done) return;
    intro.done = true;
    cleanup();
    delete root.dataset.intro;
    delete root.dataset.introSpeed;
  };
  function skip(event: Event) {
    finish();
    // スキップのためのクリックで、その下の惑星が開かないようにする（直後の click を1回だけ打ち消す）
    if (event.type === 'pointerdown') {
      window.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        { capture: true, once: true },
      );
    }
  }

  // 1.
  at(intro.charge, () => (root.dataset.intro = 'charge'));
  at(intro.bang, () => (root.dataset.intro = 'bang'));
  // 2.
  at(intro.settle, finish);
  window.addEventListener('pointerdown', skip);
  window.addEventListener('keydown', skip);

  return cleanup;
}
