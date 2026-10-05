---
paths:
  - "src/**"
---

# Astro コンポーネントルール

## 基本方針：JavaScript は必要な部分だけ

- ページは `.astro` のみで組み立て、ブラウザに送るJavaScriptを持たない状態を基本とする
- UIフレームワーク（Svelte / React 等）は使わない。複雑な状態を持つUIが必要になった時点で導入を検討する
- ブラウザで動く処理は、コンポーネント内の `<script>`（TypeScript）で書く

| 部分 | 実装 |
| --- | --- |
| 一覧・詳細などページの大部分 | `.astro`（JavaScriptなし） |
| Homeの宇宙（Canvas） | `features/home/` の `<script>`。他の機能から独立させる |
| もっと見る・+Nの展開・Activityの絞り込み・タブのフェード等 | 各コンポーネントの小さな `<script>` |

- JavaScriptが無効でも内容が読めるようにする。スクリプトは表示済みのHTMLに動きを足す形で書く（例：「もっと見る」は、JSなしでは全件表示）

## ファイル名

| 種類 | 形式 | 例 |
| --- | --- | --- |
| コンポーネント・レイアウト | PascalCase | `SectionLayout.astro`、`TechChip.astro` |
| ロジック・型・ユーティリティ | kebab-case | `build-graph.ts`、`format-date.ts` |
| ページ | Astroのルーティングに従う | `index.astro`、`[id].astro` |

## コンポーネントの書き方

- Propsは `interface Props` で型を定義し、`Astro.props` から分割代入で受け取る
- データの取得・加工はページ（`src/pages/`）または `lib/` で行い、コンポーネントには表示に必要な値だけを渡す
- コンポーネント内で `getCollection` を呼ばない（依存関係を見えにくくしないため）
- 新しいタブで開くリンク（`target="_blank"`）は `components/ui/ExternalLink.astro` で作り、手で書かない（`rel="noopener"` の付け忘れを防ぎ、外部リンクの印を揃えるため）

```astro
---
interface Props {
  name: string;
  href: string;
}

const { name, href } = Astro.props;
---
<a href={href}>{name}</a>
```

## import

- `src/` 配下は `@/` エイリアスで参照する（例：`@/lib/graph/build-graph`）
- 同じ機能ディレクトリ内のみ相対パスを使ってよい

## View Transitions とスクリプト

ページ遷移の演出に `<ClientRouter />` を使うため、通常のページ読み込みと挙動が異なる。

- 初期化処理は `document.addEventListener('astro:page-load', …)` の中で行う（遷移後に再実行されるように）
- イベントリスナー・タイマー・`requestAnimationFrame` は、`astro:before-swap` などで解除し、遷移のたびに重複させない
- 遷移をまたいで残す要素には `transition:persist` を付ける（例：開閉の演出の粒子の Canvas。`SectionTransition`）
- Homeの宇宙のシーンは残さない。Home を離れるとき（`astro:before-swap`）に止め、戻ったときに作り直す。離れた時点の公転の角度を sessionStorage に保存して引き継ぐ（セクションを開いている間は公転を止め、開いた位置と閉じて戻る位置を揃えるため。`lib/orbit.ts`）
- スクリプトから参照する要素は `data-*` 属性で取得する（クラス名はスタイル用とし、処理の目印に使わない）

## データの受け渡し

- ビルド時の値をスクリプトへ渡すときは `data-*` 属性を使う（`define:vars` はスクリプトがバンドル・TypeScript変換されなくなるため使わない）
- Engineering Graph などのビルド時処理（`lib/graph/`）をブラウザ向けスクリプトからimportしない
