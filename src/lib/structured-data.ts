/**
 * 検索エンジン向けの構造化データ（JSON-LD）
 *
 * 「Tora29」という名前は同名の別サイト（無関係の飲食店）と重なるため、
 * このサイトの人物が Web Engineer であること・GitHub のアカウントと同一人物であることを検索エンジンに伝える。
 * Home（/）の <head> に出力する（BaseLayout.astro）。ビルド時にのみ呼ぶ。
 */

interface PersonInput {
  name: string;
  role: string;
  intro: string;
  /** 外部リンク（GitHub 等）。同一人物のアカウントとして sameAs に並べる */
  links: { href: string }[];
}

/** Home の JSON-LD。サイト（WebSite）と、その作者（Person）を1つのグラフにまとめる */
export function homeStructuredData(person: PersonInput, site: URL): object {
  const url = site.href;
  // WebSite の author から Person を参照するための識別子
  const personId = `${url}#person`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        url,
        name: person.name,
        inLanguage: 'ja',
        author: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: person.name,
        jobTitle: person.role,
        description: person.intro,
        url,
        sameAs: person.links.map((link) => link.href),
      },
    ],
  };
}

/**
 * <script type="application/ld+json"> にそのまま埋め込める文字列にする。
 * 値に "</script>" が含まれると要素がそこで閉じてしまうため、< をエスケープする（JSON としての意味は変わらない）
 */
export function toJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
