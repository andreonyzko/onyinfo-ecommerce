import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  className?: string
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationControlsProps) {
  if (totalItems === 0) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Gera lista de números de páginas
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/80 select-none',
        className
      )}
    >
      {/* Indicador Textual de Exibição */}
      <div className="text-xs text-muted-foreground font-medium">
        Exibindo <span className="font-bold text-foreground">{startItem}-{endItem}</span> de{' '}
        <span className="font-bold text-foreground">{totalItems}</span> produtos
      </div>

      {/* Controles de Navegação de Página */}
      {totalPages > 1 && (
        <nav aria-label="Paginação do catálogo" className="flex items-center gap-1.5">
          {/* Botão Anterior */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage <= 1}
            className="h-8 px-2.5 gap-1 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          {/* Números das Páginas */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
                  >
                    ...
                  </span>
                )
              }

              const pageNum = Number(page)
              const isCurrent = pageNum === currentPage

              return (
                <Button
                  key={`page-${pageNum}`}
                  type="button"
                  variant={isCurrent ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    'h-8 w-8 p-0 text-xs font-bold cursor-pointer transition-all',
                    isCurrent ? 'shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-label={`Ir para a página ${pageNum}`}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          {/* Botão Próximo */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="h-8 px-2.5 gap-1 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed"
            aria-label="Próxima página"
          >
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </nav>
      )}
    </div>
  )
}
