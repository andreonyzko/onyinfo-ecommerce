import { Link } from 'react-router'
import {
  Calendar,
  CreditCard,
  Zap,
  Printer,
  ChevronRight,
  CheckCircle2,
  Package,
} from 'lucide-react'
import type { OrderSummary } from '../../types'
import { Button, buttonVariants } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { formatCurrency } from '../../lib/masks'
import { cn } from '../../lib/utils'

interface OrderCardProps {
  order: OrderSummary
}

export function OrderCard({ order }: OrderCardProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const totalItemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0)

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.print()
  }

  return (
    <Card className="border-border/80 shadow-xs hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-card overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Lado Esquerdo: Identificação, Data, Status e Tipo de Pagamento */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/pedido/${order.orderId}`}
              className="font-mono font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Package className="w-4 h-4 text-primary shrink-0" />
              <span>{order.orderId}</span>
            </Link>

            <Badge variant="success" className="text-[10px] font-bold py-0.5 gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Aprovado</span>
            </Badge>

            {order.paymentMethod === 'pix' ? (
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 gap-1 border-emerald-500/30"
              >
                <Zap className="w-3 h-3" />
                <span>PIX</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-primary gap-1 border-primary/30"
              >
                <CreditCard className="w-3 h-3" />
                <span>Cartão</span>
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </span>
            <span>&bull;</span>
            <span>
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'}
            </span>
          </div>
        </div>

        {/* Lado Direito: Total Pago + Botões de Ação */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-border/60 shrink-0">
          <div className="text-left md:text-right">
            <div className="text-[11px] text-muted-foreground font-medium">Valor Total:</div>
            <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(order.total)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 px-2.5 gap-1.5 text-xs font-semibold cursor-pointer"
              title="Imprimir comprovante"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </Button>

            <Link
              to={`/pedido/${order.orderId}`}
              className={cn(
                buttonVariants({ size: 'sm' }),
                'h-8 px-3 gap-1 font-semibold text-xs shadow-xs'
              )}
            >
              <span>Ver Detalhes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
