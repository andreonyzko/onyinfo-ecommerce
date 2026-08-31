import { useParams, Link } from 'react-router'
import {
  Package,
  Calendar,
  CreditCard,
  Zap,
  ArrowLeft,
  Printer,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react'
import { useOrdersStore } from '../stores'
import { OrderItemsList } from '../components/orders/OrderItemsList'
import { OrderDeliveryCard } from '../components/orders/OrderDeliveryCard'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { EmptyState } from '../components/common/EmptyState'
import { Button, buttonVariants } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { formatCurrency } from '../lib/masks'
import { cn } from '../lib/utils'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const getOrderById = useOrdersStore((state) => state.getOrderById)
  const order = id ? getOrderById(id) : undefined

  const handlePrint = () => {
    window.print()
  }

  // Pedido Não Encontrado
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <EmptyState
          icon={
            <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
          }
          title="Pedido não encontrado"
          description={`Não localizamos nenhum pedido com o identificador "${id || ''}".`}
          action={
            <Link
              to="/meus-pedidos"
              className={cn(
                buttonVariants({ size: 'default' }),
                'gap-2 font-semibold shadow-md'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Meus Pedidos</span>
            </Link>
          }
        />
      </div>
    )
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      {/* Breadcrumb de Navegação */}
      <Breadcrumb
        items={[
          { label: 'Meus Pedidos', href: '/meus-pedidos' },
          { label: order.orderId },
        ]}
      />

      {/* Cabeçalho do Pedido */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-mono">
              {order.orderId}
            </h1>
            <Badge variant="success" className="text-xs font-bold py-0.5 gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aprovado</span>
            </Badge>
            {order.paymentMethod === 'pix' ? (
              <Badge
                variant="outline"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-1 border-emerald-500/30"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>PIX (5% OFF)</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs font-bold text-primary gap-1 border-primary/30"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cartão de Crédito</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Realizado em {formattedDate}</span>
          </div>
        </div>

        {/* Botões de Ação do Cabeçalho */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </Button>

          <Link
            to="/meus-pedidos"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'gap-1.5 text-xs font-semibold'
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </Link>
        </div>
      </div>

      {/* Card Principal de Detalhes */}
      <Card className="border-border/80 shadow-xs overflow-hidden bg-card">
        <CardHeader className="py-3.5 px-4 sm:px-6 bg-muted/20 border-b border-border">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>Itens Comprados ({order.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Lista de Produtos Desacoplada */}
          <OrderItemsList items={order.items} />

          {/* Grid de Entrega e Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Informações de Entrega Desacopladas */}
            <OrderDeliveryCard
              customer={order.customer}
              address={order.address}
              shippingOption={order.shippingOption}
            />

            {/* Resumo Financeiro */}
            <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-2 text-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="font-bold text-foreground">Resumo Financeiro</div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({order.items.reduce((acc, i) => acc + i.quantity, 0)} itens):</span>
                  <span className="font-semibold text-foreground">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete:</span>
                  <span className="font-semibold text-foreground">
                    {order.shippingPrice === 0 ? 'GRÁTIS' : formatCurrency(order.shippingPrice)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Desconto PIX (5%):</span>
                    <span>- {formatCurrency(order.discount)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-foreground text-sm">Total Pago:</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
