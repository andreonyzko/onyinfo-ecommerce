import { useState, useEffect } from 'react'
import { Maximize2, X, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product, Category } from '../../types'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface ProductGalleryProps {
  product: Product
  category?: Category
}

export function ProductGallery({ product, category }: ProductGalleryProps) {
  const images = product.images.length > 0 ? product.images : ['https://placehold.co/400x400/1e293b/f8fafc?text=Sem+Imagem']
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [prevProductId, setPrevProductId] = useState(product.id)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Reseta o índice de imagem quando o produto muda
  if (prevProductId !== product.id) {
    setPrevProductId(product.id)
    setSelectedImageIndex(0)
  }

  // Atalhos de teclado no Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev + 1) % images.length)
      }
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, images.length])

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const activeImage = images[selectedImageIndex] || images[0]

  return (
    <div className="space-y-4">
      {/* Barra de Badges no Topo da Imagem */}
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

      {/* Container Principal da Imagem */}
      <div className="relative flex items-center justify-center min-h-[300px] md:min-h-[380px] p-4 select-none group bg-card/40 rounded-2xl border border-border/70">
        <img
          src={activeImage}
          alt={`${product.name} - Imagem ${selectedImageIndex + 1}`}
          loading="eager"
          onClick={() => setIsLightboxOpen(true)}
          className="max-h-[280px] md:max-h-[360px] w-auto max-w-full object-contain cursor-zoom-in drop-shadow-lg transition-all duration-300 ease-out hover:scale-105"
        />

        {/* Setas de Navegação Entre as Imagens */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border/80 bg-card/90 hover:bg-accent text-foreground transition-all shadow-md cursor-pointer opacity-80 hover:opacity-100"
              aria-label="Imagem anterior"
              title="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border/80 bg-card/90 hover:bg-accent text-foreground transition-all shadow-md cursor-pointer opacity-80 hover:opacity-100"
              aria-label="Próxima imagem"
              title="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicador Numérico Discreto de Imagens */}
            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-xs border border-border text-[11px] font-mono text-muted-foreground font-semibold select-none">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* Botão de Expansão em Tela Cheia */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-3 right-3 p-2 rounded-lg border border-border bg-card/90 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-xs"
          aria-label="Ver imagem em tela cheia"
          title="Ver em tela cheia"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Modal Lightbox em Tela Cheia */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in-0 duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Botão Fechar no Canto Superior */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full cursor-pointer z-10"
            aria-label="Fechar tela cheia"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Imagem Ampliada com Controles de Navegação */}
          <div
            className="relative w-full max-w-4xl flex-1 flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-[85vh] max-w-full object-contain drop-shadow-2xl select-none animate-in zoom-in-95 duration-150"
            />

            {/* Setas de Navegação no Lightbox */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>

                {/* Indicador de Posição no Lightbox */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-mono">
                  {selectedImageIndex + 1} de {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
