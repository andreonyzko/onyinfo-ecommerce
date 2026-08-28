import { NavLink } from 'react-router'
import type { Category } from '../../types'
import { cn } from '../../lib/utils'
import { Layers } from 'lucide-react'

interface NavbarProps {
  categories: Category[]
}

export function Navbar({ categories }: NavbarProps) {
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <nav
      className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-16 z-30 shadow-xs"
      aria-label="Navegação por categorias"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
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

          <div className="h-4 w-px bg-border shrink-0 my-auto mx-1" />

          {categories.map((category) => (
            <NavLink
              key={category.slug}
              to={`/categoria/${category.slug}`}
              className={({ isActive }) =>
                cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                )
              }
            >
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
