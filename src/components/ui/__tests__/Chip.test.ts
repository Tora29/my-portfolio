import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import Chip from '../Chip.astro';

describe('Chip', () => {
  it('href があればリンクにする', async () => {
    const root = await renderAstro(Chip, { props: { label: 'TypeScript', href: '/tech/ts' } });
    const link = root.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/tech/ts');
    expect(link?.textContent).toBe('TypeScript');
  });

  it('href がなければ押せないタグとして表示する', async () => {
    const root = await renderAstro(Chip, { props: { label: 'TypeScript' } });
    expect(root.querySelector('a')).toBeNull();
    expect(root.querySelector('span')?.textContent).toBe('TypeScript');
  });
});
