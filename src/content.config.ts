/**
 * Content Collections の定義とスキーマ
 *
 * content/ と data/ のファイルをビルド時に読み込み、ここで定義したスキーマで検証する。
 * 項目の不足・型の誤り・存在しない Tech や作品への参照は、すべてビルドエラーになる。
 * コンテンツの項目を増やすときは、このファイルも同時に更新する。
 *
 * 設計：.users/design/engineering-graph.md §3・§5、書き方：.claude/rules/content-authoring.md
 */
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';

/**
 * YAML の配列を読み込み、記述順を order として持たせる。
 *
 * getCollection は記述順を保証しない（id のアルファベット順で返ることがある）。
 * Tech やジャンルは記述順を表示順として使うため、読み込み時に順番を記録しておく。
 */
const orderedYaml = (fileName: string) =>
  file(fileName, {
    parser: (text) =>
      (parse(text) as Record<string, unknown>[]).map((item, order) => ({ ...item, order })),
  });

/**
 * 1件1フォルダのコンテンツ（content/<種類>/<id>/index.mdx）を読み込む。
 * フォルダ名をそのまま id（URL）にする。
 * content/_drafts/ は base の外にあるため読み込まれない（下書きが公開されない）
 */
const byFolder = (base: string) =>
  glob({
    base,
    pattern: '*/index.mdx',
    generateId: ({ entry }) => entry.split('/')[0],
  });

/**
 * Tech の参照。data/tech.yml の id だけを受け付ける。
 * 表示名（TypeScript）や別名（TS）で書くとビルドエラーになるため、表記ゆれが起きない
 */
const techRefs = z.array(reference('tech'));

/** Tech のジャンル（data/tech-categories.yml）。記述順が Tech 一覧での表示順になる */
const techCategories = defineCollection({
  loader: orderedYaml('data/tech-categories.yml'),
  schema: z.object({
    name: z.string(),
    order: z.number(),
  }),
});

/** Tech の一覧（data/tech.yml）。すべてのコンテンツが参照する Tech の唯一の定義元 */
const tech = defineCollection({
  loader: orderedYaml('data/tech.yml'),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    // 未定義のジャンルはビルドエラー
    category: reference('techCategories'),
    // 上位 Tech（例：Azure OpenAI Service → Azure）。循環参照は Engineering Graph の生成時に検出する
    parent: reference('tech').optional(),
  }),
});

/** 作品（content/works/<id>/index.mdx） */
const works = defineCollection({
  loader: byFolder('content/works'),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        // 一覧に出る1〜2文
        summary: z.string(),
        status: z.enum(['developing', 'active', 'archived']),
        // ここに書いた Repository だけが Activity の収集対象になる
        github: z.object({ owner: z.string(), repo: z.string() }).optional(),
        tech: techRefs,
        cover: image().optional(),
        coverAlt: z.string().optional(),
      })
      // 画像には必ず代替テキストを付ける（書き忘れをビルドで防ぐ）
      .refine((work) => !work.cover || work.coverAlt, {
        message: 'cover を指定したときは coverAlt も書く',
        path: ['coverAlt'],
      }),
});

/** 記事（content/notes/<id>/index.mdx） */
const notes = defineCollection({
  loader: byFolder('content/notes'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // 大きく改訂したときのみ
    updated: z.coerce.date().optional(),
    // 記事の大分類。1記事に1つ
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
    // 一覧・OGP に使う1〜2文
    summary: z.string(),
    // この記事が扱う作品（作品ページの Related Notes に優先して表示される）
    works: z.array(reference('works')).default([]),
  }),
});

/** 職歴（content/career/*.yml。1社1ファイル。URL は持たない） */
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

/**
 * Activity（data/activity.json）。GitHub のマージ済み PR・Release から自動生成する。
 * 手で編集するのは確認用 PR（bot/activity）上のみ
 */
const activity = defineCollection({
  loader: file('data/activity.json'),
  schema: z.object({
    // 日本時間の日付（YYYY-MM-DD）
    date: z.iso.date(),
    type: z.enum(['feature', 'fix', 'improvement', 'docs', 'pr', 'release']),
    // Repository を介して紐付く作品
    work: reference('works'),
    headline: z.string(),
    summary: z.string(),
    tech: techRefs,
    // Tech の付け方。label：PR の tech:<id> ラベル / work：作品の Tech を引き継いだ
    techSource: z.enum(['label', 'work']),
    // 元の PR・Release の URL
    url: z.url(),
  }),
});

/**
 * プロフィール（data/profile.yml）。About・Career・Home で使う。
 * file ローダーはオブジェクトのキーを id として扱うため、全体をトップレベルの `profile:` の下に書く
 */
const profile = defineCollection({
  loader: file('data/profile.yml'),
  schema: z.object({
    name: z.string(),
    // 職種（Home の左下に表示）
    role: z.string(),
    // 現在の役割。経験年数は職歴から計算するためここには書かない
    current: z.string(),
    intro: z.string(),
    strengths: techRefs,
    // 大切にしていること
    values: z.array(z.string()),
    // 目指す方向
    next: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.url() })),
    // IT 系の資格
    certifications: z.array(z.string()),
    // IT 系以外の資格（小さく1行で表示する）
    extraCertifications: z.array(z.string()).default([]),
  }),
});

export const collections = { techCategories, tech, works, notes, career, activity, profile };
