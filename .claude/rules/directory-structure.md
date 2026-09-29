# ディレクトリ構造

Astro（SSG）で構築する。コンテンツ・データ・コードを分離し、コンテンツ更新でコードに触れずに済む構造を保つ。

## 全体

```text
my-portfolio/
├─ content/                    # 手書きコンテンツ（Gitが唯一の正）
│  ├─ _drafts/                 #   下書き（.gitignore 対象。コミットしない）
│  ├─ works/<id>/index.mdx     #   作品（1作品1フォルダ。フォルダ名 = id。画像も同じフォルダ）
│  ├─ notes/<id>/index.mdx     #   記事（1記事1フォルダ。フォルダ名 = id。画像も同じフォルダ）
│  └─ career/*.yml             #   職歴（1社1ファイル）
├─ data/                       # 構造化データ
│  ├─ profile.yml              #   名前・職種・Values・Next・資格・外部リンク
│  ├─ tech.yml                 #   Tech一覧（id・表示名・親子関係・ジャンル）
│  ├─ tech-categories.yml      #   ジャンルの定義と表示順
│  ├─ activity.json            #   生成物（GitHub Activity）。修正は確認用PR上でのみ行う
│  └─ activity-excluded.yml    #   掲載しないActivityの id（手で編集する）
├─ scripts/
│  └─ activity/                # GitHub Activityの取得・集約（GitHub Actionsから実行）
├─ src/
│  ├─ content.config.ts        # Content Collectionsの定義とスキーマ
│  ├─ pages/                   # ルーティング
│  ├─ layouts/                 # ページの外枠
│  ├─ features/                # 画面機能ごとのコンポーネントとロジック
│  │  ├─ home/
│  │  ├─ about/
│  │  ├─ career/
│  │  ├─ works/
│  │  ├─ tech/
│  │  ├─ notes/
│  │  └─ activity/
│  ├─ components/ui/           # 機能をまたいで使う汎用部品
│  ├─ lib/                     # 機能をまたいで使う処理
│  │  └─ graph/                #   Engineering Graph
│  ├─ styles/                  # デザイントークン・グローバルスタイル
│  └─ test/                    # 単体テスト用の部品（.astro の描画・テストデータ）。テストからのみ import する
├─ public/                     # そのまま配信する静的ファイル
├─ e2e/                        # E2Eテスト（Playwright）。単体テストは対象と同じディレクトリの `__tests__/` に置く
├─ .github/workflows/          # デプロイ・Activity定期取得
└─ .claude/rules/              # 開発ルール
```

## 配置ルール

### content/ と data/

- 手書きのコンテンツは `content/`、構造化データは `data/` に置く。`src/` にコンテンツを置かない
- Content Collectionsの読み込み対象に `content/_drafts/` を含めない
- 書き方（id・frontmatter・画像・下書きから公開までの流れ）は `content-authoring.md` に従う
- スキーマは `src/content.config.ts` に集約する。コンテンツの項目を増やすときはスキーマも同時に更新する
- Zod は `astro/zod` から import する（`scripts/` を含む。`zod` は依存に入れていない）
- Techは必ず `data/tech.yml` に定義されたものを参照する（未定義のTechはビルドエラー）
- `data/activity.json` は `scripts/activity/` が生成する。main ブランチで直接編集しない。要約の修正・除外は確認用PR（`bot/activity`）上で行う（`.users/design/activity-pipeline.md` §6）

### src/pages/

- URLとデータの受け渡しのみを書く。表示の組み立てやデータ加工は `features/` / `lib/` に置く
- ページ構成は `.users/requirements/screens.md` の画面一覧と1対1で対応させる

```text
pages/
├─ index.astro          → /
├─ about.astro          → /about
├─ career.astro         → /career
├─ activity.astro       → /activity
├─ works/index.astro    → /works
├─ works/[id].astro     → /works/[id]
├─ tech/index.astro     → /tech
├─ tech/[id].astro      → /tech/[id]
├─ notes/index.astro    → /notes
└─ notes/[id].astro     → /notes/[id]
```

### src/features/

- 1つの画面機能でのみ使うコンポーネント・ロジック・型は、その機能のディレクトリに置く
- 機能間で直接importしない。2つ以上の機能で使うものは `components/ui/` または `lib/` へ移す
- `features/home/` のCanvas（宇宙のシーン）はクライアントで動くIslandとして実装し、他の機能から独立させる

### src/components/ui/

- 特定の機能やコンテンツ構造に依存しない部品のみを置く（例：Chip、ShowMore、BackButton）

### src/lib/

- 機能をまたいで使う純粋な処理を置く（例：日付整形、Engineering Graph）
- `lib/graph/` はビルド時に実行される。ブラウザ向けのコードから依存しない

### src/layouts/

- ページの外枠のみを置く（例：`BaseLayout`、タブ・見出し・Prev / Nextを持つ `SectionLayout`）

## 判断に迷ったとき

| 置きたいもの | 置き場所 |
| --- | --- |
| 1つの画面でしか使わない部品 | `features/<機能>/` |
| 複数の画面で使う、見た目だけの部品 | `components/ui/` |
| 複数の画面で使う、表示を持たない処理 | `lib/` |
| 記事・作品の本文 | `content/` |
| 一覧・設定のような構造化データ | `data/` |
