import { describe, expect, it } from 'vitest';
import { ORBIT_PERIOD, orbitGeometry, orbitPoint, restoreOrbitAngle } from './orbit';

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

describe('restoreOrbitAngle', () => {
  it('離れていた時間の分だけ公転を進める', () => {
    const saved = { angle: 1, at: 0 };
    expect(restoreOrbitAngle(saved, ORBIT_PERIOD * 1000)).toBeCloseTo(1 + Math.PI * 2);
  });

  it('保存がなければ undefined', () => {
    expect(restoreOrbitAngle(null, 0)).toBeUndefined();
  });
});
