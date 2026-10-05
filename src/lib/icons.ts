/**
 * アイコンの名前
 *
 * 表示は components/ui/Icon.astro が行う。lib や features のデータ（Activity の種類・セクションなど）も
 * アイコンの名前を持つため、名前の一覧はコンポーネントではなくここに置く（lib から components へ依存しないように）。
 * 名前を足したら、Icon.astro の ICONS にも同じ名前の SVG を登録する（登録漏れは型エラーになる）。
 */
export const ICON_NAMES = [
  'arrow-left',
  'arrow-right',
  'arrow-up-right',
  'code',
  'cpu',
  'git-pull-request',
  'github-logo',
  'seal-check',
  'tag',
  'notebook',
  'path',
  'pause',
  'play',
  'pulse',
  'user-circle',
  'x',
] as const;

export type IconName = (typeof ICON_NAMES)[number];
