import { useState, useEffect } from 'react'

interface UseModalAnimationOptions {
  isOpen: boolean
  animationDuration?: number
}

interface ModalAnimationState {
  isVisible: boolean
  shouldRender: boolean
}

/**
 * モーダルのアニメーション状態を管理するカスタムフック
 *
 * モーダルの開閉時にフェードイン/フェードアウトアニメーションを実現するため、
 * DOM のマウント/アンマウントタイミングとアニメーション状態を分離して管理します。
 *
 * @param root0 - モーダルアニメーションのオプション
 * @param root0.isOpen - モーダルが開いているかどうか
 * @param root0.animationDuration - アニメーションの持続時間（ミリ秒、デフォルト: 200）
 * @returns モーダルアニメーション状態オブジェクト
 * - isVisible: CSS トランジションをトリガーするための可視性フラグ
 * - shouldRender: DOM にマウントするかどうかのフラグ
 */
export const useModalAnimation = ({
  isOpen,
  animationDuration = 200,
}: UseModalAnimationOptions): ModalAnimationState => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // 1. DOM にマウント
      setShouldRender(true)
      // 2. 次フレームでアニメーション開始
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
    } else {
      // 1. アニメーション終了
      setIsVisible(false)
      // 2. アニメーション完了後にアンマウント
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, animationDuration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, animationDuration])

  return { isVisible, shouldRender }
}
