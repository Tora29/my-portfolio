import {
  ImageDefaults,
  AnimationConfig,
  LayoutConfig,
  Sizes,
  BreakpointValues,
} from '../types'

// カラーパレット
export const colors = {
  primary: {
    light: 'rgb(199,195,187)',
    DEFAULT: 'rgb(199,195,187)',
  },
  secondary: {
    light: 'rgb(108,95,62)',
    DEFAULT: 'rgb(108,95,62)',
    dark: 'rgb(108,95,62)',
  },
  background: {
    primary: 'rgb(12,13,21)',
    secondary: 'rgb(23,24,32)',
    tertiary: 'rgb(108,95,62)',
  },
  text: {
    primary: 'rgb(199,195,187)',
    secondary: 'rgb(108,95,62)',
    dark: 'rgb(12,13,21)',
    light: 'rgb(23,24,32)',
  },
} as const

// フォント設定
export const fonts = {
  primary: 'Rubik',
  secondary: 'Squada_One',
} as const

// スペーシング
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const

// ブレークポイント
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// アニメーション設定
export const transitions = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const

// Z-index層
export const zIndex = {
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const

// 影
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
} as const

// 画像設定
export const IMAGE_DEFAULTS: ImageDefaults = {
  placeholder: 'https://placehold.co/400x300',
  contentCardPlaceholder: 'https://placehold.co/250x300',
  quality: 80,
  formats: ['webp', 'jpg'] as const,
} as const

// アニメーション設定
export const ANIMATION: AnimationConfig = {
  scrollSmooth: 'smooth',
  scrollDuration: 500,
  carouselInterval: 3000,
  fadeInDuration: 300,
} as const

// カルーセルトランジション設定
export const CAROUSEL_TRANSITION_DURATION = 500 // ms

// カルーセルレイアウト設定
export const CAROUSEL_LAYOUT = {
  sideMargin: 80, // ボタンの左右マージン
  bandExtension: {
    twoCards: 100, // 2枚表示時の帯の拡張
    threeCards: 110, // 3枚表示時の帯の拡張
  },
  swipeThreshold: 50, // スワイプ判定の閾値（px）
} as const

// レイアウト設定
export const LAYOUT: LayoutConfig = {
  maxContentWidth: '1000px',
  headerHeight: '60px',
  footerHeight: '192px', // h-48 = 12rem = 192px
  sectionPadding: '80px',
} as const

// サイズ設定
export const SIZES: Sizes = {
  card: {
    section: { width: '380px', height: '240px' },
    content: { width: '1000px', height: '300px' },
    imageWidth: '250px',
  },
  nav: {
    button: { width: '96px', height: '64px' },
    icon: { width: '20px', height: '20px' },
  },
  hero: {
    height: '400px',
    marginRight: '100px',
  },
} as const

// メディアクエリ（Tailwind準拠）
export const BREAKPOINT_VALUES: BreakpointValues = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// カルーセルのブレークポイント設定
export const CAROUSEL_BREAKPOINTS = {
  threeCards: 1500, // 3枚表示の閾値
} as const

const theme = {
  colors,
  fonts,
  spacing,
  breakpoints,
  transitions,
  zIndex,
  shadows,
  IMAGE_DEFAULTS,
  ANIMATION,
  CAROUSEL_TRANSITION_DURATION,
  CAROUSEL_LAYOUT,
  LAYOUT,
  SIZES,
  BREAKPOINT_VALUES,
  CAROUSEL_BREAKPOINTS,
} as const

// 型定義のエクスポート
export type Theme = typeof theme
export type Colors = typeof colors
export type Fonts = typeof fonts
export type Spacing = typeof spacing
export type Breakpoints = typeof breakpoints
export type Transitions = typeof transitions
export type ZIndex = typeof zIndex
export type Shadows = typeof shadows

export default theme
