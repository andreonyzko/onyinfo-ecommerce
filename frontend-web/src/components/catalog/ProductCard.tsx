import { useState } from 'react'
import { Link } from 'react-router'
import { ShoppingCart, Check, Zap, Eye } from 'lucide-react'
import type { Product } from '../../types'
import { useCartStore } from '../../stores'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button, buttonVariants } from '../ui/button'
import { cn } from '../../lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isAdded, setIsAdded] = useState(false)

  const pixPrice = product.price * 0.95

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <Card className="group flex flex-col h-full overflow-hidden border-border/70 hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-card">
      <Link
        to={`/produto/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted/30 p-4"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
            {product.brand}
          </Badge>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <Badge variant="success" className="text-[10px] font-bold">
            <Zap className="w-2.5 h-2.5 mr-0.5" /> 5% OFF PIX
          </Badge>
        </div>
      </Link>

      <CardContent className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          <Link
            to={`/produto/${product.slug}`}
            className="font-medium text-sm line-clamp-2 text-foreground hover:text-primary transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-border/40">
          <div className="text-[11px] text-muted-foreground">
            A prazo: <span className="line-through">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              R$
            </span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">à vista no PIX</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant={isAdded ? "secondary" : "default"}
          size="sm"
          onClick={handleAddToCart}
          className="flex-1 gap-1.5 font-semibold text-xs cursor-pointer transition-all duration-200"
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Adicionado!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </>
          )}
        </Button>

        <Link
          to={`/produto/${product.slug}`}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'px-2.5 cursor-pointer text-muted-foreground hover:text-foreground'
          )}
          aria-label={`Ver especificações de ${product.name}`}
          title="Ver especificações"
        >
          <Eye className="w-3.5 h-3.5" />
        </Link>
      </CardFooter>
    </Card>
  )
}
