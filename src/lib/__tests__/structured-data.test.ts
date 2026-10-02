import { describe, expect, it } from 'vitest';
import { homeStructuredData, toJsonLd } from '../structured-data';

const person = {
  name: 'Tester',
  role: 'Web Engineer',
  intro: '紹介文',
  links: [{ href: 'https://github.com/tester' }, { href: 'https://example.com/tester' }],
};

describe('homeStructuredData', () => {
  it('外部リンクを同一人物のアカウントとして sameAs に並べる', () => {
    const data = homeStructuredData(person, new URL('https://example.net')) as {
      '@graph': Record<string, unknown>[];
    };
    const p = data['@graph'].find((node) => node['@type'] === 'Person');
    expect(p?.sameAs).toEqual(['https://github.com/tester', 'https://example.com/tester']);
    expect(p?.jobTitle).toBe('Web Engineer');
    expect(p?.url).toBe('https://example.net/');
  });

  it('WebSite の author が Person を参照する', () => {
    const data = homeStructuredData(person, new URL('https://example.net')) as {
      '@graph': Record<string, unknown>[];
    };
    const site = data['@graph'].find((node) => node['@type'] === 'WebSite');
    const p = data['@graph'].find((node) => node['@type'] === 'Person');
    expect(site?.author).toEqual({ '@id': p?.['@id'] });
  });
});

describe('toJsonLd', () => {
  it('値に含まれる </script> で要素が閉じないようにする', () => {
    const json = toJsonLd({ description: '</script><script>alert(1)</script>' });
    expect(json).not.toContain('</script>');
    expect(JSON.parse(json)).toEqual({ description: '</script><script>alert(1)</script>' });
  });
});
