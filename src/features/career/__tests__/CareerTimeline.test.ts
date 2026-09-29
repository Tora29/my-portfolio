import { describe, expect, it } from 'vitest';
import { renderAstro } from '@/test/render';
import { techTags } from '@/test/tech-tags';
import CareerTimeline from '../CareerTimeline.astro';
import type { CareerPage } from '../load-career';

const page: CareerPage = {
  career: [
    { period: '2024 —', org: 'B社', role: 'Engineer', summary: '要約B', tags: techTags('ts') },
    { period: '2020 — 2024', org: 'A社', role: 'Engineer', summary: '要約A', tags: techTags() },
  ],
  certifications: [],
  extraCertifications: [],
};

describe('CareerTimeline', () => {
  it('職歴を渡された順に並べる', async () => {
    const root = await renderAstro(CareerTimeline, { props: { page } });
    const orgs = [...root.querySelectorAll('ol > li h2')].map((h) => h.firstChild?.textContent);
    expect(orgs.map((o) => o?.trim())).toEqual(['B社', 'A社']);
  });

  it('資格がなければ Certifications・Extra を出さない', async () => {
    const root = await renderAstro(CareerTimeline, { props: { page } });
    expect(root.textContent).not.toContain('Certifications');
    expect(root.textContent).not.toContain('Extra');
  });

  it('資格を出し、IT 系以外の資格は1行にまとめる', async () => {
    const root = await renderAstro(CareerTimeline, {
      props: {
        page: { ...page, certifications: ['資格1', '資格2'], extraCertifications: ['X', 'Y'] },
      },
    });
    expect(root.querySelectorAll('section li')).toHaveLength(2);
    expect(root.textContent).toContain('X · Y');
  });
});
