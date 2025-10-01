import { useMemo } from 'react'

interface UseCarouselCardVisibilityOptions {
  index: number
  displayIndex: number
  cardsToShow: number
}

interface CardVisibility {
  shouldRender: boolean
  opacity: number
  scale: number
  isCenter: boolean
}

/**
 * カルーセルカードの表示状態を計算するカスタムフック
 *
 * カードのインデックスと表示設定に基づいて、各カードの可視性、透明度、スケールを計算します。
 * レスポンシブ対応のため、表示枚数に応じた異なる表示ロジックを適用します。
 *
 * @param root0 - カード表示判定オプション
 * @param root0.index - 現在のカードのインデックス
 * @param root0.displayIndex - 中央に表示されるカードのインデックス
 * @param root0.cardsToShow - 同時に表示するカードの枚数（1, 2, または 3）
 * @returns カードの表示状態オブジェクト
 * - shouldRender: カードを描画するかどうか
 * - opacity: カードの透明度（0〜1）
 * - scale: カードのスケール（0〜1）
 * - isCenter: カードが中央に配置されているかどうか
 */
export const useCarouselCardVisibility = ({
  index,
  displayIndex,
  cardsToShow,
}: UseCarouselCardVisibilityOptions): CardVisibility => {
  return useMemo(() => {
    const isCenter = index === displayIndex
    const isRightSide = index === displayIndex + 1
    const isLeftSide = index === displayIndex - 1
    const isSide = isLeftSide || isRightSide

    let shouldRender = false
    let opacity = 1
    let scale = 1

    if (cardsToShow === 1) {
      // 1枚表示：中央フル表示、両脇は小さく薄く
      shouldRender = isCenter || isSide
      if (isSide) {
        opacity = 0.6
        scale = 0.85
      }
    } else if (cardsToShow === 2) {
      // 2枚表示：中央と右をフル表示
      shouldRender = isCenter || isRightSide
      if (!shouldRender) opacity = 0
    } else {
      // 3枚表示：中央と左右をフル表示
      shouldRender = isCenter || isSide
      if (!shouldRender) opacity = 0
    }

    return { shouldRender, opacity, scale, isCenter }
  }, [index, displayIndex, cardsToShow])
}
