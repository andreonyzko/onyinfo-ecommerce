import { Link } from 'react-router'
import {
  CheckCircle,
  Printer,
  MapPin,
  User,
  CreditCard,
  Zap,
  Truck,
  ArrowRight,
} from 'lucide-react'
import type { OrderSummary } from '../../types'
import { Button, buttonVariants } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { cn } from '../../lib/utils'

interface OrderConfirmationProps {
  order: OrderSummary
  onNewOrder?: () => void
}

export function OrderConfirmation({ order, onNewOrder }: OrderConfirmationProps) {
  const handlePrint = () => {
    window.print()
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 animate-in fade-in-0 duration-300">
      {/* Banner de Sucesso */}
      <div className="text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 p-6 md:p-8 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <Badge variant="success" className="text-xs font-bold mb-1">
            PEDIDO CONFIRMADO
          </Badge>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Obrigado pela sua compra!
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Seu pedido foi registrado com sucesso e está sendo preparado para envio.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-xs font-mono text-foreground font-semibold">
          <span>Pedido Nº:</span>
          <span className="text-primary">{order.orderId}</span>
          <span className="text-muted-foreground font-normal">&bull; {formattedDate}</span>
        </div>
      </div>

      {/* Grid de Detalhes: Cliente + Endereço + Pagamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dados do Cliente */}
        <Card className="border-border/80 bg-card">
          <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-foreground uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Cliente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs space-y-1 text-muted-foreground">
            <div className="font-semibold text-foreground">{order.customer.name}</div>
            <div>{order.customer.email}</div>
            <div>CPF: {order.customer.cpf}</div>
            <div>Tel: {order.customer.phone}</div>
          </CardContent>
        </Card>

        {/* Endereço de Entrega */}
        <Card className="border-border/80 bg-card">
          <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-foreground uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Entrega</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs space-y-1 text-muted-foreground">
            <div className="font-semibold text-foreground">
              {order.address.street}, {order.address.number}
            </div>
            {order.address.complement && <div>{order.address.complement}</div>}
            <div>
              {order.address.neighborhood} &bull; {order.address.city}/{order.address.state}
            </div>
            <div>CEP: {order.address.cep}</div>
            <div className="pt-1 flex items-center gap-1 text-[11px] text-primary font-medium">
              <Truck className="w-3 h-3" />
              <span>{order.shippingOption.name}</span>
            </div>
          </CardContent>
        </Card>

        {/* Forma de Pagamento */}
        <Card className="border-border/80 bg-card">
          <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-foreground uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              <span>Pagamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs space-y-2 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              {order.paymentMethod === 'pix' ? (
                <>
                  <Badge variant="success" className="text-[10px] font-bold">
                    <Zap className="w-2.5 h-2.5 mr-0.5" /> PIX (5% OFF)
                  </Badge>
                  <span className="font-semibold text-foreground">Aprovado</span>
                </>
              ) : (
                <>
                  <Badge variant="secondary" className="text-[10px]">
                    Cartão de Crédito
                  </Badge>
                  <span className="font-semibold text-foreground">Autorizado</span>
                </>
              )}
            </div>
            <div className="text-[11px]">
              Total Pago:{' '}
              <span className="font-bold text-foreground">
                {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Itens do Pedido */}
      <Card className="border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-4 md:px-6 bg-muted/20 border-b border-border">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Itens Adquiridos ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border/60">
          {order.items.map(({ product, quantity }) => {
            const itemTotal = product.price * quantity
            return (
              <div
                key={product.id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-card border border-border/70 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-semibold text-xs text-foreground line-clamp-1">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Qtd: <span className="font-bold text-foreground">{quantity}</span> &bull;{' '}
                      {product.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </div>
                  </div>
                </div>

                <div className="font-bold text-xs text-foreground">
                  {itemTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Resumo de Valores */}
      <Card className="border-border/80 bg-card p-5 space-y-3">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal dos Produtos:</span>
            <span className="font-medium text-foreground">
              {order.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Desconto PIX (5%):</span>
              <span>
                - {order.discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground">
            <span>Frete ({order.shippingOption.name}):</span>
            <span className="font-medium text-foreground">
              {order.shippingPrice === 0
                ? 'Grátis'
                : order.shippingPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-baseline pt-1">
          <span className="font-bold text-sm text-foreground">Total Final:</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="w-full sm:w-auto gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Imprimir Comprovante</span>
        </Button>

        <Link
          to="/"
          onClick={onNewOrder}
          className={cn(
            buttonVariants({ size: 'default' }),
            'w-full sm:w-auto gap-1.5 font-semibold text-xs shadow-md'
          )}
        >
          <span>Voltar para o Catálogo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
