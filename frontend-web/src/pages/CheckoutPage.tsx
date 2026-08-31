import { useState } from 'react'
import { Navigate } from 'react-router'
import {
  ShieldCheck,
  ShoppingBag,
  CheckCircle,
} from 'lucide-react'
import type { OrderSummary } from '../types'
import { useCartStore, useCustomerStore, useOrdersStore } from '../stores'
import { CustomerStep } from '../components/checkout/CustomerStep'
import { ShippingStep } from '../components/checkout/ShippingStep'
import { PaymentStep } from '../components/checkout/PaymentStep'
import { CheckoutOrderSummary } from '../components/checkout/CheckoutOrderSummary'
import { OrderConfirmation } from '../components/checkout/OrderConfirmation'
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
  const saveProfile = useCustomerStore((state) => state.saveProfile)

  const lastOrder = useOrdersStore((state) => state.lastOrder)
  const addOrder = useOrdersStore((state) => state.addOrder)

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
        <OrderConfirmation order={lastOrder} />
      </div>
    )
  }

  // Bloqueio de acesso direto: redireciona automaticamente para o carrinho se não houver itens
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
        email: customer?.email || 'cliente@onyinfo.com.br',
        cpf: customer?.cpf || '000.000.000-00',
        phone: customer?.phone || '(11) 99999-9999',
      },
      address: {
        cep: customer?.address?.cep || '01001-000',
        street: customer?.address?.street || 'Praça da Sé',
        number: customer?.address?.number || 'S/N',
        complement: customer?.address?.complement || '',
        neighborhood: customer?.address?.neighborhood || 'Sé',
        city: customer?.address?.city || 'São Paulo',
        state: customer?.address?.state || 'SP',
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

    // Persiste o pedido e limpa o carrinho
    addOrder(newOrder)
    clearCart()
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 max-w-6xl">
      {/* Cabeçalho do Checkout com Stepper Indicador */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Finalizar Pedido
              </h1>
              <p className="text-xs text-muted-foreground">
                Ambiente criptografado com garantia e entrega rápida
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 py-1 px-3 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Compra 100% Segura</span>
          </div>
        </div>

        {/* Stepper Visual Multi-Step */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
          {/* Passo 1: Identificação */}
          <div
            className={cn(
              'flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border transition-all text-xs font-semibold',
              currentStep === 'identification'
                ? 'border-primary bg-primary/5 text-primary shadow-xs'
                : 'border-border bg-card text-muted-foreground'
            )}
          >
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                currentStep === 'identification'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              1
            </div>
            <div className="truncate">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Etapa 1</div>
              <div className="truncate">Identificação</div>
            </div>
          </div>

          {/* Passo 2: Entrega */}
          <div
            className={cn(
              'flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border transition-all text-xs font-semibold',
              currentStep === 'shipping'
                ? 'border-primary bg-primary/5 text-primary shadow-xs'
                : 'border-border bg-card text-muted-foreground'
            )}
          >
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                currentStep === 'shipping'
                  ? 'bg-primary text-primary-foreground'
                  : currentStep === 'payment'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {currentStep === 'payment' ? <CheckCircle className="w-3.5 h-3.5" /> : '2'}
            </div>
            <div className="truncate">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Etapa 2</div>
              <div className="truncate">Entrega</div>
            </div>
          </div>

          {/* Passo 3: Pagamento */}
          <div
            className={cn(
              'flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border transition-all text-xs font-semibold',
              currentStep === 'payment'
                ? 'border-primary bg-primary/5 text-primary shadow-xs'
                : 'border-border bg-card text-muted-foreground'
            )}
          >
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                currentStep === 'payment'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              3
            </div>
            <div className="truncate">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Etapa 3</div>
              <div className="truncate">Pagamento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Formulários da Etapa Ativa + Sidebar de Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Formulário do Passo Ativo */}
        <div className="lg:col-span-8 space-y-6">
          {currentStep === 'identification' && (
            <CustomerStep
              onSuccess={(data) => {
                saveProfile(data)
                setCurrentStep('shipping')
              }}
            />
          )}

          {currentStep === 'shipping' && (
            <ShippingStep
              onSuccess={() => setCurrentStep('payment')}
            />
          )}

          {currentStep === 'payment' && (
            <PaymentStep
              onSuccess={handleCompleteOrder}
            />
          )}
        </div>

        {/* Coluna Direita: Resumo do Pedido Desacoplado */}
        <div className="lg:col-span-4 space-y-4 sticky top-28">
          <CheckoutOrderSummary
            items={items}
            subtotal={subtotal}
            shippingPrice={shippingPrice}
            discountPix={discountPix}
            total={total}
            installmentPrice={installmentPrice}
            selectedPaymentMethod={selectedPaymentMethod}
            selectedShipping={selectedShipping}
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            onStepChange={setCurrentStep}
          />
        </div>
      </div>
    </div>
  )
}
