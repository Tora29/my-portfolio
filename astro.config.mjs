// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://tora29.net',
  // GitHub Pages は tech/index.html を /tech/ でしか返さず、/tech を開くと 301 で転送される。
  // tech.html の形で出力すると /tech のまま 200 で返るため、末尾スラッシュなしの URL に揃える。
  // trailingSlash は開発サーバー・sitemap の URL を本番と同じ形にするために合わせて指定する
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  // 英字の見出し・ラベル用。日本語は OS 標準のゴシック体を使うため Web フォントを読み込まない。
  // npm パッケージから読み込み、ビルド時に外部の CDN へ通信しない（remote: false）
  fonts: [
    {
      provider: fontProviders.npm({ remote: false }),
      name: 'Montserrat Variable',
      cssVariable: '--font-montserrat',
      weights: ['200 600'],
      subsets: ['latin'],
      options: { package: '@fontsource-variable/montserrat' },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
