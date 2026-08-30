import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items || items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground',
        className
      )}
    >
      <Link to="/" className="hover:text-foreground transition-colors">
        Home
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-1.5 min-w-0">
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
            {isLast || !item.href ? (
              <span
                className={cn(
                  'truncate max-w-[200px] sm:max-w-xs md:max-w-md',
                  isLast ? 'text-foreground font-semibold' : 'text-muted-foreground'
                )}
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-xs"
                title={item.label}
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
