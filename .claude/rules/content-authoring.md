---
paths:
  - "content/**"
  - "data/**"
---

# コンテンツ作成ルール

`content/` の作品・職歴と `data/` の構造化データを書くときのルール。項目の正確な定義は `src/content.config.ts` のスキーマを正とする。

記事（`articles/`）と記事の画像（`images/`）は `zenn-articles.md` に従う。このルールの「Tech の参照」と「公開してよい情報」は、記事にも当てはまる。

## 配置と id

- 作品は1件1フォルダとし、本文は `index.mdx` に書く。画像は同じフォルダに置く。フォルダ名がそのまま id（URL）になる
- 作品の id は英小文字・数字・ハイフンのみ（kebab-case）
- 公開後に id を変えない（URLが変わり、リンクと検索評価が失われる）

```text
content/
├─ works/
│  └─ personal-platform/
│     ├─ index.mdx             # → /works/personal-platform
│     └─ cover.webp
└─ career/
   └─ 2024-consulting.yml      # 職歴は1社1ファイル（URLを持たない）
```

## 書いてから公開まで

下書き用のディレクトリは作らない。作業ブランチが下書きになる。サイトは main からしかデプロイされないため、ブランチの上で書いたものはマージするまで公開されない。

1. ブランチを切り、`content/works/<id>/` などに直接書く
   - 作業ブランチを push すると、マージ前でも公開 Repository 上で読める。書きかけを見せたくなければ、書き上がるまで push しない
2. `npm run dev` で表示を確かめる
3. `npm run build` がエラーなく通ることを確認する
4. コミットして PR を作り、マージする。マージすると、GitHub Actions でサイトが公開される

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

### Career（`content/career/*.yml`）

```yaml
period: { start: 2024, end: null }   # 年単位。現職は end: null
org: コンサルティング・開発会社        # 企業名は書かず業態で表記する
role: Tech Lead
summary: 要件定義、技術選定、アーキテクチャ設計、…
tech: [typescript, nextjs, python, azure, rag, claude-code, …]   # tech.yml の id。先頭6個が常に表示される。重要なものから並べる
```

## Tech の参照

- `tech` には `data/tech.yml` の `id` だけを書く（`TypeScript` や `TS` ではなく `typescript`）。未定義の id はビルドエラーになる
- 新しいTechを使うときは、先に `data/tech.yml` へ `id` / `name` / `category` を追加する
- 下位のTechを持つもの（例：Azureの下にAzure OpenAI Service）は `parent` で関連付ける
- 記事は `tech` ではなく Zenn の `topics` で Tech を指定する（`zenn-articles.md`）

## 画像

- コミット前に縮小する。横幅は最大1600px、形式はWebP、1枚あたり300KB以下を目安にする
- 表示サイズへの最適化はAstroの `<Image />` に任せる。サイズ違いの画像を手で用意しない
- 作品の画像は作品のフォルダに置く。記事の画像は `zenn-articles.md` に従う
- `alt` を必ず書く
- スクリーンショットに個人情報・社内情報・APIキー等が写っていないか確認する

## 公開してよい情報

公開リポジトリかつ公開サイトであることを前提に書く（`.users/requirements/screens.md` §6）。記事にも当てはまる。

- 書かない：住所・電話・メール・生年月日などの個人情報、顧客名・案件名・社内システム名、所属企業名
- 書かない：業務で知った顧客システムの脆弱性・不具合
- 書かない：家族構成・同居人・健康状態など私生活が分かる内容。個人用・家族用Repositoryを Works に載せるときは技術面だけを書き、該当するActivityは `data/activity-excluded.yml` で除外する
- 職歴の期間は年単位、所属は業態で表記する
