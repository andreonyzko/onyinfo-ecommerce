import { useState } from 'react'
import { Link, Navigate } from 'react-router'
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
import { useCartStore, useCustomerStore } from '../stores'
import { CustomerStep } from '../components/checkout/CustomerStep'
import { ShippingStep } from '../components/checkout/ShippingStep'
import { PaymentStep } from '../components/checkout/PaymentStep'
import { OrderConfirmation } from '../components/checkout/OrderConfirmation'
import { Button, buttonVariants } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { cn } from '../lib/utils'

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
  const lastOrder = useCustomerStore((state) => state.lastOrder)
  const setLastOrder = useCustomerStore((state) => state.setLastOrder)
  const clearProfile = useCustomerStore((state) => state.clearProfile)

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
            clearProfile()
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
      setLastOrder(newOrder)
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

        {/* Coluna Direita: Resumo do Pedido com Mesma Altura */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="border-border/80 shadow-md bg-card h-full flex flex-col">
            <CardHeader className="py-3.5 px-4 sm:px-5 bg-muted/20 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground">
                Resumo da Compra
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-bold">
                {items.reduce((acc, i) => acc + i.quantity, 0)} itens
              </Badge>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
              {/* Miniatura dos Produtos */}
              <div className="max-h-[140px] overflow-y-auto divide-y divide-border/50 pr-1 space-y-2">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-card border border-border/70 p-0.5 shrink-0 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{product.name}</div>
                        <div className="text-[11px] text-muted-foreground">Qtd: {quantity}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-foreground shrink-0">
                      {(product.price * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bloco de Totais */}
              <div className="space-y-3 pt-2">
                <Separator />

                {/* Valores Financeiros */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-foreground">
                      {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  {selectedPaymentMethod === 'pix' && discountPix > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Desconto PIX (5%):</span>
                      </span>
                      <span>
                        - {discountPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Frete ({selectedShipping?.name || 'A calcular'}):</span>
                    </span>
                    <span className="font-semibold text-foreground">
                      {selectedShipping
                        ? shippingPrice === 0
                          ? 'Grátis'
                          : shippingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : 'A calcular'}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Total Final */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm text-foreground">
                      {selectedPaymentMethod === 'pix' ? 'Total no PIX:' : 'Total:'}
                    </span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground text-right flex items-center justify-end gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>ou em até 12x de {installmentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>
              </div>

              {/* Selo de Segurança */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground border-t border-border/40">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Compra 100% segura &bull; Desafio AWS FDE</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seção Inferior de Navegação (Abaixo de Ambas as Colunas) */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        {/* Botão Voltar */}
        {currentStep === 'identification' && (
          <Link
            to="/carrinho"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'default' }),
              'w-full sm:w-auto gap-1.5 text-xs font-semibold'
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para o Carrinho</span>
          </Link>
        )}

        {currentStep === 'shipping' && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('identification')}
            className="w-full sm:w-auto gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Identificação</span>
          </Button>
        )}

        {currentStep === 'payment' && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('shipping')}
            className="w-full sm:w-auto gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Entrega</span>
          </Button>
        )}

        {/* Botão Continuar / Finalizar */}
        {currentStep === 'identification' && (
          <Button
            type="submit"
            form="customer-form"
            size="lg"
            className="w-full sm:w-auto font-bold gap-2 text-xs shadow-md cursor-pointer"
          >
            <span>Continuar para a Entrega</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}

        {currentStep === 'shipping' && (
          <Button
            type="submit"
            form="shipping-form"
            size="lg"
            className="w-full sm:w-auto font-bold gap-2 text-xs shadow-md cursor-pointer"
          >
            <span>Continuar para o Pagamento</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}

        {currentStep === 'payment' && (
          <Button
            type="submit"
            form="payment-form"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto font-bold gap-2 text-xs shadow-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            {isSubmitting ? (
              <span>Processando Pedido...</span>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Finalizar Pedido</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
