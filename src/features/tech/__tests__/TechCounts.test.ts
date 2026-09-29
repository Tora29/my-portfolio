import { describe, expect, it } from 'vitest';
import { renderAstro, textOf } from '@/test/render';
import TechCounts from '../TechCounts.astro';

describe('TechCounts', () => {
  it('種類ごとの件数を決まった順に並べる（0件も出す）', async () => {
    const root = await renderAstro(TechCounts, {
      props: { counts: { activity: 5, career: 0, notes: 1, works: 2 } },
    });
    expect(textOf(root)).toBe('Works 2 Notes 1 Career 0 Activity 5');
  });
});
