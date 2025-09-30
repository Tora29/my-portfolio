import React, { HTMLAttributes } from 'react'

type GradientType = 'brand' | 'dark' | 'light' | 'primary' | 'secondary'
type GradientDirection = 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l' | 'tl'

interface GradientProps extends HTMLAttributes<HTMLDivElement> {
  type?: GradientType
  direction?: GradientDirection
  opacity?: number
  overlay?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * グラデーション背景を表示するコンポーネント
 * ブランド、ダーク、ライトなどの様々なグラデーションタイプをサポート
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {GradientType} props.type - グラデーションのタイプ ('brand' | 'dark' | 'light' | 'primary' | 'secondary')
 * @param {GradientDirection} props.direction - グラデーションの方向 ('t' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l' | 'tl')
 * @param {number} props.opacity - グラデーションの不透明度 (0-1の範囲)
 * @param {boolean} props.overlay - trueの場合、絶対配置でオーバーレイとして表示
 * @param {string} props.className - 追加のCSSクラス名
 * @param {React.ReactNode} props.children - グラデーション内に表示する子要素
 * @returns {JSX.Element} グラデーション要素
 */
const Gradient = ({
  type = 'brand',
  direction = 'br',
  opacity = 1,
  overlay = false,
  className = '',
  children,
  ...props
}: GradientProps) => {
  const directionClasses: Record<GradientDirection, string> = {
    t: 'bg-gradient-to-t',
    tr: 'bg-gradient-to-tr',
    r: 'bg-gradient-to-r',
    br: 'bg-gradient-to-br',
    b: 'bg-gradient-to-b',
    bl: 'bg-gradient-to-bl',
    l: 'bg-gradient-to-l',
    tl: 'bg-gradient-to-tl',
  }

  const typeClasses: Record<GradientType, string> = {
    brand: 'from-[rgb(12,13,21)] via-[rgb(23,24,32)] to-[rgb(108,95,62)]/20',
    dark: 'from-black/50 to-transparent',
    light: 'from-white/10 to-transparent',
    primary: 'from-[rgb(108,95,62)] to-[rgb(12,13,21)]',
    secondary: 'from-[rgb(199,195,187)]/20 to-transparent',
  }

  const positionClasses = overlay ? 'absolute inset-0' : 'relative'

  const combinedClasses = `
    ${positionClasses}
    ${directionClasses[direction]}
    ${typeClasses[type]}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <div className={combinedClasses} style={{ opacity }} {...props}>
      {children}
    </div>
  )
}

export default Gradient
