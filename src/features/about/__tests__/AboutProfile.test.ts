import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import { techTags } from '@/test/tech-tags';
import AboutProfile from '../AboutProfile.astro';
import type { AboutPage } from '../load-about';

const page: AboutPage = {
  name: 'Tora',
  headline: ['Engineer', 'Tokyo'],
  intro: '',
  strengths: techTags('ts'),
  values: ['小さく作る'],
  next: 'AI',
  links: [{ label: 'GitHub', href: 'https://github.com/example', icon: 'github-logo' }],
  latestActivity: [],
};

const activity: AboutPage['latestActivity'] = [
  {
    date: '2026-09-24',
    items: [
      {
        id: 'a',
        date: '2026-09-24',
        icon: 'git-pull-request',
        work: { id: 'w', title: 'Portfolio', href: '/works/w' },
        headline: '見出し',
        summary: '要約',
        tags: techTags('ts'),
      },
    ],
  },
];

describe('AboutProfile', () => {
  it('職種を区切り記号でつなぎ、外部リンクは新しいタブで開く', async () => {
    const root = await renderAstro(AboutProfile, { props: { page } });
    expect(root.textContent).toMatch(/Engineer\s*·\s*Tokyo/);
    const link = root.querySelector('a[href="https://github.com/example"]');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener');
  });

  it('Activity がないときは Latest Activity を見出しごと出さない', async () => {
    const root = await renderAstro(AboutProfile, { props: { page } });
    expect(root.textContent).not.toContain('Latest Activity');
    expect(root.querySelector('a[href="/activity"]')).toBeNull();
  });

  it('Activity があれば Latest Activity と一覧へのリンクを出す', async () => {
    const root = await renderAstro(AboutProfile, {
      props: { page: { ...page, latestActivity: activity } },
    });
    expect(root.textContent).toContain('Latest Activity');
    expect(root.querySelectorAll('[data-activity-item]')).toHaveLength(1);
    expect(root.querySelector('a[href="/activity"]')).not.toBeNull();
  });
});
