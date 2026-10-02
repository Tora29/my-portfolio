/**
 * Zenn の記事（articles/）とサイトの対応付け
 *
 * 記事の本文は Zenn で公開し、サイトには一覧と Tech・作品とのつながりだけを出す。
 * 記事には Zenn の topics だけを書き、ここで tech.yml の Tech に読み替える（タグを2か所に書かずに済むように）。
 * content.config.ts の読み込み時（ビルド時）と、記事へのリンクを作るときに使う。
 */

/**
 * Zenn の記事一覧の URL。data/profile.yml の Zenn のリンクと揃える。
 * 記事の URL を作るたびに profile.yml を読み込まずに済むよう、定数として持つ
 */
const ZENN_ARTICLES_URL = 'https://zenn.dev/tora29/articles';

/** Zenn のスラッグの規則。合わないと Zenn への同期が失敗する */
const ZENN_SLUG = /^[a-z0-9_-]{12,50}$/;

/**
 * articles/ のファイル名（例：static-first-portfolio.md）から、Notes の id になるスラッグを返す。
 * Zenn のスラッグの規則（英小文字・数字・ハイフン・アンダースコアの12〜50字）に合わなければエラーを投げ、ビルドを止める。
 * Zenn への同期はマージしたあとに動くため、失敗に気づくのが遅れないよう、PR の CI の時点で止める
 */
export function zennSlugFromFile(file: string): string {
  const slug = file.replace(/\.md$/, '');
  if (!ZENN_SLUG.test(slug)) {
    throw new Error(
      `記事のファイル名は、英小文字・数字・ハイフン・アンダースコアの12〜50字にする（Zenn のスラッグの規則）：articles/${file}`,
    );
  }
  return slug;
}

/** Zenn の記事の URL。スラッグは articles/ のファイル名（Notes の id） */
export const zennArticleUrl = (slug: string) => `${ZENN_ARTICLES_URL}/${slug}`;

/**
 * Tech に対応する Zenn の topic。Zenn の topics には記号を使えないため、id からハイフンを除く
 * （claude-code → claudecode、github-actions → githubactions）
 */
export const zennTopicOf = (techId: string) => techId.replaceAll('-', '');

/**
 * 記事の topics のうち、Tech に対応するものの id を topics の順で返す。
 * Tech に対応しない topics（「個人開発」など Zenn で読者に届けるためのもの）は無視する。
 * TypeScript / typescript のような大文字・小文字の違いでつながりが切れないよう、小文字に揃えて照合する
 */
export function techIdsFromTopics(topics: string[], techIds: string[]): string[] {
  const byTopic = new Map(techIds.map((id) => [zennTopicOf(id), id]));
  return [...new Set(topics.flatMap((topic) => byTopic.get(topic.toLowerCase()) ?? []))];
}
