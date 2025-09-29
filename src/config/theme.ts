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

const theme = {
  colors,
  fonts,
  spacing,
  breakpoints,
  transitions,
  zIndex,
  shadows,
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
