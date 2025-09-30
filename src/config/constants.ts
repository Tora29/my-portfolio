/**
 * このファイルは後方互換性のために残されています。
 * 新しいコードでは以下のファイルから直接インポートしてください：
 * - 型定義: ../types
 * - データ: ./data
 * - テーマ設定: ./theme
 */

// 型定義の再エクスポート
export type {
  SkillItem,
  SkillCategory,
  TimelineItem,
  NavItem,
  SocialLinks,
  SiteInfo,
  ImageDefaults,
  AnimationConfig,
  LayoutConfig,
  CardSizes,
  NavSizes,
  HeroSizes,
  Sizes,
  BreakpointValues,
  IconMapType,
} from '../types'

// データの再エクスポート
export { NAV_ITEMS, SOCIAL_LINKS, SITE_INFO, ICON_MAP } from './data'

// テーマ設定の再エクスポート
export {
  IMAGE_DEFAULTS,
  ANIMATION,
  CAROUSEL_TRANSITION_DURATION,
  CAROUSEL_LAYOUT,
  LAYOUT,
  SIZES,
  BREAKPOINT_VALUES,
  CAROUSEL_BREAKPOINTS,
} from './theme'

// デフォルトエクスポート（後方互換性のため）
import { NAV_ITEMS, SOCIAL_LINKS, SITE_INFO, ICON_MAP } from './data'
import {
  IMAGE_DEFAULTS,
  ANIMATION,
  LAYOUT,
  SIZES,
  BREAKPOINT_VALUES,
} from './theme'

const constants = {
  NAV_ITEMS,
  SOCIAL_LINKS,
  SITE_INFO,
  IMAGE_DEFAULTS,
  ANIMATION,
  LAYOUT,
  SIZES,
  BREAKPOINT_VALUES,
  ICON_MAP,
} as const

export default constants
