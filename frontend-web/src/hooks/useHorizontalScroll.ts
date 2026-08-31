import { useState, useRef, useEffect, useCallback } from 'react'

export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>() {
  const scrollRef = useRef<T>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollability = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    // Tolerância de 2px para subpixels de arredondamento no navegador
    setCanScrollLeft(scrollLeft > 2)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2)
  }, [])

  useEffect(() => {
    checkScrollability()
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => checkScrollability()
    el.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkScrollability)

    return () => {
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkScrollability)
    }
  }, [checkScrollability])

  const scrollBy = (offset: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    checkScrollability,
    scrollBy,
  }
}
