# Tora29's Portfolio

React と Tailwind CSS で構築された個人ポートフォリオサイトです。

## 🚀 使用技術

- **React 19** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **Lucide React** - アイコンライブラリ
- **Simple Icons** - ブランドアイコン
- **GitHub Pages** - ホスティング

## ✨ 主な機能

- 📱 **レスポンシブデザイン** - モバイル・タブレット・デスクトップに対応
- 🎨 **パーティクル背景** - 動的なビジュアルエフェクト
- 🎠 **スムーズなカルーセル** - フリック操作・無限ループ対応
- 📊 **タイムライン表示** - 経歴を視覚的に表現
- 🎯 **スクロールアニメーション** - セクション遷移のスムーズな動き
- 🎭 **モーダルUI** - インタラクティブなコンテンツ表示

## 📂 プロジェクト構成

```
src/
├── components/          # UIコンポーネント
│   ├── Header.tsx      # ヘッダーナビゲーション
│   ├── Hero.tsx        # ヒーローセクション
│   ├── Carousel.tsx    # カルーセル
│   ├── SectionCard.tsx # セクションカード
│   ├── ContentCard.tsx # コンテンツカード
│   ├── Timeline.tsx    # タイムライン
│   ├── CircularProgress.tsx # 円形プログレスバー
│   ├── ParticleBackground.tsx # パーティクル背景
│   └── shared/         # 共有コンポーネント
│       └── Modal.tsx   # モーダル
├── hooks/              # カスタムフック
│   ├── useScrollTo.ts  # スクロール制御
│   ├── useScrollAnimation.ts # スクロールアニメーション
│   └── useResponsiveDimensions.ts # レスポンシブ対応
├── config/
│   └── constants.ts    # 設定定数
└── assets/             # 画像・静的ファイル
```

## 🛠️ 開発

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーは `http://localhost:5173` で起動します。

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview
```

### コード品質

```bash
# 型チェック
npm run type-check

# Lint実行
npm run lint

# Lint自動修正
npm run lint:fix

# コードフォーマット
npm run format

# フォーマットチェック
npm run format:check
```

## 📦 デプロイ

このプロジェクトは GitHub Pages へのデプロイが設定されています。

```bash
# GitHub Pagesへデプロイ
npm run deploy
```

サイトURL: https://tora29.github.io/my-portfolio/

## 📝 ライセンス

ISC

## 👤 Author

Tora29
