import { useEffect, ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from './index'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

/**
 * モーダルダイアログを表示するコンポーネント
 * React Portalを使用してbody直下に描画され、開閉アニメーションとEscキー対応を含む
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {boolean} props.isOpen - モーダルの表示/非表示状態
 * @param {Function} props.onClose - モーダルを閉じる際に呼び出されるコールバック関数
 * @param {ReactNode} props.children - モーダル内に表示するコンテンツ
 * @returns {JSX.Element|null} モーダル要素またはnull
 */
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  // モーダルの表示/非表示アニメーション
  useEffect(() => {
    if (isOpen) {
      // 1. DOMにマウント
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
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Escキーで閉じる & スクロール制御
  useEffect(() => {
    if (!shouldRender) return

    /**
     * Escapeキーが押された際にモーダルを閉じるハンドラー
     *
     * @param {KeyboardEvent} e - キーボードイベントオブジェクト
     * @returns {void}
     */
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [shouldRender, onClose])

  // 完全にアンマウントされている場合はDOMに描画しない
  if (!shouldRender) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* モーダルコンテンツ */}
      <div
        className={`relative bg-[rgb(23,24,32)] rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.8)] max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10 transition-all duration-200 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          background:
            'linear-gradient(135deg, rgb(23,24,32) 0%, rgb(18,19,27) 50%, rgb(23,24,32) 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 hover:bg-[rgb(108,95,62)]/20"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* コンテンツ */}
        <div className="p-6 sm:p-8 md:p-10">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
