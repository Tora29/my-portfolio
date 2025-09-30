import { useCallback } from 'react'
import { ANIMATION } from '../config/constants'

interface ScrollToReturn {
  scrollToElement: (elementId: string) => void
  scrollToTop: () => void
}

/**
 * ページ内スクロールを制御するカスタムフック
 *
 * 指定した要素へのスムーズスクロールやページトップへのスクロール機能を提供します。
 * アニメーション設定は constants.ts の ANIMATION 設定に基づきます。
 *
 * @returns スクロール制御関数を含むオブジェクト
 * - scrollToElement: 指定したIDの要素へスムーズにスクロールする関数
 * - scrollToTop: ページの最上部へスムーズにスクロールする関数
 */
const useScrollTo = (): ScrollToReturn => {
  const scrollToElement = useCallback((elementId: string): void => {
    if (!elementId) return

    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({
        behavior: ANIMATION.scrollSmooth,
        block: 'start',
      })
    }
  }, [])

  const scrollToTop = useCallback((): void => {
    window.scrollTo({
      top: 0,
      behavior: ANIMATION.scrollSmooth,
    })
  }, [])

  return {
    scrollToElement,
    scrollToTop,
  }
}

export default useScrollTo
