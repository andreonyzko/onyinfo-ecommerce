import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Search, ShoppingCart, Video, X } from 'lucide-react'
import { useCartStore } from '../../stores'
import { ThemeToggle } from './ThemeToggle'
import { buttonVariants } from '../ui/button'
import { cn } from '../../lib/utils'

const BASE_URL = import.meta.env.BASE_URL || '/'

function formatAssetUrl(path: string): string {
  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

export function Header() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const subtotal = useCartStore((state) => state.getSubtotal())

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/busca?q=${encodeURIComponent(trimmed)}`)
    } else {
      navigate('/busca')
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    if (searchParams.has('q')) {
      navigate('/busca')
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label="OnyInfo E-Commerce Home"
          >
            {/* Logo para Dark Mode */}
            <img
              src={formatAssetUrl('/onyinfo-white.png')}
              alt="OnyInfo"
              className="h-8 w-auto hidden dark:block"
            />
            {/* Logo para Light Mode */}
            <img
              src={formatAssetUrl('/onyinfo-black.png')}
              alt="OnyInfo"
              className="h-8 w-auto block dark:hidden"
            />
          </Link>

          {/* Barra de Pesquisa Global */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl hidden sm:flex items-center relative"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por placa de vídeo, processador, marca..."
                className="w-full h-10 pl-10 pr-10 rounded-full border border-border bg-muted/40 px-3 py-1 text-sm shadow-xs transition-colors focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Ações do Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão Como Fiz (Defesa Técnica) */}
            <Link
              to="/como-fiz"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Como Fiz</span>
            </Link>

            {/* Alternador de Tema */}
            <ThemeToggle />

            {/* Botão do Carrinho */}
            <Link
              to="/checkout"
              aria-label="Ir para o carrinho de compras"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'default' }),
                'relative rounded-full h-10 px-3.5 border-border bg-card hover:bg-accent hover:text-accent-foreground shadow-xs gap-2'
              )}
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-in zoom-in-50 duration-200">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-medium text-xs">
                {subtotal > 0
                  ? subtotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                  : 'Carrinho'}
              </span>
            </Link>
          </div>
        </div>

        {/* Barra de Pesquisa Mobile */}
        <div className="pb-3 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar hardware..."
              className="w-full h-9 pl-9 pr-9 rounded-full border border-border bg-muted/40 px-3 text-xs shadow-xs focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </form>
        </div>
      </div>
    </header>
  )
}
