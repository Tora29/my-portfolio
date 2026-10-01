---
paths:
  - "content/**"
  - "data/**"
---

# コンテンツ作成ルール

`content/` の作品・記事・職歴、`data/` の構造化データを書くときのルール。項目の正確な定義は `src/content.config.ts` のスキーマを正とする。

## 配置と id

- 作品・記事は1件1フォルダとし、本文は `index.mdx` に書く。画像は同じフォルダに置く
- id（URL）は英小文字・数字・ハイフンのみ（kebab-case）
  - 作品：フォルダ名がそのまま id になる
  - 記事：フォルダ名を `YYYY-MM-DD-<id>`（公開日 + id）にする。日付は URL に含まれない（`2026-09-28-static-first-portfolio` → `/notes/static-first-portfolio`）。ディレクトリを見ただけで公開順に並び、いつ公開したかが分かるようにするため
  - 記事のフォルダ名の日付は frontmatter の `date` と揃える（食い違うとビルドエラー）
- 公開後に id を変えない（URLが変わり、リンクと検索評価が失われる）

```text
content/
├─ _drafts/                    # 下書き（コミットしない。フォルダ名に日付は不要）
│  └─ rag-langfuse/index.mdx
├─ works/
│  └─ personal-platform/
│     ├─ index.mdx             # → /works/personal-platform
│     └─ cover.webp
├─ notes/
│  └─ 2026-09-28-static-first-portfolio/
│     ├─ index.mdx             # → /notes/static-first-portfolio（日付は URL に含まれない）
│     └─ architecture.webp
└─ career/
   └─ 2024-consulting.yml      # 職歴は1社1ファイル（URLを持たない）
```

## 下書きから公開まで

1. `content/_drafts/<id>/` で書く
2. 書き上がったら `content/notes/YYYY-MM-DD-<id>/`（作品は `content/works/<id>/`）へ移す。記事は公開日をフォルダ名の先頭と frontmatter の `date` の両方に書く
3. `npm run build` がエラーなく通ることを確認する
4. コミットして push する（GitHub Actionsでデプロイされる）

## frontmatter

### Works

```yaml
title: Personal Platform
summary: このポートフォリオ自体。Works・Notes・Techを関連付けて静的生成する。   # 一覧に出る1〜2文
status: developing          # developing | active | archived
github:                     # 任意。ここに書いたRepositoryだけがActivityの収集対象になる
  owner: Tora29
  repo: my-portfolio
tech: [typescript, github-actions]   # tech.yml の id
cover: ./cover.webp         # 任意
```

本文には `## Overview` と `## Architecture` を書く。Development TimelineはActivityから自動生成するので本文に書かない。

### Notes

```yaml
title: Static-firstで作るポートフォリオ
date: 2026-08-22
updated: 2026-09-01         # 任意。大きく改訂したとき
category: Frontend          # Backend | Frontend | Infrastructure | Architecture | AI | Career | Misc（1記事1つ）
tags: [typescript, github-actions]   # tech.yml の id
summary: サーバーもデータベースも持たずに、動いているように見えるポートフォリオを作る。   # 一覧・OGPに使う1〜2文
works: [personal-platform]  # 任意。この記事が扱う作品の id（Related Worksに出る）
```

### Career（`content/career/*.yml`）

```yaml
period: { start: 2024, end: null }   # 年単位。現職は end: null
org: コンサルティング・開発会社        # 企業名は書かず業態で表記する
role: Tech Lead
summary: 要件定義、技術選定、アーキテクチャ設計、…
tech: [typescript, nextjs, python, azure, rag, claude-code, …]   # tech.yml の id。先頭6個が常に表示される。重要なものから並べる
```

## Tech の参照

- `tech` / `tags` には `data/tech.yml` の `id` だけを書く（`TypeScript` や `TS` ではなく `typescript`）。未定義の id はビルドエラーになる
- 新しいTechを使うときは、先に `data/tech.yml` へ `id` / `name` / `category` を追加する
- 下位のTechを持つもの（例：Azureの下にAzure OpenAI Service）は `parent` で関連付ける

## 画像

- コミット前に縮小する。横幅は最大1600px、形式はWebP、1枚あたり300KB以下を目安にする
- 表示サイズへの最適化はAstroの `<Image />` に任せる。サイズ違いの画像を手で用意しない
- 画像は使う記事・作品のフォルダに置く。複数の記事で共有しない
- `alt` を必ず書く
- スクリーンショットに個人情報・社内情報・APIキー等が写っていないか確認する

## 公開してよい情報

公開リポジトリかつ公開サイトであることを前提に書く（`.users/requirements/screens.md` §6）。

- 書かない：住所・電話・メール・生年月日などの個人情報、顧客名・案件名・社内システム名、所属企業名
- 書かない：業務で知った顧客システムの脆弱性・不具合
- 書かない：家族構成・同居人・健康状態など私生活が分かる内容。個人用・家族用Repositoryを Works に載せるときは技術面だけを書き、該当するActivityは `data/activity-excluded.yml` で除外する
- 職歴の期間は年単位、所属は業態で表記する
