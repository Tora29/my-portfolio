import { HTMLAttributes } from 'react'

type DividerOrientation = 'horizontal' | 'vertical'
type DividerSpacing = 'none' | 'tight' | 'normal' | 'loose'

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation
  thickness?: string
  color?: string
  opacity?: number
  spacing?: DividerSpacing
  className?: string
}

/**
 * 水平または垂直の区切り線を表示するコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {DividerOrientation} props.orientation - 区切り線の向き ('horizontal' または 'vertical')
 * @param {string} props.thickness - 区切り線の太さ (CSSの値、例: '1px', '2px')
 * @param {string} props.color - 区切り線の色 (CSSの色値)
 * @param {number} props.opacity - 区切り線の不透明度 (0-1の範囲)
 * @param {DividerSpacing} props.spacing - 区切り線の上下または左右の余白 ('none' | 'tight' | 'normal' | 'loose')
 * @param {string} props.className - 追加のCSSクラス名
 * @returns {JSX.Element} 区切り線要素
 */
const Divider = ({
  orientation = 'horizontal',
  thickness = '1px',
  color = 'rgb(199,195,187)',
  opacity = 1,
  spacing = 'normal',
  className = '',
  ...props
}: DividerProps) => {
  const spacingClasses: Record<DividerSpacing, string> = {
    none: '',
    tight: orientation === 'horizontal' ? 'my-1' : 'mx-1',
    normal: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    loose: orientation === 'horizontal' ? 'my-4' : 'mx-4',
  }

  const orientationClasses: Record<DividerOrientation, string> = {
    horizontal: 'w-full',
    vertical: 'h-full self-center',
  }

  const sizeStyle =
    orientation === 'horizontal' ? { height: thickness } : { width: thickness }

  const combinedClasses = `
    ${orientationClasses[orientation]}
    ${spacingClasses[spacing]}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <div
      className={combinedClasses}
      style={{
        ...sizeStyle,
        backgroundColor: color,
        opacity,
      }}
      {...props}
    />
  )
}

export default Divider
