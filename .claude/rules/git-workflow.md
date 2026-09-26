# Git・Pull Request ルール

このRepositoryのマージ済みPRは、Activityとしてポートフォリオに公開される（`.users/design/activity-pipeline.md`）。PRのタイトルと本文は、閲覧者（採用担当・エンジニア）が読む前提で書く。

## ブランチ

- main へ直接コミットしない。作業はブランチを切ってPRでマージする
- ブランチ名：`<type>/<短い説明>`（例：`feat/tech-genre-list`、`fix/tab-fade`）
- `bot/activity` はActivity更新用の予約ブランチ。人の作業には使わない

## コミットメッセージ

Conventional Commits形式で書く。

```text
<type>(<scope>): <内容>
```

| type | 用途 |
| --- | --- |
| feat | 機能の追加 |
| fix | 不具合の修正 |
| perf | 性能の改善 |
| refactor | 挙動を変えない改善 |
| docs | ドキュメント・コンテンツの追加や修正 |
| style | 見た目に影響しないコード整形 |
| test | テストの追加・修正 |
| build / ci | ビルド設定・ワークフロー |
| chore | 上記以外の雑務（依存関係の更新など） |

- scope は機能名（`home` / `works` / `notes` / `career` / `tech` / `activity` / `graph` / `content` 等）
- 内容は日本語で簡潔に書く

## Pull Request

### タイトル

コミットメッセージと同じ形式にし、`: ` の後ろを**閲覧者が読んで分かる日本語**で書く。この部分がActivityの見出しになる。

```text
○ feat(tech): Tech をジャンル別に表示
○ fix(home): スマートフォンでタブが見切れる問題を修正
× feat(tech): TechList.astro に groupBy を追加        # 実装の言葉になっている
× fix: いろいろ修正                                    # 何をしたか分からない
```

### 本文

最初の段落がActivityの要約になる。何を変えて、閲覧者にとって何が良くなったかを1〜2文で書く。

```markdown
Tech 一覧をジャンルで区切り、上位の技術に下位の技術の実績も含めて集計するようにした。

## 変更内容
- …

## 確認方法
- …
```

- 最初の段落に、実装の詳細・作業メモ・チェックリストを書かない（見出し以降に書く）
- 公開してよい情報のみを書く（`.claude/rules/content-authoring.md` 「公開してよい情報」）

### ラベル

| ラベル | 意味 |
| --- | --- |
| `tech:<id>` | ActivityのTechを指定する（`data/tech.yml` の id）。付けない場合は作品のTechを引き継ぐ |
| `activity:skip` | Activityに載せない（type が feat / fix 等でも除外する） |

- chore / ci / build / test / style のPRは自動で除外されるため、`activity:skip` は不要

## Activity更新PR（`bot/activity`）

毎日自動で作成・上書きされる。7日以内に確認しなければ自動でマージされる。

- 要約を直す：`bot/activity` ブランチの `data/activity.json` を編集する
- 掲載しない：`data/activity-excluded.yml` に id と理由を追加し、`data/activity.json` から削除する
- 公開を止める：`hold` ラベルを付ける
- 確認用PRで `data/activity.json` と `data/activity-excluded.yml` 以外を変更しない
