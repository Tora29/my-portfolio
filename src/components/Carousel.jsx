import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Carousel = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const items = React.Children.toArray(children)

  // 無限ループのためにアイテムを3倍に複製
  const extendedItems = items.length > 0 ? [...items, ...items, ...items] : []

  // 実際の表示位置を計算（中央のセットを表示）
  const displayIndex = currentIndex + items.length

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }

  // 無限ループの処理
  useEffect(() => {
    if (isTransitioning) {
      const timer = window.setTimeout(() => {
        setIsTransitioning(false)
      }, 500)
      return () => window.clearTimeout(timer)
    }

    // アニメーション無しで位置をリセット
    if (currentIndex === -items.length) {
      setCurrentIndex(0)
    } else if (currentIndex === items.length) {
      setCurrentIndex(0)
    }
  }, [currentIndex, items.length, isTransitioning])

  if (items.length === 0) return null

  // 3つのアイテムを中央に配置するための計算
  const offset = displayIndex * 420 - 420

  return (
    <div className="relative w-full h-60 my-12">
      <div className="absolute inset-y-16 left-14 right-14 bg-[rgb(108,95,62)]/50 rounded-lg opacity-50"></div>

      <button
        onClick={goToPrevious}
        className="absolute left-16 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-[rgb(12,13,21)] rounded-full shadow-[0px_0px_8px_0px_rgba(199,195,187,1.00)] flex items-center justify-center hover:bg-[rgb(108,95,62)] transition-colors disabled:opacity-50"
        disabled={isTransitioning}
      >
        <ChevronLeft className="w-8 h-8 text-[rgb(199,195,187)]" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-16 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-[rgb(12,13,21)] rounded-full shadow-[0px_0px_8px_0px_rgba(199,195,187,1.00)] flex items-center justify-center hover:bg-[rgb(108,95,62)] transition-colors disabled:opacity-50"
        disabled={isTransitioning}
      >
        <ChevronRight className="w-8 h-8 text-[rgb(199,195,187)]" />
      </button>

      <div className="absolute inset-x-0 top-0 h-60 overflow-hidden">
        <div className="flex justify-center items-center h-full">
          <div className="relative w-full max-w-[1200px] overflow-hidden">
            <div
              className={`flex gap-10 ${
                isTransitioning
                  ? 'transition-transform duration-500 ease-in-out'
                  : ''
              }`}
              style={{
                transform: `translateX(calc(50% - ${offset}px - 190px))`,
              }}
            >
              {extendedItems.map((item, index) => (
                <div key={index} className="flex-shrink-0 w-[380px]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carousel
