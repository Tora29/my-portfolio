/**
 * イントロ（WELCOME → ビッグバン → 名前）の時間の進み方（.users/requirements/screens.md §4.5）
 *
 * シーンの各部分（星・銀河・惑星）は、ここで決めた時刻を見て、ビッグバンの前は描かず、
 * ビッグバンから広がるように描く。
 * settle の時刻で操作できるようにした後も、広がりや衝撃波の続きは実時間のまま描き切る
 * （その時点で完成した状態に切り替えると、描きかけの演出が一瞬で飛んで見えるため）。
 * 完成した状態へ一気に飛ばすのは、イントロを再生しないときとスキップしたときだけ。
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
  /** イントロを終えて操作できるようになったか */
  done: boolean;
  /** 完成した状態で描くか（イントロを再生しない・スキップした）。自然に終えたときは false のまま */
  skipped: boolean;
}

/**
 * イントロの時刻。訪問者の多く（採用の担当者など）は一度しか来ないため、初回から待たせない長さにする。
 * WELCOME を一度読める間（charge まで）だけ取り、約2秒で操作できるようにする
 */
export const INTRO = { charge: 0.9, bang: 1.2, expand: 1.2, settle: 2.3 };

/** イントロを再生しない（終わった状態から始める） */
export const finishedIntro = (): IntroTimeline => ({
  ...INTRO,
  start: 0,
  done: true,
  skipped: true,
});

/** イントロを始めてからの秒数。スキップしていれば Infinity（すべての演出が完了した状態で描く） */
export const introElapsed = (intro: IntroTimeline, t: number) =>
  intro.skipped ? Infinity : t - intro.start;

/** イントロを始める */
export const createIntro = (start: number): IntroTimeline => ({
  ...INTRO,
  start,
  done: false,
  skipped: false,
});

/**
 * イントロを進める。返り値の関数で途中で止める（タイマーとイベントリスナーを解除する）。
 * 1. 時刻に合わせて root の data-intro を dark → charge → bang と進める（見た目は HomeScene.astro の CSS）
 * 2. settle の時刻、またはクリック・キー操作で終える（data-intro を消し、操作できるようにする）。
 *    クリック・キー操作のときは、演出の続きを待たずに完成した状態へ飛ばす
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
  };
  function skip(event: Event) {
    intro.skipped = true;
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
