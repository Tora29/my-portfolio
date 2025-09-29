import React, { useState, useEffect, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps {
  children: ReactNode
}

const Carousel = ({ children }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const items = React.Children.toArray(children)

  // レスポンシブ対応：画面サイズに応じたカード幅とgapを管理
  const [dimensions, setDimensions] = useState({
    cardWidth: 380,
    gap: 40,
  })

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      if (width < 640) {
        // モバイル
        setDimensions({ cardWidth: 280, gap: 4 })
      } else if (width < 768) {
        // タブレット
        setDimensions({ cardWidth: 340, gap: 8 })
      } else {
        // デスクトップ
        setDimensions({ cardWidth: 380, gap: 40 })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // 無限ループのためにアイテムを3倍に複製
  const extendedItems = items.length > 0 ? [...items, ...items, ...items] : []

  // 実際の表示位置を計算（中央のセットの最初から開始）
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

  // タッチイベントハンドラ
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    }
    if (isRightSwipe) {
      goToPrevious()
    }

    setTouchStart(0)
    setTouchEnd(0)
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

  // レスポンシブ対応：中央のカードを画面中央に配置するための計算
  const offset = displayIndex * (dimensions.cardWidth + dimensions.gap)

  return (
    <div className="relative w-full h-48 sm:h-56 md:h-60 my-8 md:my-12">
      <div className="hidden md:block absolute inset-y-12 sm:inset-y-14 md:inset-y-16 left-4 sm:left-8 md:left-14 right-4 sm:right-8 md:right-14 bg-[rgb(108,95,62)]/50 rounded-lg opacity-50"></div>

      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-2 sm:left-8 md:left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[rgb(12,13,21)] rounded-full shadow-[0px_0px_8px_0px_rgba(199,195,187,1.00)] items-center justify-center hover:bg-[rgb(108,95,62)] transition-colors disabled:opacity-50"
        disabled={isTransitioning}
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[rgb(199,195,187)]" />
      </button>

      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-2 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[rgb(12,13,21)] rounded-full shadow-[0px_0px_8px_0px_rgba(199,195,187,1.00)] items-center justify-center hover:bg-[rgb(108,95,62)] transition-colors disabled:opacity-50"
        disabled={isTransitioning}
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[rgb(199,195,187)]" />
      </button>

      <div
        className="absolute inset-x-0 top-0 h-48 sm:h-56 md:h-60 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center items-center h-full">
          <div className="relative w-full max-w-[1200px] overflow-hidden">
            <div
              className={`flex ${
                isTransitioning
                  ? 'transition-transform duration-500 ease-in-out'
                  : ''
              }`}
              style={{
                gap: `${dimensions.gap}px`,
                transform: `translateX(calc(50% - ${offset}px - ${dimensions.cardWidth / 2}px))`,
              }}
            >
              {extendedItems.map((item, index) => {
                // 中央に表示されているのは displayIndex
                const isCenter = index === displayIndex
                const isSide =
                  index === displayIndex - 1 || index === displayIndex + 1
                return (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px] transition-all duration-300 ${
                      isCenter
                        ? 'scale-100 md:scale-100 opacity-100'
                        : isSide
                          ? 'scale-[0.75] md:scale-100 opacity-40 md:opacity-100'
                          : 'scale-100 md:scale-100 opacity-100'
                    }`}
                  >
                    {React.cloneElement(
                      item as React.ReactElement<{ isCenter?: boolean }>,
                      {
                        isCenter,
                      }
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carousel
