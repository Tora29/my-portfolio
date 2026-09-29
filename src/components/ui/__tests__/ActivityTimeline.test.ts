import { describe, expect, it } from 'vitest';
import type { ActivityItem } from '@/lib/load-activity';
import { renderAstro } from '@/test/render';
import { techTags } from '@/test/tech-tags';
import ActivityTimeline from '../ActivityTimeline.astro';

const item = (id: string, date: string): ActivityItem => ({
  id,
  date,
  icon: 'git-pull-request',
  work: { id: 'portfolio', title: 'Portfolio', href: '/works/portfolio' },
  headline: `見出し ${id}`,
  summary: `要約 ${id}`,
  tags: techTags('astro'),
});

const groups = [
  { date: '2026-09-24', items: [item('a', '2026-09-24'), item('b', '2026-09-24')] },
  { date: '2026-09-20', items: [item('c', '2026-09-20')] },
];

describe('ActivityTimeline', () => {
  it('日付ごとにまとめ、各行に作品へのリンク・要約・作品の id を出す', async () => {
    const root = await renderAstro(ActivityTimeline, { props: { groups } });
    const dates = root.querySelectorAll('[data-activity-date]');
    expect([...dates].map((d) => d.querySelector('time')?.getAttribute('datetime'))).toEqual([
      '2026-09-24',
      '2026-09-20',
    ]);
    const first = dates[0].querySelector('[data-activity-item]');
    expect(first?.getAttribute('data-work')).toBe('portfolio');
    expect(first?.querySelector('a')?.getAttribute('href')).toBe('/works/portfolio');
    expect(first?.textContent).toContain('要約 a');
  });

  it('extraFrom 以降の日付のまとまりだけに data-extra を付ける', async () => {
    const root = await renderAstro(ActivityTimeline, { props: { groups, extraFrom: 1 } });
    const dates = root.querySelectorAll('[data-activity-date]');
    expect(dates[0].hasAttribute('data-extra')).toBe(false);
    expect(dates[1].hasAttribute('data-extra')).toBe(true);
  });

  it('extraFrom がなければ畳む対象を作らない', async () => {
    const root = await renderAstro(ActivityTimeline, { props: { groups } });
    expect(root.querySelector('[data-extra]')).toBeNull();
  });
});
