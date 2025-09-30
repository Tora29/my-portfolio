import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import * as SimpleIcons from 'simple-icons/icons'
import type { SimpleIcon } from 'simple-icons'

interface CircularProgressProps {
  label: string
  level: number // 1-5
  icon: string // simple-icons または lucide-reactのアイコン名
  iconType?: 'simple' | 'lucide' // アイコンのタイプ（デフォルト: simple）
  size?: number
  delay?: number // アニメーション開始の遅延（ms）
}

// 型ガード関数
/**
 * Lucideアイコンかどうかを判定する型ガード関数
 * @param icon - 判定対象のアイコン
 * @returns Lucideアイコンの場合true
 */
const isLucideIcon = (icon: unknown): icon is LucideIcon => {
  return typeof icon === 'function'
}

/**
 * Simple Iconかどうかを判定する型ガード関数
 * @param icon - 判定対象のアイコン
 * @returns Simple Iconの場合true
 */
const isSimpleIcon = (icon: unknown): icon is SimpleIcon => {
  return (
    typeof icon === 'object' &&
    icon !== null &&
    'svg' in icon &&
    typeof (icon as SimpleIcon).svg === 'string'
  )
}

/**
 * セグメント式の円形プログレスバーコンポーネント
 * @param root0 - プロパティオブジェクト
 * @param root0.label - 表示するラベルテキスト
 * @param root0.level - プログレスレベル（1-5）
 * @param root0.icon - アイコン名（simple-iconsまたはlucide-react）
 * @param root0.iconType - アイコンのタイプ（デフォルト: 'simple'）
 * @param root0.size - 円のサイズ（ピクセル、デフォルト: 100）
 * @param root0.delay - アニメーション開始の遅延（ミリ秒、デフォルト: 0）
 * @returns 円形プログレスバーのJSX要素
 */
const CircularProgress = ({
  label,
  level,
  icon,
  iconType = 'simple',
  size = 100,
  delay = 0,
}: CircularProgressProps) => {
  const [animatedLevel, setAnimatedLevel] = useState(0)

  // アニメーション効果
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(level)
    }, delay)

    return () => clearTimeout(timer)
  }, [level, delay])

  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const segments = 5
  const gapAngle = 3 // 各セグメント間のギャップ角度（度）
  const segmentAngle = (360 - gapAngle * segments) / segments // 各セグメントの角度
  const segmentLength = (circumference * segmentAngle) / 360
  const gapLength = (circumference * gapAngle) / 360

  // 各セグメントの色（薄い→濃い）と明度
  /**
   * セグメントの色を計算
   * @param segmentIndex - セグメントのインデックス
   * @returns RGB形式の色文字列
   */
  const getSegmentColor = (segmentIndex: number) => {
    // RGB値を段階的に明るく（暗い茶色→明るい金色）
    const r = 40 + (segmentIndex / (segments - 1)) * 180 // 40 → 220
    const g = 35 + (segmentIndex / (segments - 1)) * 175 // 35 → 210
    const b = 20 + (segmentIndex / (segments - 1)) * 110 // 20 → 130
    return `rgb(${r}, ${g}, ${b})`
  }

  // アイコンを取得
  /**
   * アイコンコンポーネントをレンダリング
   * @returns アイコンのJSX要素
   */
  const renderIcon = () => {
    if (iconType === 'lucide') {
      const IconComponent = (Icons as Record<string, unknown>)[icon]

      if (isLucideIcon(IconComponent)) {
        return (
          <IconComponent className="text-primary w-8 h-8 sm:w-10 sm:h-10" />
        )
      }

      // フォールバック
      return <Icons.Circle className="text-primary w-8 h-8 sm:w-10 sm:h-10" />
    } else {
      // Simple Icons
      const simpleIcon = (SimpleIcons as Record<string, unknown>)[icon]

      if (isSimpleIcon(simpleIcon)) {
        return (
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="w-8 h-8 sm:w-10 sm:h-10 fill-primary"
            dangerouslySetInnerHTML={{ __html: simpleIcon.svg }}
          />
        )
      }

      // フォールバック
      return <Icons.Circle className="text-primary w-8 h-8 sm:w-10 sm:h-10" />
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            {/* 各セグメント用の光るグラデーション */}
            {Array.from({ length: segments }).map((_, index) => (
              <filter key={`glow-${index}`} id={`glow-${index}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>
          {/* 各セグメントを描画 */}
          {Array.from({ length: segments }).map((_, index) => {
            const startOffset = index * (segmentLength + gapLength)
            const isActive = index < animatedLevel

            // 非アクティブなセグメントは表示しない
            if (!isActive) return null

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={getSegmentColor(index)}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-startOffset}
                strokeLinecap="butt"
                filter={`url(#glow-${index})`}
                className="transition-all duration-1500 ease-out"
                style={{
                  transitionDelay: `${index * 200}ms`,
                }}
              />
            )
          })}
        </svg>
        {/* 中央のアイコン */}
        <div className="absolute inset-0 flex items-center justify-center">
          {renderIcon()}
        </div>
      </div>
      {/* 下にテキスト */}
      <span className="text-primary text-xs sm:text-sm font-medium text-center">
        {label}
      </span>
    </div>
  )
}

export default CircularProgress
