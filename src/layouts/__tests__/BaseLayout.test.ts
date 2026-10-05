import { describe, expect, it } from 'vitest';
import { TEST_SITE, renderAstro } from '@/test/render';
import BaseLayout from '../BaseLayout.astro';

/** path のページとして描画する。ホストは site と異なるものにし、canonical が site を基準にすることも確かめる */
function renderAt(path: string, props: Record<string, unknown> = {}) {
  return renderAstro(BaseLayout, {
    props: { title: 'Page | Tora29', ...props },
    request: new Request(new URL(path, 'http://localhost:4321')),
  });
}

const canonicalOf = (root: HTMLElement) =>
  root.querySelector('link[rel="canonical"]')?.getAttribute('href');

describe('BaseLayout', () => {
  describe('canonical URL', () => {
    it('ビルド時の出力ファイル名（.html）を、公開される URL の形に直す', async () => {
      expect(canonicalOf(await renderAt('/tech/astro.html'))).toBe(`${TEST_SITE}/tech/astro`);
    });

    it('Home（/index.html）はサイトのルートにする', async () => {
      expect(canonicalOf(await renderAt('/index.html'))).toBe(`${TEST_SITE}/`);
    });

    it('.html の付かない URL はそのまま使う', async () => {
      expect(canonicalOf(await renderAt('/works'))).toBe(`${TEST_SITE}/works`);
    });

    it('リクエストのホストではなく site を基準にする', async () => {
      const canonical = canonicalOf(await renderAt('/notes.html'));
      expect(canonical).toBe(`${TEST_SITE}/notes`);
      expect(canonical).not.toContain('localhost');
    });

    it('og:url を canonical と揃える', async () => {
      const root = await renderAt('/career.html');
      expect(root.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
        canonicalOf(root),
      );
    });
  });

  it('description があるときだけ、description と og:description を出す', async () => {
    const withDescription = await renderAt('/about.html', { description: '説明' });
    expect(withDescription.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      '説明',
    );
    expect(
      withDescription.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    ).toBe('説明');

    const without = await renderAt('/about.html');
    expect(without.querySelector('meta[name="description"]')).toBeNull();
    expect(without.querySelector('meta[property="og:description"]')).toBeNull();
  });

  it('OGP の種類は省略すると website、指定すればその種類', async () => {
    const ogType = (root: HTMLElement) =>
      root.querySelector('meta[property="og:type"]')?.getAttribute('content');
    expect(ogType(await renderAt('/works.html'))).toBe('website');
    expect(ogType(await renderAt('/works/foo.html', { ogType: 'article' }))).toBe('article');
  });

  it('構造化データは渡したときだけ JSON-LD として出す', async () => {
    const jsonLd = 'script[type="application/ld+json"]';
    const withData = await renderAt('/index.html', {
      structuredData: { '@type': 'Person', name: 'Tora29' },
    });
    expect(JSON.parse(withData.querySelector(jsonLd)?.textContent ?? '')).toEqual({
      '@type': 'Person',
      name: 'Tora29',
    });

    expect((await renderAt('/about.html')).querySelector(jsonLd)).toBeNull();
  });
});
