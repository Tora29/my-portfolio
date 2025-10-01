import React, { useState, useEffect, useMemo, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions'
import { useCarouselLayout } from '../hooks/useCarouselLayout'
import { useCarouselTouch } from '../hooks/useCarouselTouch'
import { CAROUSEL_TRANSITION_DURATION } from '../config/theme'

interface CarouselProps {
  children: ReactNode
}

/**
 * 無限ループ対応のカルーセルコンポーネント
 * @param root0 - プロパティオブジェクト
 * @param root0.children - カルーセル内に表示する子要素
 * @returns カルーセルのJSX要素
 */
const Carousel = ({ children }: CarouselProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const items = React.Children.toArray(children)
  const dimensions = useResponsiveDimensions()

  // 無限ループのためにアイテムを3倍に複製
  const extendedItems = useMemo(
    () => (items.length > 0 ? [...items, ...items, ...items] : []),
    [items]
  )

  // 実際の表示位置を計算（中央のセットの最初から開始）
  const displayIndex = currentIndex + items.length

  /**
   * 前のアイテムに移動
   */
  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }

  /**
   * 次のアイテムに移動
   */
  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }

  // タッチイベントハンドラ
  const { handleTouchStart, handleTouchMove, handleTouchEnd } =
    useCarouselTouch({
      onSwipeLeft: goToNext,
      onSwipeRight: goToPrevious,
    })

  // トランジション管理
  useEffect(() => {
    if (!isTransitioning) return

    const timer = window.setTimeout(() => {
      setIsTransitioning(false)
    }, CAROUSEL_TRANSITION_DURATION)

    return () => window.clearTimeout(timer)
  }, [isTransitioning])

  // 無限ループ位置リセット
  useEffect(() => {
    if (isTransitioning) return

    if (currentIndex === -items.length || currentIndex === items.length) {
      setCurrentIndex(0)
    }
  }, [currentIndex, items.length, isTransitioning])

  // レイアウト計算
  const layoutConfig = useCarouselLayout({
    displayIndex,
    cardWidth: dimensions.cardWidth,
    gap: dimensions.gap,
    cardsToShow: dimensions.cardsToShow,
  })

  if (items.length === 0) return null

  return (
    <div
      ref={ref}
      className={`relative w-full h-48 sm:h-56 md:h-60 my-8 md:my-12 pb-8 overflow-x-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="flex justify-center items-center h-full">
        <div
          className={`relative ${
            dimensions.cardsToShow === 1
              ? 'overflow-visible'
              : 'overflow-hidden'
          }`}
          style={
            dimensions.cardsToShow === 1
              ? { width: '100vw' }
              : { width: `${layoutConfig.carouselWidth}px`, maxWidth: '100vw' }
          }
        >
          {/* 背景の帯 - デスクトップのみ */}
          <div
            className="hidden md:block absolute top-16 bottom-[-2rem] bg-[rgb(108,95,62)]/50 rounded-lg opacity-50"
            style={{
              left: `${-layoutConfig.bandExtension}px`,
              right: `${-layoutConfig.bandExtension}px`,
            }}
          ></div>

          {/* 左ボタン - デスクトップのみ */}
          <button
            onClick={goToPrevious}
            className="hidden md:flex absolute top-[50%] -translate-y-1/2 z-20 w-14 h-14 bg-[rgb(12,13,21)] rounded-full shadow-[0px_0px_8px_0px_rgba(199,195,187,1.00)] items-center justify-center hover:bg-[rgb(108,95,62)] transition-colors disabled:opacity-50"
            style={{ left: `${-layoutConfig.sideMargin}px` }}
            disabled={isTransitioning}
          >
            <ChevronLeft className="w-8 h-8 text-[rgb(199,195,187)]" />
          </button>

          {/* 右ボタン - デスクトップのみ */}
          <button
            onClick={goToNext}
            className="hidden md:flex absolute top-[50%] -translate-y-1/2 z-20 w-14 h-14 bg-[rgb(12,13,21)] rounded-full shadow-[0px_0px_8px_0px_rgba(199,195,187,1.00)] items-center justify-center hover:bg-[rgb(108,95,62)] transition-colors disabled:opacity-50"
            style={{ right: `${-layoutConfig.sideMargin}px` }}
            disabled={isTransitioning}
          >
            <ChevronRight className="w-8 h-8 text-[rgb(199,195,187)]" />
          </button>

          {/* カードコンテナ */}
          <div
            className={`h-48 sm:h-56 md:h-60 ${
              dimensions.cardsToShow === 1
                ? 'overflow-visible'
                : 'overflow-hidden'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`flex ${
                isTransitioning
                  ? 'transition-transform duration-500 ease-in-out'
                  : ''
              }`}
              style={{
                gap: `${dimensions.gap}px`,
                transform:
                  dimensions.cardsToShow === 1
                    ? `translateX(calc(50% - ${layoutConfig.offset}px - ${dimensions.cardWidth / 2}px))`
                    : `translateX(calc(50% - ${layoutConfig.offset}px - ${dimensions.cardWidth / 2}px + ${layoutConfig.translateAdjustment}px))`,
              }}
            >
              {extendedItems.map((item, index) => {
                // 中央に表示されているのは displayIndex
                const isCenter = index === displayIndex
                const isRightSide = index === displayIndex + 1
                const isLeftSide = index === displayIndex - 1
                const isSide = isLeftSide || isRightSide

                // 表示枚数に応じて表示判定
                let shouldRender = false
                let opacity = 1
                let scale = 1

                if (dimensions.cardsToShow === 1) {
                  // 1枚表示：中央フル表示、両脇は小さく薄く
                  shouldRender = isCenter || isSide
                  if (isSide) {
                    opacity = 0.6
                    scale = 0.75
                  }
                } else if (dimensions.cardsToShow === 2) {
                  // 2枚表示：中央と右をフル表示
                  shouldRender = isCenter || isRightSide
                  if (!shouldRender) opacity = 0
                } else {
                  // 3枚表示：中央と左右をフル表示
                  shouldRender = isCenter || isSide
                  if (!shouldRender) opacity = 0
                }

                return (
                  <div
                    key={index}
                    className={`flex-shrink-0 transition-all duration-300`}
                    style={{
                      width: `${dimensions.cardWidth}px`,
                      opacity,
                      transform: `scale(${scale})`,
                      visibility: shouldRender ? 'visible' : 'hidden',
                    }}
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
