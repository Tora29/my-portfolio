---
paths:
  - "src/**"
  - "scripts/**"
  - "e2e/**"
---

# テストルール

ロジックが集中し、壊れても画面では気づきにくい部分を重点的にテストする。見た目・演出はテストしない。

## 対象

| 対象 | テスト | 方針 |
| --- | --- | --- |
| `src/lib/graph/` | 単体（Vitest） | **必須**。逆引き・下位Techを含む集計（同一コンテンツは1件）・関連Tech（自身・上位・下位を除外）・循環参照の検出 |
| `scripts/activity/` | 単体（Vitest） | **必須**。PRタイトルの解析・種類と除外の判定・要約の抽出・Techの付与・既存Activityと除外リストの統合 |
| `src/lib/` のその他 | 単体（Vitest） | 分岐や変換を含む関数のみ |
| ページ | E2E（Playwright） | 最低限。主要ページが表示され、主要な導線がつながること |
| `src/components/ui/` ・ `src/features/` の `.astro` | 単体（Vitest） | 条件で出し分ける部分（0件のときの表示・件数による畳み・リンクの有無など）。見た目（クラス）やクライアントの `<script>` の動作は確かめない |
| Homeの宇宙（Canvas）・アニメーション | — | テストしない |

## 単体テスト（Vitest）

- テストファイルは対象と同じディレクトリの `__tests__/` に `<対象>.test.ts` として置く（例：`src/lib/format-date.ts` → `src/lib/__tests__/format-date.test.ts`）
- テストデータはテスト内で組み立てる。`content/` / `data/` の実データに依存しない（コンテンツを更新してもテストが壊れないように）
- GitHub APIは呼ばない。APIのレスポンスは固定のデータ（fixture）で代替する
- テスト名は日本語で、何を確かめるかを書く（例：`下位Techの実績を上位Techの件数に含める`）

### `.astro` コンポーネント

- `src/test/render.ts` の `renderAstro` で描画し（Astro の Container API）、返った DOM を調べる
- 要素・属性（`data-*`・`href`・`hidden`・`aria-*`）・テキストで確かめる。Tailwind のクラス名では確かめない
- テキストを比べるときは `textOf` を使う（描画結果には要素の間の空白が残らないため）
- Props のデータはテスト内で組み立てる。Tech タグの列は `src/test/tech-tags.ts` の `techTags`、MDX の本文は `src/test/FakeContent.astro` で代替する
- 日付で表示が変わるもの（Home の最新 Activity 等）は `vi.setSystemTime` で日付を固定する

## E2E テスト（Playwright）

- `e2e/` に置き、ビルド済みのサイト（`astro preview`）に対して実行する
- 確認するのは次の範囲に留める
  - すべての画面（`.users/requirements/screens.md` §2）が表示される
  - 一覧から詳細へ、詳細から関連コンテンツへ遷移できる
  - JavaScriptなしでも各ページの本文が読める
- 見た目の比較（スクリーンショット比較）は行わない

## 実行のタイミング

- PR時に、単体テスト・E2Eテスト・ビルドをCIで実行する
- テストが落ちている状態でマージしない
