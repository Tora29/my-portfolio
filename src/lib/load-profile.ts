/**
 * プロフィール（data/profile.yml）と経験年数の読み込み
 *
 * About・Career・Home・Notes で使う。ビルド時（ページの生成時）にのみ呼ぶ。
 * 外部リンクを探す処理（findLink）は profile-links.ts に置く。
 */
import { getCollection, getEntry } from 'astro:content';
import { formatExperience, yearsOfExperience } from './experience';

/** プロフィール。profile.yml はトップレベルの profile: の下に書く（content.config.ts） */
export async function loadProfile() {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('data/profile.yml に profile がありません');
  return entry.data;
}

/**
 * 経験年数の表示（例：約5年）。
 * 基準はビルドした年。Activity の更新で毎日ビルドされるため、年が変われば自然に更新される
 */
export async function loadExperience(): Promise<string> {
  const career = await getCollection('career');
  return formatExperience(
    yearsOfExperience(
      career.map((e) => e.data.period),
      new Date().getFullYear(),
    ),
  );
}
