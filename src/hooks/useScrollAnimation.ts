import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

/**
 * スクロールアニメーションを管理するカスタムフック
 *
 * Intersection Observer APIを使用して、要素が画面に表示されたタイミングを検出します。
 * 要素の可視状態を監視し、アニメーション効果のトリガーとして使用できます。
 *
 * @param options - スクロールアニメーションのオプション
 * @param options.threshold - 要素の可視割合の閾値（0.0〜1.0、デフォルト: 0.1）
 * @param options.rootMargin - ルート要素のマージン（デフォルト: '0px'）
 * @param options.triggerOnce - 一度だけトリガーするかどうか（デフォルト: true）
 * @returns スクロールアニメーション制御オブジェクト
 * - ref: 監視対象の要素にアタッチするRef
 * - isVisible: 要素が画面に表示されているかどうかの真偽値
 */
export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}
