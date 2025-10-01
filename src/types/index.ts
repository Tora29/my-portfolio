import { IconType } from 'react-icons'

// スキル関連の型
export interface SkillItem {
  name: string
  level: number // 1-5の習熟度
  icon: IconType // react-icons のアイコンコンポーネント
}

export interface SkillCategory {
  category: string
  items: SkillItem[]
}

// タイムライン関連の型
export interface TimelineItem {
  date: string
  title: string
  description: string
  type?: 'education' | 'work' | 'project' | 'other'
}

// ナビゲーション関連の型
export interface NavItem {
  id: string
  label: string
  imageSrc: string
  summary: string
  content: string
  imagePosition?: string
  skills?: SkillCategory[]
  timeline?: TimelineItem[]
}

// サイト情報関連の型
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

// 画像設定の型
export interface ImageDefaults {
  placeholder: string
  contentCardPlaceholder: string
  quality: number
  formats: readonly string[]
}

// アニメーション設定の型
export interface AnimationConfig {
  scrollSmooth: ScrollBehavior
  scrollDuration: number
  carouselInterval: number
  fadeInDuration: number
}

// レイアウト設定の型
export interface LayoutConfig {
  maxContentWidth: string
  headerHeight: string
  footerHeight: string
  sectionPadding: string
}

// サイズ設定の型
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

// ブレークポイント設定の型
export interface BreakpointValues {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

// アイコンマッピングの型
export type IconMapType = Record<string, IconType>
