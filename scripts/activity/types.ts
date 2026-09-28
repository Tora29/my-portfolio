/**
 * Activity の生成で扱う型
 *
 * 出力（data/activity.json の1件）の形は src/content.config.ts の activity スキーマと一致させる。
 * スキーマを変えたときは、ここも同時に直す（ビルド時にスキーマで検証されるため、ずれるとビルドが失敗する）
 *
 * 設計：.users/design/activity-pipeline.md §5.1
 */

export type ActivityType = 'feature' | 'fix' | 'improvement' | 'docs' | 'pr' | 'release';

export interface Activity {
  /** {owner}/{repo}#{PR番号}、Release は {owner}/{repo}@{tag_name}。一意かつ不変 */
  id: string;
  /** 日本時間の日付（YYYY-MM-DD） */
  date: string;
  type: ActivityType;
  /** 紐付く作品の id */
  work: string;
  headline: string;
  summary: string;
  tech: string[];
  techSource: 'label' | 'work';
  url: string;
}

/** 収集対象の Repository と、紐付く作品 */
export interface Target {
  owner: string;
  repo: string;
  work: string;
  /** 作品の Tech（PR に tech ラベルがないときに引き継ぐ） */
  tech: string[];
}

/** GitHub API から取得したマージ済み PR（使う項目のみ） */
export interface PullRequest {
  number: number;
  title: string;
  body: string | null;
  /** マージされずにクローズされた PR は null */
  mergedAt: string | null;
  labels: string[];
  /** 作成者が Bot（Dependabot 等）か */
  byBot: boolean;
  /** PR の元ブランチ（確認用 PR の判定に使う） */
  headRef: string;
  url: string;
}

/** GitHub API から取得した Release（使う項目のみ） */
export interface Release {
  tagName: string;
  body: string | null;
  publishedAt: string | null;
  draft: boolean;
  prerelease: boolean;
  url: string;
}
