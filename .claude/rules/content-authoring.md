---
paths:
  - "articles/**"
  - "content/**"
  - "data/**"
---

# コンテンツ作成ルール

`content/` の作品・職歴、`articles/` の記事、`data/` の構造化データを書くときのルール。項目の正確な定義は `src/content.config.ts` のスキーマを正とする。

## 配置と id

- 作品は1件1フォルダとし、本文は `index.mdx` に書く。画像は同じフォルダに置く。フォルダ名がそのまま id（URL）になる
- 記事は `articles/<スラッグ>.md` に1件1ファイルで書く。本文は Zenn の GitHub 連携で Zenn に公開され、サイトには一覧だけが出る
  - Zenn はリポジトリ直下の `articles/` しか読まないため、`content/` の外に置く
  - ファイル名が Zenn のスラッグ（`https://zenn.dev/tora29/articles/<スラッグ>`）になる。英小文字・数字・ハイフン・アンダースコアの12〜50字にする（合わないとビルドエラー）
- 作品の id は英小文字・数字・ハイフンのみ（kebab-case）
- 公開後に id・スラッグを変えない（URLが変わり、リンクと検索評価が失われる）

```text
content/
├─ _drafts/                    # 下書き（コミットしない。フォルダ名に日付は不要）
│  └─ rag-langfuse/index.mdx
├─ works/
│  └─ personal-platform/
│     ├─ index.mdx             # → /works/personal-platform
│     └─ cover.webp
└─ career/
   └─ 2024-consulting.yml      # 職歴は1社1ファイル（URLを持たない）

articles/
└─ static-first-portfolio.md   # → https://zenn.dev/tora29/articles/static-first-portfolio
images/                        # 記事の画像（Zenn の仕様でリポジトリ直下に置く）
```

## 下書きから公開まで

1. `content/_drafts/` で書く。記事も `articles/` には置かない（公開 Repository のため、`published: false` でも GitHub 上で読めてしまう）
2. 書き上がったら、作品は `content/works/<id>/` へ、記事は `articles/<スラッグ>.md` へ移す。記事は `published: true` と公開日（`published_at`）を書く
3. `npm run build` がエラーなく通ることを確認する
4. コミットして PR を作り、マージする。マージすると、サイトは GitHub Actions で、記事は Zenn の GitHub 連携で公開される

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

作品について書いた記事は、作品の本文ではなく記事の `works` で関連付ける（作品ページの Related Notes に出る）。

### 記事（`articles/*.md`）

Zenn の frontmatter に、サイトだけで使う `works` を足した形で書く。

```yaml
title: "Static-first で作るポートフォリオ"   # 70字以内（Zenn の制限）
emoji: "🪐"                  # Zenn のアイキャッチ。1文字
type: "tech"                 # tech（技術記事）| idea（アイデア記事）
topics: ["typescript", "astro", "githubactions", "個人開発"]   # 1〜5個。Tech との対応は「Tech の参照」
published: true              # articles/ には公開する記事だけを置く（false はビルドエラー）
published_at: "2026-09-28"   # 公開日。サイトの一覧の日付になる。Zenn では一度設定すると変えられない
works: ["personal-platform"] # 任意。この記事が扱う作品の id（作品ページの Related Notes に出る）
```

- 技術記事は Zenn に書き、サイトに同じ記事を置かない
- `published_at` は引用符で囲み、文字列として書く（Zenn の検証処理は文字列を前提にしているため）

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
- 記事は `tags` を書かず、Zenn の `topics` だけを書く（Zenn は `tags` を使うと警告する）。tech.yml の id からハイフンを除いた topic（`claude-code` → `claudecode`）が、その Tech として扱われる
  - Zenn の topics には記号を使えないため、ハイフンを除いた形で対応させている
  - Tech に対応しない topics（「個人開発」など）は、Zenn で読者に届けるためだけに使われ、サイトでは無視される

## 画像

- コミット前に縮小する。横幅は最大1600px、形式はWebP、1枚あたり300KB以下を目安にする
- 表示サイズへの最適化はAstroの `<Image />` に任せる。サイズ違いの画像を手で用意しない
- 作品の画像は作品のフォルダに置く
- 記事の画像は `images/<スラッグ>/` に置き、本文から `/images/<スラッグ>/xxx.webp` の絶対パスで参照する（Zenn の仕様。相対パスは使えない。1枚3MB以内、png・jpg・gif・webp のみ）
- `alt` を必ず書く
- スクリーンショットに個人情報・社内情報・APIキー等が写っていないか確認する

## 公開してよい情報

公開リポジトリかつ公開サイトであることを前提に書く（`.users/requirements/screens.md` §6）。

- 書かない：住所・電話・メール・生年月日などの個人情報、顧客名・案件名・社内システム名、所属企業名
- 書かない：業務で知った顧客システムの脆弱性・不具合
- 書かない：家族構成・同居人・健康状態など私生活が分かる内容。個人用・家族用Repositoryを Works に載せるときは技術面だけを書き、該当するActivityは `data/activity-excluded.yml` で除外する
- 職歴の期間は年単位、所属は業態で表記する
