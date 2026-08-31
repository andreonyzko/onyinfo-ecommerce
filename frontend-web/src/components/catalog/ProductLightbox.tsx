import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

interface ProductLightboxProps {
  isOpen: boolean
  images: string[]
  currentIndex: number
  productName: string
  onClose: () => void
  onPrev: (e: React.MouseEvent) => void
  onNext: (e: React.MouseEvent) => void
  onSelectIndex: (index: number) => void
}

export function ProductLightbox({
  isOpen,
  images,
  currentIndex,
  productName,
  onClose,
  onPrev,
  onNext,
  onSelectIndex,
}: ProductLightboxProps) {
  // Atalhos de teclado no Lightbox
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') {
        onSelectIndex((currentIndex + 1) % images.length)
      }
      if (e.key === 'ArrowLeft') {
        onSelectIndex((currentIndex - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, images.length, currentIndex, onClose, onSelectIndex])

  if (!isOpen) return null

  const activeImage = images[currentIndex] || images[0]

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      {/* Botão Fechar no Canto Superior */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
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
          alt={productName}
          className="max-h-5/6 max-w-full object-contain drop-shadow-2xl select-none animate-in zoom-in-95 duration-150"
        />

        {/* Setas de Navegação no Lightbox */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Indicador de Posição no Lightbox */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-mono">
              {currentIndex + 1} de {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
