import {
  ShieldCheck,
  Zap,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'
import type { CartItem, ShippingOption, PaymentMethod } from '../../types'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { formatCurrency } from '../../lib/masks'
import { formatAssetUrl } from '../../lib/utils'

interface CheckoutOrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shippingPrice: number
  discountPix: number
  total: number
  installmentPrice: number
  selectedPaymentMethod: PaymentMethod
  selectedShipping: ShippingOption | null
  currentStep: 'identification' | 'shipping' | 'payment'
  isSubmitting: boolean
  onStepChange: (step: 'identification' | 'shipping' | 'payment') => void
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  shippingPrice,
  discountPix,
  total,
  installmentPrice,
  selectedPaymentMethod,
  currentStep,
  isSubmitting,
  onStepChange,
}: CheckoutOrderSummaryProps) {
  return (
    <Card className="border-border/80 shadow-xs overflow-hidden bg-card">
      <CardHeader className="py-3 px-4 md:px-6 bg-muted/20 border-b border-border">
        <CardTitle className="text-sm font-bold text-foreground">
          Resumo da Compra
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Miniatura dos Produtos */}
        <div className="max-h-36 overflow-y-auto divide-y divide-border/50 pr-1 space-y-2">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-card border border-border/70 p-0.5 shrink-0 flex items-center justify-center">
                  <img
                    src={formatAssetUrl(product.images[0])}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{product.name}</div>
                  <div className="text-[11px] text-muted-foreground">Qtd: {quantity}</div>
                </div>
              </div>
              <span className="font-semibold text-foreground shrink-0">
                {(product.price * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Valores Totais */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">
              {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Frete</span>
            <span className="font-semibold text-foreground">
              {shippingPrice === 0
                ? 'Grátis'
                : shippingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          {selectedPaymentMethod === 'pix' && discountPix > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in-0 duration-200">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" /> Desconto PIX (5%)
              </span>
              <span>
                - {discountPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          )}

          <Separator />

          <div className="pt-1">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-sm text-foreground">Total à vista (PIX)</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground text-right mt-0.5">
              ou em até 12x de{' '}
              <span className="font-semibold text-foreground">
                {formatCurrency(installmentPrice)}
              </span>{' '}
              sem juros
            </div>
          </div>
        </div>

        {/* Benefícios de Segurança */}
        <div className="pt-2 border-t border-border/60 space-y-1.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Ambiente 100% protegido com SSL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Rastreamento em tempo real do seu pedido</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Garantia oficial e nota fiscal eletrônica</span>
          </div>
        </div>

        {/* Controles de Navegação entre Etapas */}
        <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
          {currentStep === 'identification' && (
            <Button
              type="submit"
              form="customer-form"
              size="lg"
              className="w-full font-bold gap-2 text-xs sm:text-sm cursor-pointer shadow-md"
            >
              <span>Ir para Entrega</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {currentStep === 'shipping' && (
            <>
              <Button
                type="submit"
                form="shipping-form"
                size="lg"
                className="w-full font-bold gap-2 text-xs sm:text-sm cursor-pointer shadow-md"
              >
                <span>Ir para Pagamento</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onStepChange('identification')}
                className="w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar para Identificação</span>
              </Button>
            </>
          )}

          {currentStep === 'payment' && (
            <>
              <Button
                type="submit"
                form="payment-form"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-bold gap-2 text-xs sm:text-sm cursor-pointer shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <span>Processando compra...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Finalizar compra</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSubmitting}
                onClick={() => onStepChange('shipping')}
                className="w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar para Entrega</span>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
