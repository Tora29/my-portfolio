/**
 * プロフィールの外部リンク（data/profile.yml の links）から、特定のサービスのリンクを探す
 *
 * Home の GitHub・Notes の Zenn のように、特定のサービスへのリンクを決まった場所に出すときに使う。
 * このファイルは Astro に依存しない純粋な関数だけを置く（単体テストの対象）。
 * profile.yml の読み込みは load-profile.ts が行う。
 */

/**
 * 外部リンクのうち、指定したホスト名のサービスのものの URL。なければ undefined。
 * ラベルは表記を変えることがあるため、ホスト名で探す。
 * ホスト名は完全一致で比べる（www.github.com や gist.github.com は github.com として扱わない）。
 * 同じサービスのリンクが複数あるときは、先に書いたものを返す
 */
export function findLink(links: { href: string }[], hostname: string): string | undefined {
  return links.find((link) => new URL(link.href).hostname === hostname)?.href;
}
