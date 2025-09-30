import { useMemo } from 'react'
import { CAROUSEL_LAYOUT } from '../config/theme'

interface CarouselLayoutOptions {
  displayIndex: number
  cardWidth: number
  gap: number
  cardsToShow: number
}

interface CarouselLayout {
  offset: number
  translateAdjustment: number
  carouselWidth: number
  sideMargin: number
  bandExtension: number
}

/**
 * カルーセルのレイアウト計算を行うカスタムフック
 *
 * 現在の表示インデックスとカードサイズに基づいて、カルーセルの表示位置やオフセット値を計算します。
 * レスポンシブ対応のため、画面サイズに応じた表示枚数に対応した計算を行います。
 *
 * @param root0 - レイアウトオプション
 * @param root0.displayIndex - 現在表示中のカードのインデックス（中央に表示するカードの位置）
 * @param root0.cardWidth - 各カードの幅（ピクセル単位）
 * @param root0.gap - カード間の間隔（ピクセル単位）
 * @param root0.cardsToShow - 同時に表示するカードの枚数（1, 2, または 3）
 * @returns カルーセルレイアウトオブジェクト
 * - offset: 中央のカードを画面中央に配置するためのオフセット値
 * - translateAdjustment: 2枚表示時の位置調整値
 * - carouselWidth: カルーセル全体の幅
 * - sideMargin: カルーセル両端の余白
 * - bandExtension: 帯状背景の拡張幅
 */
export const useCarouselLayout = ({
  displayIndex,
  cardWidth,
  gap,
  cardsToShow,
}: CarouselLayoutOptions): CarouselLayout => {
  return useMemo(() => {
    // 中央のカードを画面中央に配置するための計算
    const offset = displayIndex * (cardWidth + gap)

    // レイアウト設定を表示枚数に応じて計算
    const translateAdjustment = cardsToShow === 2 ? -(cardWidth + gap) / 2 : 0

    const carouselWidth =
      cardsToShow === 1
        ? cardWidth
        : cardWidth * cardsToShow + gap * (cardsToShow - 1)

    const bandExtension =
      cardsToShow === 2
        ? CAROUSEL_LAYOUT.bandExtension.twoCards
        : CAROUSEL_LAYOUT.bandExtension.threeCards

    return {
      offset,
      translateAdjustment,
      carouselWidth,
      sideMargin: CAROUSEL_LAYOUT.sideMargin,
      bandExtension,
    }
  }, [displayIndex, cardWidth, gap, cardsToShow])
}
