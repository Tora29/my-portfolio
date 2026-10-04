/**
 * リポジトリ内のファイルの読み書き（作品・Tech の定義、activity.json、除外リスト）
 *
 * ビルド（Content Collections）とは別に、GitHub Actions 上で Node から直接読む。
 * 形式の検証は最小限にとどめる（正しさは、この後に実行するビルドのスキーマ検証で確かめる）。
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'astro/zod';
import { format } from 'prettier';
import { parse } from 'yaml';
import type { Activity, Target } from './types.ts';

export const ROOT = path.resolve(import.meta.dirname, '../..');
const WORKS_DIR = path.join(ROOT, 'content/works');
export const ACTIVITY_FILE = path.join(ROOT, 'data/activity.json');
const EXCLUDED_FILE = path.join(ROOT, 'data/activity-excluded.yml');
const TECH_FILE = path.join(ROOT, 'data/tech.yml');

const workSchema = z.object({
  github: z.object({ owner: z.string(), repo: z.string() }).optional(),
  tech: z.array(z.string()),
});

/** MDX の先頭の frontmatter（--- で囲まれた YAML） */
function frontmatter(source: string): unknown {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  return match ? parse(match[1]) : {};
}

/**
 * 収集対象の Repository（許可リスト。activity-pipeline.md §3.1）。
 * content/works/<id>/index.mdx の github を持つ作品のみ
 */
export async function loadTargets(): Promise<Target[]> {
  const entries = await readdir(WORKS_DIR, { withFileTypes: true });
  const targets: Target[] = [];
  for (const entry of entries.filter((e) => e.isDirectory())) {
    const source = await readFile(path.join(WORKS_DIR, entry.name, 'index.mdx'), 'utf8');
    const work = workSchema.parse(frontmatter(source));
    if (work.github) targets.push({ ...work.github, work: entry.name, tech: work.tech });
  }
  return targets;
}

/** tech.yml に定義された Tech の id */
export async function loadKnownTech(): Promise<Set<string>> {
  const tech = z
    .array(z.object({ id: z.string() }))
    .parse(parse(await readFile(TECH_FILE, 'utf8')));
  return new Set(tech.map((t) => t.id));
}

/** 除外リスト（data/activity-excluded.yml）の id */
export async function loadExcluded(): Promise<Set<string>> {
  // 中身が空（コメントのみ）のファイルは null として読まれる
  const excluded = z
    .array(z.object({ id: z.string(), reason: z.string().optional() }))
    .nullable()
    .parse(parse(await readFile(EXCLUDED_FILE, 'utf8')));
  return new Set((excluded ?? []).map((e) => e.id));
}

/** activity.json を読む。file を省略すると、このリポジトリの data/activity.json */
export async function loadActivity(file = ACTIVITY_FILE): Promise<Activity[]> {
  return JSON.parse(await readFile(file, 'utf8')) as Activity[];
}

/**
 * activity.json を書き出す。
 * Prettier で整形してから書く（確認用 PR の CI でフォーマットの確認に落ちないように）
 */
export async function saveActivity(activity: Activity[]): Promise<void> {
  const json = await format(JSON.stringify(activity), { parser: 'json', filepath: ACTIVITY_FILE });
  await writeFile(ACTIVITY_FILE, json);
}
