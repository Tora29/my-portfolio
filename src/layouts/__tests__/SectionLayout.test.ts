import { describe, expect, it } from 'vitest';
import { SECTIONS } from '@/lib/sections';
import { renderAstro, textOf } from '@/test/render';
import SectionLayout from '../SectionLayout.astro';

function render(props: Record<string, unknown>) {
  return renderAstro(SectionLayout, { props, slots: { default: '<p>本文</p>' } });
}

/** 下部の Prev / Next のリンク（href とテキスト） */
function adjacentLinks(root: HTMLElement) {
  const nav = root.querySelector('nav[aria-label="前後のセクション"]');
  return [...(nav?.querySelectorAll('a') ?? [])].map((a) => ({
    href: a.getAttribute('href'),
    text: textOf(a),
  }));
}

/** 見出しの下のリード文。見出し（アイコンと h1 の行）の直後の段落 */
function leadOf(root: HTMLElement) {
  const next = root.querySelector('h1')?.parentElement?.nextElementSibling;
  return next?.tagName === 'P' ? textOf(next) : undefined;
}

describe('SectionLayout', () => {
  describe('前後のセクション（Prev / Next）', () => {
    it('先頭のセクション（About）には Prev を出さず、Next だけ出す', async () => {
      expect(adjacentLinks(await render({ section: 'about' }))).toEqual([
        { href: '/career', text: 'Next Career' },
      ]);
    });

    it('途中のセクションには、タブ順で前後のセクションへのリンクを出す', async () => {
      expect(adjacentLinks(await render({ section: 'works' }))).toEqual([
        { href: '/career', text: 'Prev Career' },
        { href: '/tech', text: 'Next Tech' },
      ]);
    });

    it('最後のセクション（Activity）には Next を出さず、Prev だけ出す', async () => {
      expect(adjacentLinks(await render({ section: 'activity' }))).toEqual([
        { href: '/notes', text: 'Prev Notes' },
      ]);
    });
  });

  it('タブは現在のセクションだけを aria-current="page" にする', async () => {
    const root = await render({ section: 'tech' });
    const current = root.querySelectorAll('nav[aria-label="セクション"] [aria-current="page"]');
    expect([...current].map((a) => a.getAttribute('href'))).toEqual(['/tech']);
  });

  describe('一覧ページ（title なし）', () => {
    it('見出しをセクション名にし、リード文を見出しの下と description に出す', async () => {
      const root = await render({ section: 'works' });
      expect(textOf(root.querySelector('h1'))).toBe('Works');
      expect(root.querySelector('title')?.textContent).toBe('Works | Tora29');
      expect(leadOf(root)).toBe(SECTIONS.works.lead);
      expect(root.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
        SECTIONS.works.lead,
      );
    });

    it('リード文が空のセクション（About）は、リード文も description も出さない', async () => {
      const root = await render({ section: 'about' });
      expect(leadOf(root)).toBeUndefined();
      expect(root.querySelector('meta[name="description"]')).toBeNull();
    });

    it('本文の範囲（data-back-scope）にはセクション名を付ける', async () => {
      const root = await render({ section: 'works' });
      expect(root.querySelector('[data-back-scope]')?.getAttribute('data-back-scope')).toBe(
        'Works',
      );
    });
  });

  describe('詳細ページ（title あり）', () => {
    it('見出しをタイトルにし、<title> はタイトル・セクション名・サイト名の順にする', async () => {
      const root = await render({ section: 'works', title: 'My Work' });
      expect(textOf(root.querySelector('h1'))).toBe('My Work');
      expect(root.querySelector('title')?.textContent).toBe('My Work | Works | Tora29');
    });

    it('lead を省略すると、セクションのリード文を出さない', async () => {
      const root = await render({ section: 'works', title: 'My Work' });
      expect(leadOf(root)).toBeUndefined();
      expect(root.querySelector('meta[name="description"]')).toBeNull();
    });

    it('lead を指定すると見出しの下に出し、description がなければ description にも使う', async () => {
      const root = await render({ section: 'works', title: 'My Work', lead: '作品の説明' });
      expect(leadOf(root)).toBe('作品の説明');
      expect(root.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
        '作品の説明',
      );
    });

    it('description を指定すると、リード文より優先して description に使う', async () => {
      const root = await render({
        section: 'works',
        title: 'My Work',
        lead: '作品の説明',
        description: '検索結果向けの説明',
      });
      expect(root.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
        '検索結果向けの説明',
      );
    });

    it('本文の範囲（data-back-scope）にはタイトルを付ける', async () => {
      const root = await render({ section: 'works', title: 'My Work' });
      expect(root.querySelector('[data-back-scope]')?.getAttribute('data-back-scope')).toBe(
        'My Work',
      );
    });

    it('back を指定すると、戻るボタンの既定の戻り先にする', async () => {
      const root = await render({
        section: 'works',
        title: 'My Work',
        back: { href: '/works', label: 'Works' },
      });
      const back = root.querySelector<HTMLAnchorElement>('[data-back]');
      expect(back?.getAttribute('href')).toBe('/works');
      expect(back?.hidden).toBe(false);
    });
  });
});
