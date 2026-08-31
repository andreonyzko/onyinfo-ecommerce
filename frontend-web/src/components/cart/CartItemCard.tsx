import { Link } from 'react-router'
import { Plus, Minus, Trash2 } from 'lucide-react'
import type { CartItem } from '../../types'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface CartItemCardProps {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const { product, quantity } = item
  const itemTotal = product.price * quantity
  const itemPixTotal = itemTotal * 0.95

  return (
    <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors hover:bg-muted/10">
      {/* Lado Esquerdo: Foto + Dados do Produto */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Foto do Produto */}
        <Link
          to={`/produto/${product.slug}`}
          className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-card border border-border/70 p-1 flex items-center justify-center group"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Dados do Produto (Marca, SKU, Nome, Preço Unitário) */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[9px] uppercase font-bold py-0 h-3.5">
              {product.brand}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-mono">
              ONY-{product.id.padStart(4, '0')}
            </span>
          </div>

          <Link
            to={`/produto/${product.slug}`}
            className="font-semibold text-xs sm:text-sm text-foreground hover:text-primary transition-colors line-clamp-1 leading-snug"
          >
            {product.name}
          </Link>

          <div className="text-[11px] text-muted-foreground">
            Unitário:{' '}
            <span className="font-medium text-foreground">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
      </div>

      {/* Lado Direito: Quantidade + Subtotal + Excluir (Linha única no Desktop, Linha inferior no Mobile) */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
        {/* Seletor de Quantidade */}
        <div className="flex items-center border border-input rounded-md bg-card shadow-xs">
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer transition-colors"
            aria-label="Diminuir quantidade"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center font-bold text-xs text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={quantity >= 10}
            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer transition-colors"
            aria-label="Aumentar quantidade"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Subtotal do Item */}
        <div className="text-right min-w-20">
          <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {itemPixTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[10px] text-muted-foreground line-through">
            {itemTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>

        {/* Botão Excluir */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(product.id)}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
          title="Remover produto do carrinho"
          aria-label="Remover produto"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
