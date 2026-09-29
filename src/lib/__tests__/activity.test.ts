import { describe, expect, it } from 'vitest';
import { activityHref, groupByDate, initialCount } from '../activity';

const item = (date: string, id: string) => ({ date, id });

describe('groupByDate', () => {
  it('同じ日付をまとめ、並びを保つ', () => {
    const groups = groupByDate([
      item('2026-09-24', 'a'),
      item('2026-09-24', 'b'),
      item('2026-09-20', 'c'),
    ]);
    expect(groups.map((g) => [g.date, g.items.map((i) => i.id)])).toEqual([
      ['2026-09-24', ['a', 'b']],
      ['2026-09-20', ['c']],
    ]);
  });
});

describe('initialCount', () => {
  const items = [
    item('2026-09-24', 'a'),
    item('2026-09-23', 'b'),
    item('2026-09-23', 'c'),
    item('2026-09-23', 'd'),
    item('2026-09-20', 'e'),
  ];

  it('日付の境目なら limit 件で区切る', () => {
    expect(initialCount(items, 1)).toBe(1);
  });

  it('同じ日付の途中では区切らず、その日の最後まで含める', () => {
    expect(initialCount(items, 2)).toBe(4);
  });

  it('全件が limit 以下なら全件', () => {
    expect(initialCount(items, 20)).toBe(5);
  });
});

describe('activityHref', () => {
  it('作品を指定すると絞り込みのクエリを付ける', () => {
    expect(activityHref('personal-platform')).toBe('/activity?work=personal-platform');
    expect(activityHref()).toBe('/activity');
  });
});
