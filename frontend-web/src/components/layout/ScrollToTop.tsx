import { useEffect } from 'react'
import { useLocation } from 'react-router'

export function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Restaura a posição de rolagem para o topo em cada mudança de rota
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      })
    } catch {
      window.scrollTo(0, 0)
    }
  }, [pathname, search])

  return null
}
