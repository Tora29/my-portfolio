import { useCallback } from 'react'
import { ANIMATION } from '../config/constants'

interface ScrollToReturn {
  scrollToElement: (elementId: string) => void
  scrollToTop: () => void
}

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
