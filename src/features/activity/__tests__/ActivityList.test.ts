import { describe, expect, it } from 'vitest';
import type { ActivityItem } from '@/lib/load-activity';
import { renderAstro } from '@/test/render';
import { techTags } from '@/test/tech-tags';
import ActivityList from '../ActivityList.astro';
import { ACTIVITY_LIMIT, type ActivityPage } from '../load-activity-page';

const item = (id: string): ActivityItem => ({
  id,
  date: '2026-09-24',
  icon: 'git-pull-request',
  work: { id: 'w', title: 'Portfolio', href: '/works/w' },
  headline: '見出し',
  summary: '要約',
  tags: techTags('ts'),
});

const page = (total: number, filters: ActivityPage['filters'] = []): ActivityPage => ({
  filters,
  groups: [{ date: '2026-09-24', items: [item('a')] }],
  initialGroups: 1,
  total,
});

describe('ActivityList', () => {
  it('Activity がなければ「まだありません」と表示する', async () => {
    const root = await renderAstro(ActivityList, { props: { page: page(0) } });
    expect(root.textContent).toContain('まだありません');
    expect(root.querySelector('[data-activity-list]')).toBeNull();
  });

  it('絞り込みは All と各作品を出し、最初は All を選んだ状態にする', async () => {
    const root = await renderAstro(ActivityList, {
      props: { page: page(1, [{ workId: 'w', label: 'Portfolio', href: '/activity?work=w' }]) },
    });
    const filters = root.querySelectorAll('[data-activity-filter]');
    expect([...filters].map((f) => f.getAttribute('data-activity-filter'))).toEqual(['', 'w']);
    expect(filters[0].getAttribute('aria-current')).toBe('true');
    // 絞り込みは URL を書き換えるだけのため、戻るボタンの記録から外す
    expect(root.querySelector('nav')?.hasAttribute('data-back-ignore')).toBe(true);
  });

  it('作品がなければ絞り込みを出さない', async () => {
    const root = await renderAstro(ActivityList, { props: { page: page(1) } });
    expect(root.querySelector('nav')).toBeNull();
  });

  it('「もっと見る」は初期表示件数を超えるときだけ出す', async () => {
    const few = await renderAstro(ActivityList, { props: { page: page(ACTIVITY_LIMIT) } });
    expect(few.querySelector<HTMLElement>('[data-activity-more]')?.hidden).toBe(true);
    const many = await renderAstro(ActivityList, { props: { page: page(ACTIVITY_LIMIT + 1) } });
    expect(many.querySelector<HTMLElement>('[data-activity-more]')?.hidden).toBe(false);
  });
});
