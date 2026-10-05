import { describe, expect, it } from 'vitest';
import { findLink } from '../profile-links';

describe('findLink', () => {
  const links = [
    { label: 'GitHub', href: 'https://github.com/example' },
    { label: 'Zenn', href: 'https://zenn.dev/example' },
  ];

  it('ホスト名が一致するリンクの URL を返す', () => {
    expect(findLink(links, 'zenn.dev')).toBe('https://zenn.dev/example');
  });

  it('ラベルではなくホスト名で探す（ラベルの表記が変わっても見つかる）', () => {
    const renamed = [{ label: 'ソースコード', href: 'https://github.com/example' }];
    expect(findLink(renamed, 'github.com')).toBe('https://github.com/example');
  });

  it('該当するリンクがなければ undefined', () => {
    expect(findLink(links, 'x.com')).toBeUndefined();
    expect(findLink([], 'github.com')).toBeUndefined();
  });

  it('ホスト名は完全一致で比べる（サブドメインやパスに含まれるだけのものは対象外）', () => {
    expect(
      findLink(
        [{ href: 'https://gist.github.com/example' }, { href: 'https://example.com/github.com' }],
        'github.com',
      ),
    ).toBeUndefined();
  });

  it('同じサービスのリンクが複数あるときは、先に書いたものを返す', () => {
    expect(
      findLink(
        [{ href: 'https://github.com/first' }, { href: 'https://github.com/second' }],
        'github.com',
      ),
    ).toBe('https://github.com/first');
  });
});
