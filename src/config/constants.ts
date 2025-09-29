// 型定義
export interface NavItem {
  id: string
  label: string
}

export interface SocialLinks {
  github: string
  twitter: string
  linkedin: string
}

export interface SiteInfo {
  title: string
  subtitle: string
  description: string
  author: string
}

export interface ImageDefaults {
  placeholder: string
  contentCardPlaceholder: string
  quality: number
  formats: readonly string[]
}

export interface AnimationConfig {
  scrollSmooth: ScrollBehavior
  scrollDuration: number
  carouselInterval: number
  fadeInDuration: number
}

export interface LayoutConfig {
  maxContentWidth: string
  headerHeight: string
  footerHeight: string
  sectionPadding: string
}

export interface CardSizes {
  section: { width: string; height: string }
  content: { width: string; height: string }
  imageWidth: string
}

export interface NavSizes {
  button: { width: string; height: string }
  icon: { width: string; height: string }
}

export interface HeroSizes {
  height: string
  marginRight: string
}

export interface Sizes {
  card: CardSizes
  nav: NavSizes
  hero: HeroSizes
}

export interface BreakpointValues {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

// ナビゲーション項目
export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'about', label: 'ABOUT ME' },
  { id: 'work', label: 'WORK' },
  { id: 'history', label: 'HISTORY' },
  { id: 'blog', label: 'BLOG' },
  { id: 'contact', label: 'CONTACT' },
] as const

// ソーシャルリンク
export const SOCIAL_LINKS: SocialLinks = {
  github: 'https://github.com/Tora29',
  twitter: '',
  linkedin: '',
} as const

// サイト情報
export const SITE_INFO: SiteInfo = {
  title: "Tora29's Lab",
  subtitle: 'WEB ENGINEER',
  description: 'ポートフォリオサイト',
  author: 'Tora29',
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

const constants = {
  NAV_ITEMS,
  SOCIAL_LINKS,
  SITE_INFO,
  IMAGE_DEFAULTS,
  ANIMATION,
  LAYOUT,
  SIZES,
  BREAKPOINT_VALUES,
} as const

export default constants