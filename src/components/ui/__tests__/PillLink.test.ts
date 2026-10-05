import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import PillLink from '../PillLink.astro';

describe('PillLink', () => {
  it('data-* や aria-current などの属性を、そのままリンクに付ける', async () => {
    const root = await renderAstro(PillLink, {
      props: { href: '/activity', 'data-activity-filter': '', 'aria-current': 'true' },
      slots: { default: 'All' },
    });
    const link = root.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/activity');
    expect(link?.getAttribute('data-activity-filter')).toBe('');
    expect(link?.getAttribute('aria-current')).toBe('true');
    expect(link?.textContent).toBe('All');
  });
});
