import { useState } from 'react'
import { Maximize2, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product, Category } from '../../types'
import { ProductLightbox } from './ProductLightbox'
import { Badge } from '../ui/badge'
import { formatAssetUrl } from '../../lib/utils'

interface ProductGalleryProps {
  product: Product
  category?: Category
}

export function ProductGallery({ product, category }: ProductGalleryProps) {
  const images =
    product.images.length > 0
      ? product.images
      : ['https://placehold.co/400x400/1e293b/f8fafc?text=Sem+Imagem']
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [prevProductId, setPrevProductId] = useState(product.id)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Reseta o índice de imagem quando o produto muda
  if (prevProductId !== product.id) {
    setPrevProductId(product.id)
    setSelectedImageIndex(0)
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const activeImage = formatAssetUrl(images[selectedImageIndex] || images[0])

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
      <div className="relative flex items-center justify-center min-h-72 md:min-h-96 p-4 select-none group bg-card/40 rounded-2xl border border-border/70">
        <img
          src={activeImage}
          alt={`${product.name} - Imagem ${selectedImageIndex + 1}`}
          loading="eager"
          decoding="async"
          onClick={() => setIsLightboxOpen(true)}
          className="max-h-72 md:max-h-88 w-auto max-w-full object-contain cursor-zoom-in drop-shadow-lg transition-all duration-300 ease-out hover:scale-105"
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

      {/* Modal Lightbox Desacoplado */}
      <ProductLightbox
        isOpen={isLightboxOpen}
        images={images}
        currentIndex={selectedImageIndex}
        productName={product.name}
        onClose={() => setIsLightboxOpen(false)}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        onSelectIndex={setSelectedImageIndex}
      />
    </div>
  )
}
