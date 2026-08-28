import { useState, useEffect } from 'react'
import { Maximize2, X, Zap } from 'lucide-react'
import type { Product, Category } from '../../types'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface ProductGalleryProps {
  product: Product
  category?: Category
}

export function ProductGallery({ product, category }: ProductGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Fecha o lightbox com tecla Escape
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen])

  return (
    <div className="space-y-3">
      {/* Barra de Badges Nítidos no Topo da Imagem */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="font-bold text-xs uppercase tracking-wider">
            {product.brand}
          </Badge>
          {category && (
            <Badge variant="outline" className="text-xs bg-card">
              {category.name}
            </Badge>
          )}
        </div>

        <Badge variant="success" className="font-bold text-xs">
          <Zap className="w-3 h-3 mr-1" /> 5% OFF PIX
        </Badge>
      </div>

      {/* Container Direto da Imagem (Sem Moldura Pesada, com Sombra Nítida) */}
      <div className="relative flex items-center justify-center min-h-[300px] md:min-h-[380px] p-2 select-none group">
        <img
          src={product.image}
          alt={product.name}
          loading="eager"
          onClick={() => setIsLightboxOpen(true)}
          className="max-h-[300px] md:max-h-[380px] w-auto max-w-full object-contain cursor-zoom-in drop-shadow-lg transition-transform duration-300 ease-out hover:scale-105"
        />

        {/* Botão Discreto de Expansão */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-2 right-2 p-2 rounded-lg border border-border bg-card/90 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-xs"
          aria-label="Ver imagem em tela cheia"
          title="Ver em tela cheia"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Modal Lightbox em Tela Cheia Minimalista */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in-0 duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Barra Superior */}
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white pb-3 border-b border-white/10 mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="truncate pr-4">
              <span className="text-xs text-white/60 font-mono block">
                {product.brand} &bull; Visualização em Alta Resolução
              </span>
              <h3 className="text-sm md:text-base font-semibold truncate text-white">
                {product.name}
              </h3>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLightboxOpen(false)}
              className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Imagem Ampliada Centralizada */}
          <div
            className="w-full max-w-4xl flex-1 flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[75vh] max-w-full object-contain drop-shadow-2xl select-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
