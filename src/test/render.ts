/**
 * .astro コンポーネントの単体テスト用の描画
 *
 * Astro の Container API でコンポーネントを HTML に描画し、happy-dom で DOM として読めるようにする。
 * テストでは見た目（クラス）ではなく、要素・属性・テキストの有無を確かめる（testing.md）。
 * テストからのみ使う。ページやコンポーネントから import しない
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';

type AstroComponent = Parameters<AstroContainer['renderToString']>[0];

interface RenderOptions {
  props?: Record<string, unknown>;
  /** 名前付きスロットの HTML。既定のスロットは default */
  slots?: Record<string, string>;
}

let container: AstroContainer | undefined;

/** コンポーネントを描画し、描画結果を子に持つ要素を返す */
export async function renderAstro(
  Component: AstroComponent,
  options: RenderOptions = {},
): Promise<HTMLElement> {
  container ??= await AstroContainer.create();
  const html = await container.renderToString(Component, options);
  const { document } = new Window();
  document.body.innerHTML = html;
  return document.body as unknown as HTMLElement;
}

/**
 * 要素のテキストを、テキストノードごとに空白1つで区切って返す。
 * 描画結果には要素の間の空白が残らないため、textContent では「Works」と「2」が「Works2」とつながってしまう
 */
export function textOf(element: Element | null | undefined): string {
  if (!element) return '';
  const texts: string[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === 3) texts.push(node.textContent ?? '');
    node.childNodes.forEach(walk);
  };
  walk(element);
  return texts.join(' ').replace(/\s+/g, ' ').trim();
}
