import { Link } from 'react-router'
import type { CartItem } from '../../types'
import { Badge } from '../ui/badge'
import { formatCurrency } from '../../lib/masks'
import { formatAssetUrl } from '../../lib/utils'

interface OrderItemsListProps {
  items: CartItem[]
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="divide-y divide-border/60 rounded-lg border border-border/80 bg-background/60 overflow-hidden">
      {items.map(({ product, quantity }) => (
        <div
          key={product.id}
          className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <Link
              to={`/produto/${product.slug}`}
              className="w-14 h-14 rounded-lg bg-card border border-border/70 p-1 shrink-0 flex items-center justify-center group"
            >
              <img
                src={formatAssetUrl(product.images[0])}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <div className="min-w-0 space-y-0.5">
              <Link
                to={`/produto/${product.slug}`}
                className="font-semibold text-xs sm:text-sm text-foreground hover:text-primary transition-colors line-clamp-1 block"
              >
                {product.name}
              </Link>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                  {product.brand}
                </Badge>
                <span>
                  Qtd: <strong>{quantity}</strong>
                </span>
                <span>&bull;</span>
                <span>Unitário: {formatCurrency(product.price)}</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="font-bold text-xs sm:text-sm text-foreground">
              {formatCurrency(product.price * quantity)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
