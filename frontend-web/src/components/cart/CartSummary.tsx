import { Link } from 'react-router'
import { ArrowRight, ArrowLeft, ShieldCheck, Zap, CreditCard } from 'lucide-react'
import { buttonVariants } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { formatCurrency } from '../../lib/masks'
import { cn } from '../../lib/utils'

interface CartSummaryProps {
  totalItemsCount: number
  subtotal: number
  discountPix: number
  totalPix: number
  installmentPrice: number
}

export function CartSummary({
  totalItemsCount,
  subtotal,
  discountPix,
  totalPix,
  installmentPrice,
}: CartSummaryProps) {
  return (
    <Card className="border-border/80 shadow-md bg-card">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-base font-bold text-foreground">
          Resumo do Pedido
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Linhas de Valores */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal ({totalItemsCount} itens):</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Desconto PIX (5%):</span>
            </span>
            <span>
              - {formatCurrency(discountPix)}
            </span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Frete estimado:</span>
            <span className="italic text-muted-foreground">Calculado no Checkout</span>
          </div>
        </div>

        <Separator />

        {/* Total Final */}
        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-sm text-foreground">Total no PIX:</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalPix)}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground text-right flex items-center justify-end gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>ou 12x de {formatCurrency(installmentPrice)} sem juros</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2 pt-2">
          <Link
            to="/checkout"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full font-bold gap-2 text-sm shadow-md cursor-pointer justify-center'
            )}
          >
            <span>Comprar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'default' }),
              'w-full font-semibold gap-2 text-xs cursor-pointer justify-center'
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continuar Comprando</span>
          </Link>
        </div>

        {/* Selo de Segurança */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Compra 100% segura &bull; Garantia Oficial OnyInfo</span>
        </div>
      </CardContent>
    </Card>
  )
}
