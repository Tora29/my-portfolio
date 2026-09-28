/**
 * 要約の抽出（.users/design/activity-pipeline.md §4.3）
 *
 * PR 本文は「最初の段落 = 閲覧者向けの要約、見出し以降 = 実装の詳細」という書き方をする
 * （.claude/rules/git-workflow.md、.github/pull_request_template.md）。
 * そのため、最初の見出しより前にある最初の段落だけを要約にする。
 */

/** 要約の最大文字数。一覧で数行に収まる長さ */
export const SUMMARY_MAX_LENGTH = 200;

/**
 * PR テンプレートの要約欄の定型文。書き換えられていなければ要約がないものとみなす。
 * .github/pull_request_template.md を変えたときは、ここも合わせる
 */
export const TEMPLATE_PLACEHOLDER = '（ここに要約を書く）';

/** Markdown の書式を取り除き、読める文だけにする */
function toPlainText(paragraph: string): string {
  return (
    paragraph
      // 画像は代替テキストも含めて除く（要約の文として読めないため）
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      // リンクは文字だけを残す
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // URL だけの記述は除く
      .replace(/<?https?:\/\/\S+>?/g, '')
      // 強調・コードの記号を除く
      .replace(/(\*\*|__|`)/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/** 長すぎる要約を切る。途中で切ったことが分かるよう末尾に … を付ける */
function truncate(text: string): string {
  const chars = [...text];
  return chars.length <= SUMMARY_MAX_LENGTH
    ? text
    : `${chars.slice(0, SUMMARY_MAX_LENGTH - 1).join('')}…`;
}

/**
 * 本文から要約を取り出す。
 * 1. HTML コメント（テンプレートの書き方の説明）を除く
 * 2. 最初の見出しより前だけを対象にする
 * 3. 段落（空行区切り）のうち、箇条書き・チェックリスト・引用・表・コードではない最初のものを選ぶ
 * 4. 見つからない、または定型文のままなら fallback（見出し）を使う
 */
export function extractSummary(body: string | null, fallback: string): string {
  if (!body) return fallback;

  // 1.
  const text = body.replace(/<!--[\s\S]*?-->/g, '').replace(/\r\n/g, '\n');

  // 2. コードブロックの中の # を見出しと誤認しないよう、先にコードブロックを除く
  const withoutCode = text.replace(/```[\s\S]*?```/g, '\n\n');
  const beforeHeading = withoutCode.split(/^#{1,6}\s/m)[0];

  // 3.
  const isNotProse = /^\s*([-*+]\s|\d+[.)]\s|>|\||\[[ xX]\])/;
  const paragraph = beforeHeading
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p !== '' && !isNotProse.test(p));
  const plain = paragraph ? toPlainText(paragraph) : '';

  // 4.
  if (plain === '' || plain === TEMPLATE_PLACEHOLDER) return fallback;
  return truncate(plain);
}
