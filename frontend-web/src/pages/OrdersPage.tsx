import { Link } from 'react-router'
import { Package, ShoppingBag, ArrowRight } from 'lucide-react'
import { useOrdersStore } from '../stores'
import { OrderCard } from '../components/orders/OrderCard'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { EmptyState } from '../components/common/EmptyState'
import { buttonVariants } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { cn } from '../lib/utils'

export function OrdersPage() {
  const orders = useOrdersStore((state) => state.orders)

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Breadcrumb de Navegação */}
      <Breadcrumb items={[{ label: 'Meus Pedidos' }]} />

      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Meus Pedidos
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consulte e acompanhe o histórico de todas as suas compras na OnyInfo.
            </p>
          </div>
        </div>

        {orders.length > 0 && (
          <Badge variant="secondary" className="text-xs font-semibold self-start sm:self-auto">
            {orders.length} {orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
          </Badge>
        )}
      </div>

      {/* Lista Compacta de Pedidos ou Estado Vazio */}
      {orders.length === 0 ? (
        <div className="max-w-lg mx-auto py-12">
          <EmptyState
            icon={
              <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
            }
            title="Você ainda não possui pedidos"
            description="Explore nosso catálogo com componentes de hardware de alta performance e faça sua primeira compra."
            action={
              <Link
                to="/"
                className={cn(
                  buttonVariants({ size: 'default' }),
                  'gap-2 font-semibold shadow-md'
                )}
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-3.5 max-w-4xl mx-auto">
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
