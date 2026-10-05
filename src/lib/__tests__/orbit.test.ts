import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_ORBIT_ANGLE,
  entryCircle,
  loadOrbitAngle,
  orbitGeometry,
  orbitPoint,
  saveOrbitAngle,
} from '../orbit';

describe('orbitGeometry', () => {
  it('縦長の画面では、縦に長い軌道にする', () => {
    const orbit = orbitGeometry(390, 844);
    expect(orbit.b).toBeGreaterThan(orbit.a);
  });

  it('横長の画面では、横に長い軌道にする', () => {
    const orbit = orbitGeometry(1280, 800);
    expect(orbit.a).toBeGreaterThan(orbit.b);
  });
});

describe('orbitPoint', () => {
  it('軌道の下側（sin が正）を手前とする', () => {
    const orbit = { cx: 0, cy: 0, a: 100, b: 50, tilt: 0, size: 80 };
    expect(orbitPoint(orbit, Math.PI / 2)).toMatchObject({ x: expect.closeTo(0), y: 50, depth: 1 });
    expect(orbitPoint(orbit, -Math.PI / 2).depth).toBe(0);
  });
});

describe('entryCircle', () => {
  it('惑星のセクションは、その惑星の軌道上の位置', () => {
    const orbit = orbitGeometry(1280, 800);
    const circle = entryCircle('career', 1280, 800, 0);
    // career は公転の先頭（角度 0 = 軌道の右端）
    expect(circle.x).toBeCloseTo(orbitPoint(orbit, 0).x);
    expect(circle.y).toBeCloseTo(orbitPoint(orbit, 0).y);
  });

  it('90°ずつずれた位置に、公転の順で惑星が並ぶ', () => {
    const orbit = orbitGeometry(1280, 800);
    expect(entryCircle('works', 1280, 800, 0).x).toBeCloseTo(orbitPoint(orbit, Math.PI / 2).x);
  });

  it('About は中央、Activity は右下（幅の狭い画面では下の中央）', () => {
    expect(entryCircle('about', 1280, 800, 0)).toMatchObject({ x: 640, y: 400 });
    expect(entryCircle('activity', 1280, 800, 0).x).toBeGreaterThan(1000);
    expect(entryCircle('activity', 390, 844, 0).x).toBe(195);
  });
});

describe('loadOrbitAngle / saveOrbitAngle', () => {
  // Vitest の環境は node で sessionStorage がないため、Map で代わりを用意する
  function stubStorage() {
    const store = new Map<string, string>();
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    });
    return store;
  }

  // 保存のキーは orbit.ts の中に閉じているため、一度保存してからそのキーの値を書き換える
  function stubSavedValue(raw: string) {
    const store = stubStorage();
    saveOrbitAngle(1);
    const [key] = store.keys();
    store.set(key, raw);
  }

  function stubThrowingStorage() {
    vi.stubGlobal('sessionStorage', {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    });
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('保存した角度を読み出せる', () => {
    stubStorage();
    saveOrbitAngle(2.25);
    expect(loadOrbitAngle()).toBe(2.25);
  });

  it('保存がないときは既定の角度', () => {
    stubStorage();
    expect(loadOrbitAngle()).toBe(DEFAULT_ORBIT_ANGLE);
  });

  it('保存した値が数値でないときは既定の角度', () => {
    stubSavedValue(JSON.stringify('1.5'));
    expect(loadOrbitAngle()).toBe(DEFAULT_ORBIT_ANGLE);
    stubSavedValue(JSON.stringify({ angle: 1.5 }));
    expect(loadOrbitAngle()).toBe(DEFAULT_ORBIT_ANGLE);
  });

  it('保存した値が JSON として壊れているときは既定の角度', () => {
    stubSavedValue('{broken');
    expect(loadOrbitAngle()).toBe(DEFAULT_ORBIT_ANGLE);
  });

  it('sessionStorage が使えない（読み出しで例外が出る）ときは既定の角度', () => {
    stubThrowingStorage();
    expect(loadOrbitAngle()).toBe(DEFAULT_ORBIT_ANGLE);
  });

  it('保存で例外が出ても、呼び出し側に例外を投げない', () => {
    stubThrowingStorage();
    expect(() => saveOrbitAngle(1.5)).not.toThrow();
  });
});
