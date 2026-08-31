import { Zap, CreditCard } from 'lucide-react'
import { useCartStore } from '../../stores'
import { PixPaymentSection } from './PixPaymentSection'
import { CreditCardPaymentSection } from './CreditCardPaymentSection'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

interface PaymentStepProps {
  onSuccess: () => void
}

export function PaymentStep({ onSuccess }: PaymentStepProps) {
  const selectedPaymentMethod = useCartStore((state) => state.selectedPaymentMethod)
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const selectedShipping = useCartStore((state) => state.selectedShipping)

  const subtotal = getSubtotal()
  const shippingPrice = selectedShipping?.price || 0
  const totalCredit = subtotal + shippingPrice

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess()
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="h-full w-full">
      <Card className="border-border/80 shadow-xs h-full flex flex-col w-full relative">
        <CardHeader className="py-3.5 px-4 sm:px-6 bg-muted/20 border-b border-border">
          <CardTitle className="text-sm font-bold text-foreground">
            Forma de Pagamento
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-6 w-full">
          {/* Seletor de Método de Pagamento (PIX vs Cartão) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Opção PIX */}
            <div
              onClick={() => setPaymentMethod('pix')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between relative overflow-hidden',
                selectedPaymentMethod === 'pix'
                  ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500 shadow-xs'
                  : 'border-border bg-card/60 hover:border-emerald-500/40 hover:bg-muted/20'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-xs text-foreground">PIX Instantâneo</span>
                </div>
                <Badge variant="success" className="text-[10px] font-bold">
                  5% OFF
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Aprovação imediata &bull; Desconto de 5% no valor dos produtos
              </p>
            </div>

            {/* Opção Cartão de Crédito */}
            <div
              onClick={() => setPaymentMethod('credit_card')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between relative overflow-hidden',
                selectedPaymentMethod === 'credit_card'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs'
                  : 'border-border bg-card/60 hover:border-primary/40 hover:bg-muted/20'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="font-bold text-xs text-foreground">Cartão de Crédito</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Até 12x
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Parcele em até 12x sem juros &bull; Principais bandeiras
              </p>
            </div>
          </div>

          {/* Detalhes do Pagamento Selecionado */}
          {selectedPaymentMethod === 'pix' ? (
            <PixPaymentSection />
          ) : (
            <CreditCardPaymentSection totalCredit={totalCredit} />
          )}

          <div className="pt-2 text-xs text-muted-foreground">
            * Ambiente de pagamento seguro protegido por criptografia de ponta a ponta.
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
