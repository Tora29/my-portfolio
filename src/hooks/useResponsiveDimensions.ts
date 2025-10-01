import { useState, useEffect } from 'react'
import { BREAKPOINT_VALUES, CAROUSEL_BREAKPOINTS } from '../config/theme'

interface Dimensions {
  cardWidth: number
  gap: number
  cardsToShow: number
}

/**
 * カルーセルのレスポンシブな寸法を管理するカスタムフック
 *
 * ウィンドウサイズに応じてカルーセルのカード幅、間隔、表示枚数を動的に計算します。
 * ブレークポイントは以下の通り：
 * - モバイル（768px未満）: 1枚表示
 * - タブレット/小型デスクトップ（768px以上、1280px未満）: 2枚表示
 * - デスクトップ（1280px以上）: 3枚表示
 *
 * @returns カルーセルの寸法オブジェクト
 * - cardWidth: 各カードの幅（ピクセル単位）
 * - gap: カード間の間隔（ピクセル単位）
 * - cardsToShow: 同時に表示するカードの枚数
 */
export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    cardWidth: 380,
    gap: 40,
    cardsToShow: 3,
  })

  useEffect(() => {
    /**
     * ウィンドウサイズに基づいてカルーセルの寸法を更新する関数
     */
    const updateDimensions = () => {
      const width = window.innerWidth
      if (width < BREAKPOINT_VALUES.md) {
        // モバイル/タブレット: 1枚のみ表示（両脇が見えるように少し小さめ）
        const cardWidth = Math.min(280, width * 0.7)
        setDimensions({ cardWidth, gap: 12, cardsToShow: 1 })
      } else if (width < CAROUSEL_BREAKPOINTS.threeCards) {
        // 中サイズデスクトップ: 2枚表示
        const cardWidth = 380
        setDimensions({ cardWidth, gap: 32, cardsToShow: 2 })
      } else {
        // 大サイズデスクトップ: 3枚表示
        const cardWidth = 380
        setDimensions({ cardWidth, gap: 40, cardsToShow: 3 })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return dimensions
}
