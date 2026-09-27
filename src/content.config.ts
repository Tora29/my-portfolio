import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 項目の意味と検証の方針は .users/design/engineering-graph.md §3・§5 を参照

/** 1件1フォルダのコンテンツ。フォルダ名を id にする（content/_drafts/ は base の外なので読み込まない） */
const byFolder = (base: string) =>
  glob({
    base,
    pattern: '*/index.mdx',
    generateId: ({ entry }) => entry.split('/')[0],
  });

const techRefs = z.array(reference('tech'));

const techCategories = defineCollection({
  loader: file('data/tech-categories.yml'),
  schema: z.object({
    name: z.string(),
  }),
});

const tech = defineCollection({
  loader: file('data/tech.yml'),
  schema: z.object({
    name: z.string(),
    category: reference('techCategories'),
    parent: reference('tech').optional(),
  }),
});

const works = defineCollection({
  loader: byFolder('content/works'),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        status: z.enum(['developing', 'active', 'archived']),
        // ここに書いたRepositoryだけがActivityの収集対象になる
        github: z.object({ owner: z.string(), repo: z.string() }).optional(),
        tech: techRefs,
        cover: image().optional(),
        coverAlt: z.string().optional(),
      })
      .refine((work) => !work.cover || work.coverAlt, {
        message: 'cover を指定したときは coverAlt も書く',
        path: ['coverAlt'],
      }),
});

const notes = defineCollection({
  loader: byFolder('content/notes'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum([
      'Backend',
      'Frontend',
      'Infrastructure',
      'Architecture',
      'AI',
      'Career',
      'Misc',
    ]),
    tags: techRefs,
    summary: z.string(),
    works: z.array(reference('works')).default([]),
  }),
});

const career = defineCollection({
  loader: glob({ base: 'content/career', pattern: '*.yml' }),
  schema: z.object({
    // 在籍期間は年単位。現職は end: null
    period: z.object({
      start: z.number().int(),
      end: z.number().int().nullable(),
    }),
    // 企業名は書かず業態で表記する
    org: z.string(),
    role: z.string(),
    summary: z.string(),
    // 先頭6個が常に表示されるため、重要なものから並べる
    tech: techRefs,
  }),
});

const activity = defineCollection({
  loader: file('data/activity.json'),
  schema: z.object({
    date: z.iso.date(),
    type: z.enum(['feature', 'fix', 'improvement', 'docs', 'pr', 'release']),
    work: reference('works'),
    headline: z.string(),
    summary: z.string(),
    tech: techRefs,
    techSource: z.enum(['label', 'work']),
    url: z.url(),
  }),
});

// data/profile.yml はトップレベルの `profile:` の下に書く（file ローダーではキーが id になるため）
const profile = defineCollection({
  loader: file('data/profile.yml'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    current: z.string(),
    intro: z.string(),
    strengths: techRefs,
    values: z.array(z.string()),
    next: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.url() })),
    certifications: z.array(z.string()),
    // IT系以外の資格（小さく1行で表示する）
    extraCertifications: z.array(z.string()).default([]),
  }),
});

export const collections = { techCategories, tech, works, notes, career, activity, profile };
