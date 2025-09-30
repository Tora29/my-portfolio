import { useState, useCallback } from 'react'
import { CAROUSEL_LAYOUT } from '../config/theme'

interface UseCarouselTouchOptions {
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

/**
 * カルーセルのタッチイベントを管理するカスタムフック
 *
 * モバイルデバイスでのスワイプ操作を検出し、左右のスワイプに応じた
 * コールバック関数を実行します。設定された閾値を超えるスワイプのみを有効な操作として認識します。
 *
 * @param root0 - タッチイベントオプション
 * @param root0.onSwipeLeft - 左方向にスワイプした際に実行されるコールバック関数（次のカードに移動）
 * @param root0.onSwipeRight - 右方向にスワイプした際に実行されるコールバック関数（前のカードに移動）
 * @returns タッチイベントハンドラーオブジェクト
 * - handleTouchStart: タッチ開始時のイベントハンドラー
 * - handleTouchMove: タッチ移動中のイベントハンドラー
 * - handleTouchEnd: タッチ終了時のイベントハンドラー（スワイプ判定を実行）
 */
export const useCarouselTouch = ({
  onSwipeLeft,
  onSwipeRight,
}: UseCarouselTouchOptions) => {
  // タッチ位置を単一のオブジェクトで管理
  const [touchPosition, setTouchPosition] = useState({ start: 0, end: 0 })

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchPosition((prev) => ({ ...prev, start: e.targetTouches[0].clientX }))
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchPosition((prev) => ({ ...prev, end: e.targetTouches[0].clientX }))
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchPosition.start || !touchPosition.end) return

    const distance = touchPosition.start - touchPosition.end
    const isLeftSwipe = distance > CAROUSEL_LAYOUT.swipeThreshold
    const isRightSwipe = distance < -CAROUSEL_LAYOUT.swipeThreshold

    if (isLeftSwipe) {
      onSwipeLeft()
    }
    if (isRightSwipe) {
      onSwipeRight()
    }

    setTouchPosition({ start: 0, end: 0 })
  }, [touchPosition, onSwipeLeft, onSwipeRight])

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
