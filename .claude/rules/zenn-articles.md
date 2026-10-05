---
paths:
  - "articles/**"
  - "images/**"
---

# Zenn の記事のルール

`articles/` の記事と `images/` の画像を書くときのルール。記事の本文は Zenn の GitHub 連携で Zenn に公開され、サイトには一覧だけが出る。項目の正確な定義は `src/content.config.ts` のスキーマを正とする。

公開してよい情報と Tech の id は、`content-authoring.md` の「公開してよい情報」「Tech の参照」に従う（このルールの `paths` では読み込まれないため、記事を書く前に読む）。

## 配置とスラッグ

- 記事は `articles/<スラッグ>.md` に1件1ファイルで書く
- Zenn の GitHub 連携は、リポジトリ直下の `articles/` と `images/` しか読まない（サブディレクトリを指定できない）。そのため `content/` の外に置く
- ファイル名が Zenn のスラッグ（`https://zenn.dev/tora29/articles/<スラッグ>`）になり、サイトの id にもなる。英小文字・数字・ハイフン・アンダースコアの12〜50字にする（合わないとビルドエラー）
- スラッグは自分の記事の中だけでなく、Zenn 全体で重複できない。`harness-engineering` のような一般的な名前は他の人が使っていることがあるため、`https://zenn.dev/tora29/articles/<スラッグ>` が 404 になる（まだ使われていない）ことを確かめてから決める。ほかの人の非公開の記事と重なっている場合は外から分からないので、マージ後に Zenn のデプロイ履歴で同期が成功したかも確かめる
- 公開後にスラッグを変えない（URL が変わり、リンクと検索評価が失われる）

```text
articles/
└─ static-first-portfolio.md        # → https://zenn.dev/tora29/articles/static-first-portfolio
images/
└─ static-first-portfolio/          # 記事ごとにフォルダを分ける
   └─ flow.webp
```

## 書いてから公開まで

下書き用のディレクトリは作らない。作業ブランチが下書きになる。Zenn の GitHub 連携もサイトも main からしか公開しないため、ブランチの上で `articles/` に置いた記事は、マージするまでどこにも公開されない。

1. ブランチを切り、`articles/<スラッグ>.md` に書く。frontmatter は最初から `published: true` と `published_at` を書く
   - 作業ブランチを push すると、マージ前でも公開 Repository 上で読める。書きかけを見せたくなければ、書き上がるまで push しない
2. `npx zenn-cli@latest preview` を実行し、http://localhost:8000 で Zenn と同じ表示を確かめる（保存すると表示が更新される）
3. `polish-text` Skill で推敲する
4. `published_at` をマージする日に合わせ、`npm run build` がエラーなく通ることを確認する
5. コミットして PR を作り、マージする。マージすると、サイトは GitHub Actions で、記事は Zenn の GitHub 連携で公開される

## frontmatter

Zenn の frontmatter に、サイトだけで使う `works` を足した形で書く。

```yaml
title: "Static-first で作るポートフォリオ"   # 70字以内（Zenn の制限）
emoji: "🪐"                  # Zenn のアイキャッチ。1文字
type: "tech"                 # tech（技術記事）| idea（アイデア記事）
topics: ["typescript", "astro", "githubactions", "個人開発"]   # 1〜5個
published: true              # 常に true（false はビルドエラー）
published_at: "2026-09-28"   # 公開日。サイトの一覧の日付になる。Zenn では一度設定すると変えられない
works: ["personal-platform"] # 任意。この記事が扱う作品の id（作品ページの Related Notes に出る）
```

- 技術記事は Zenn に書き、サイトに同じ記事を置かない
- `published: false` は使わない。公開 Repository のため、main にあれば `false` でも GitHub 上で読めてしまう。main に置く記事はすべて公開するものとして扱い、公開前の記事はブランチの上に置く
- `published_at` は引用符で囲み、文字列として書く（Zenn の検証処理は文字列を前提にしているため。囲まないとビルドエラー）。空の文字列（`""`）にしない（Zenn が形式のエラーにする）
  - 書式は `"YYYY-MM-DD"` か `"YYYY-MM-DD hh:mm"`（時刻は日本時間）。サイトの一覧には日付の部分だけを使う
- `tags` を書かず、Zenn の `topics` だけを書く（Zenn は `tags` を使うと警告する）。`data/tech.yml` の id からハイフンを除いた topic（`claude-code` → `claudecode`）が、その Tech として扱われる
  - Zenn の topics には記号を使えないため、ハイフンを除いた形で対応させている
  - Tech に対応しない topics（「個人開発」など）は、Zenn で読者に届けるためだけに使われ、サイトでは無視される
  - ハイフンを除くと同じになる Tech の id（`next-js` と `nextjs` など）は、記事がどちらの Tech か決まらないためビルドエラーになる
  - 技術記事（`type: "tech"`）で Tech に対応する topic が1つもないと、ビルドで警告が出る（topic の書き誤りに気づけるように）

## 画像

- `images/<スラッグ>/` に置き、本文から `/images/<スラッグ>/xxx.webp` の絶対パスで参照する（Zenn の仕様。相対パスは使えない）
- Zenn の制限は1枚3MB以内、png・jpg・gif・webp のみ。このリポジトリでは、横幅は最大1600px、形式は WebP、1枚あたり300KB以下を目安に縮小してからコミットする
- `alt` を必ず書く
- スクリーンショットに個人情報・社内情報・APIキー等が写っていないか確認する

## 本文

- 書き手の口調で書く。口調は `.claude/skills/polish-text/voice.md` にまとめている
- 1回の改行も、改行として表示される（GitHub のプレビューとは表示が違う）。段落を分けたいときは空行を入れる
