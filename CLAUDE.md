# my-portfolio

日々の開発・技術発信・経歴を一ヶ所に蓄積し、Techを軸に相互に辿れるようにする個人ポートフォリオ。GitHub上の公開活動からActivityを自動生成し、開発を続けることでサイト自体が育つ。

- 公開URL：https://tora29.net（GitHub Pages、DNSはCloudflare）
- 構成：Astro（SSG）＋ Tailwind CSS v4。常時稼働のサーバー・データベースは持たない

## ドキュメント

要件・設計は `.users/` にある（`.gitignore` 対象。このRepositoryには含まれない）。

| ドキュメント | 内容 |
| --- | --- |
| `.users/requirements/requirements.md` | 要件定義 |
| `.users/requirements/screens.md` | 画面要件（画面一覧・URL・各画面の仕様・公開する情報の範囲） |
| `.users/design/engineering-graph.md` | Tech・Engineering Graphの設計（スキーマ・検証・集計） |
| `.users/design/activity-pipeline.md` | GitHub Activityの取得・変換・確認用PR・自動マージ |
| `.users/test/test-cases.md` | テストケースの一覧 |
| `.users/plan/development-plan.md` | 開発計画と経緯 |

設計書は手元にしかないため、コードのコメント・テスト・ルールだけから仕様を逆引きできる状態を保つ（`.claude/rules/code-comments.md`）。

開発ルールは `.claude/rules/` にある。

## コマンド

<!-- プロジェクト作成時に package.json に合わせて確定する -->

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` | ビルド（スキーマ検証・Engineering Graphの生成を含む） |
| `npm run preview` | ビルド結果の確認 |
| `npm run test` | 単体テスト（Vitest） |
| `npm run test:e2e` | E2Eテスト（Playwright） |
| `npm run lint` / `npm run format` | ESLint / Prettier（`npm run format:check` は確認のみ） |
| `npm run semgrep` | 静的解析（Semgrep。`brew install semgrep` が必要） |
| `npm run activity` | GitHub Activityの取得・生成（通常はGitHub Actionsから実行） |

## 作業時の注意

- `src/` / `scripts/` / `e2e/` / `content/` / `data/` / `articles/` / `images/` を読み書きする前に、`.claude/rules/` のうち frontmatter の `paths` が合うルールを読む（`paths` 付きのルールは Read ツールでファイルを開いたときしか自動で読み込まれず、Bash での読み書きや新規作成では読み込まれないため）
- コンテンツ（`content/` / `data/` / `articles/`）は公開Repositoryかつ公開サイトに出る（`articles/` は Zenn にも公開される）。個人情報・顧客情報・所属企業名を書かない
- マージ済みPRのタイトルと本文はActivityとしてサイトに公開される（`.claude/rules/git-workflow.md`）
- `data/activity.json` は main で直接編集しない（確認用PR `bot/activity` 上でのみ修正する）
