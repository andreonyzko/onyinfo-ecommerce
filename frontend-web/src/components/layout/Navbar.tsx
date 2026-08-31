import { NavLink } from 'react-router'
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Category } from '../../types'
import { useHorizontalScroll } from '../../hooks'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface NavbarProps {
  categories: Category[]
}

export function Navbar({ categories }: NavbarProps) {
  const { scrollRef, canScrollLeft, canScrollRight, scrollBy } =
    useHorizontalScroll<HTMLDivElement>()

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <nav
      className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-16 z-30 shadow-xs group"
      aria-label="Navegação por categorias"
    >
      <div className="container mx-auto px-4 relative flex items-center">
        {/* Botão de Scroll Esquerda (Desktop) */}
        {canScrollLeft && (
          <div className="hidden md:flex absolute left-2 z-10 items-center">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => scrollBy(-220)}
              className="h-7 w-7 rounded-full bg-background/90 backdrop-blur-xs border-border shadow-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
              aria-label="Rolar categorias para a esquerda"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Gradiente Esquerdo de Fade */}
        {canScrollLeft && (
          <div
            className="hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-background/90 to-transparent pointer-events-none z-5"
            aria-hidden="true"
          />
        )}

        {/* Container com Rolagem Horizontal Suave */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar scroll-smooth w-full"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              )
            }
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos os Departamentos</span>
          </NavLink>

          {categories.map((category) => (
            <NavLink
              key={category.slug}
              to={`/categoria/${category.slug}`}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0',
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                )
              }
            >
              <span>{category.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Gradiente Direito de Fade */}
        {canScrollRight && (
          <div
            className="hidden md:block absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-background/90 to-transparent pointer-events-none z-5"
            aria-hidden="true"
          />
        )}

        {/* Botão de Scroll Direita (Desktop) */}
        {canScrollRight && (
          <div className="hidden md:flex absolute right-2 z-10 items-center">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => scrollBy(220)}
              className="h-7 w-7 rounded-full bg-background/90 backdrop-blur-xs border-border shadow-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
              aria-label="Rolar categorias para a direita"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
