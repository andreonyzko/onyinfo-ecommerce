import { useState } from 'react'
import { Navigate } from 'react-router'
import {
  ShieldCheck,
  Zap,
  CreditCard,
  Truck,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'
import type { OrderSummary } from '../types'
import { useCartStore, useCustomerStore, useOrdersStore } from '../stores'
import { CustomerStep } from '../components/checkout/CustomerStep'
import { ShippingStep } from '../components/checkout/ShippingStep'
import { PaymentStep } from '../components/checkout/PaymentStep'
import { OrderConfirmation } from '../components/checkout/OrderConfirmation'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { formatCurrency } from '../lib/masks'

export type CheckoutStep = 'identification' | 'shipping' | 'payment'

export function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const selectedShipping = useCartStore((state) => state.selectedShipping)
  const selectedPaymentMethod = useCartStore((state) => state.selectedPaymentMethod)
  const clearCart = useCartStore((state) => state.clearCart)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const getDiscount = useCartStore((state) => state.getDiscount)
  const getTotal = useCartStore((state) => state.getTotal)

  const customer = useCustomerStore((state) => state.customer)

  const lastOrder = useOrdersStore((state) => state.lastOrder)
  const addOrder = useOrdersStore((state) => state.addOrder)
  const clearLastOrder = useOrdersStore((state) => state.clearLastOrder)

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('identification')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = getSubtotal()
  const discountPix = getDiscount()
  const shippingPrice = selectedShipping?.price || 0
  const total = getTotal()
  const installmentPrice = (subtotal + shippingPrice) / 12

  // Se houver pedido recém-finalizado
  if (lastOrder && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <OrderConfirmation
          order={lastOrder}
          onNewOrder={() => {
            clearLastOrder()
          }}
        />
      </div>
    )
  }

  // Bloqueio de acesso direto: só permite o fluxo se houver itens no carrinho
  if (items.length === 0) {
    return <Navigate to="/carrinho" replace />
  }

  const handleCompleteOrder = () => {
    setIsSubmitting(true)

    const randomSuffix = Math.floor(100000 + Math.random() * 900000)
    const orderNumber = `ONY-2026-${randomSuffix}`

    const newOrder: OrderSummary = {
      orderId: orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        name: customer?.name || 'Cliente OnyInfo',
        email: customer?.email || '',
        cpf: customer?.cpf || '',
        phone: customer?.phone || '',
      },
      address: {
        cep: customer?.address?.cep || '',
        street: customer?.address?.street || '',
        number: customer?.address?.number || '',
        complement: customer?.address?.complement || '',
        neighborhood: customer?.address?.neighborhood || '',
        city: customer?.address?.city || '',
        state: customer?.address?.state || '',
      },
      items: [...items],
      shippingOption: selectedShipping || {
        id: 'pac',
        name: 'PAC / Econômico',
        deadlineDays: 6,
        price: 19.9,
      },
      paymentMethod: selectedPaymentMethod,
      subtotal,
      shippingPrice,
      discount: discountPix,
      total,
    }

    setTimeout(() => {
      addOrder(newOrder)
      clearCart()
      setIsSubmitting(false)
    }, 400)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Cabeçalho do Checkout */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Finalização de Compra
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentStep === 'identification' && 'Passo 1: Informe seus dados pessoais para identificação do pedido.'}
              {currentStep === 'shipping' && 'Passo 2: Informe o endereço de entrega e selecione a modalidade de frete.'}
              {currentStep === 'payment' && 'Passo 3: Selecione a forma de pagamento para concluir sua compra.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Principal: Colunas com Altura Pareada no Desktop (items-stretch) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Coluna Esquerda: Formulário da Etapa Atual */}
        <div className="lg:col-span-8 flex flex-col">
          {currentStep === 'identification' && (
            <CustomerStep onSuccess={() => setCurrentStep('shipping')} />
          )}

          {currentStep === 'shipping' && (
            <ShippingStep onSuccess={() => setCurrentStep('payment')} />
          )}

          {currentStep === 'payment' && (
            <PaymentStep onSuccess={handleCompleteOrder} />
          )}
        </div>

        {/* Coluna Direita: Resumo do Pedido & Stepper Vertical */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="border-border/80 shadow-md bg-card flex-1 flex flex-col justify-between">
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
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{product.name}</div>
                        <div className="text-[11px] text-muted-foreground">Qtd: {quantity}</div>
                      </div>
                    </div>
                    <span className="font-semibold text-foreground shrink-0">
                      {formatCurrency(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Linhas de Valores Financeiros */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} itens):</span>
                  <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Frete:</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {shippingPrice === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">GRÁTIS</span>
                    ) : (
                      formatCurrency(shippingPrice)
                    )}
                  </span>
                </div>

                {selectedPaymentMethod === 'pix' && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Desconto PIX (5%):</span>
                    </span>
                    <span>- {formatCurrency(discountPix)}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Total Geral */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-foreground">Total:</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground text-right flex items-center justify-end gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>ou 12x de {formatCurrency(installmentPrice)} sem juros</span>
                </div>
              </div>

              {/* Botão de Navegação / Submissão Integrado */}
              <div className="pt-2">
                {currentStep === 'identification' && (
                  <Button
                    type="submit"
                    form="customer-form"
                    className="w-full font-bold gap-2 text-sm shadow-md cursor-pointer"
                  >
                    <span>Ir para Entrega</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}

                {currentStep === 'shipping' && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => setCurrentStep('identification')}
                      className="gap-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </Button>
                    <Button
                      type="submit"
                      form="shipping-form"
                      className="flex-1 font-bold gap-2 text-sm shadow-md cursor-pointer"
                    >
                      <span>Ir para Pagamento</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {currentStep === 'payment' && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => setCurrentStep('shipping')}
                      disabled={isSubmitting}
                      className="gap-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </Button>
                    <Button
                      type="submit"
                      form="payment-form"
                      disabled={isSubmitting}
                      className="flex-1 font-bold gap-2 text-sm shadow-md cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isSubmitting ? (
                        <span>Processando...</span>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Finalizar Compra</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Selo de Segurança */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>Checkout 100% protegido via SSL &bull; OnyInfo</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
