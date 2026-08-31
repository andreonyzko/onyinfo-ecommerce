import { Eye, EyeOff, Filter } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

interface FilterToggleProps {
  isDesktopVisible: boolean
  onToggleDesktop: () => void
  onOpenMobile: () => void
  activeFilterCount?: number
  className?: string
}

export function FilterToggle({
  isDesktopVisible,
  onToggleDesktop,
  onOpenMobile,
  activeFilterCount = 0,
  className,
}: FilterToggleProps) {
  return (
    <div className={cn('flex items-center gap-2 shrink-0', className)}>
      {/* Botão de Toggle para Desktop */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onToggleDesktop}
        className="hidden lg:inline-flex items-center gap-1.5 cursor-pointer text-xs h-9 shrink-0 whitespace-nowrap"
        aria-label={isDesktopVisible ? 'Ocultar barra de filtros' : 'Mostrar barra de filtros'}
      >
        {isDesktopVisible ? (
          <>
            <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Ocultar Filtros</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Mostrar Filtros</span>
          </>
        )}
        {activeFilterCount > 0 && (
          <Badge variant="default" className="ml-1 px-1.5 py-0 text-[10px] h-4">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {/* Botão de Toggle para Mobile (Abre a Sheet) */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onOpenMobile}
        className="lg:hidden gap-1.5 cursor-pointer text-xs h-9 shrink-0 whitespace-nowrap"
        aria-label="Abrir filtros"
      >
        <Filter className="w-3.5 h-3.5" />
        <span>Filtros</span>
        {activeFilterCount > 0 && (
          <Badge variant="default" className="ml-1 px-1.5 py-0 text-[10px] h-4">
            {activeFilterCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}
