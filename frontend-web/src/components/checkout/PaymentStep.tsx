import { useState } from 'react'
import {
  Zap,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Lock,
} from 'lucide-react'
import { useCartStore } from '../../stores'
import { CustomSelect, type SelectOption } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  maskCardNumber,
  maskCardExpiry,
  maskCardCVV,
  formatCurrency,
} from '../../lib/masks'
import { cn } from '../../lib/utils'

interface PaymentStepProps {
  onSuccess: () => void
}

export function PaymentStep({ onSuccess }: PaymentStepProps) {
  const selectedPaymentMethod = useCartStore((state) => state.selectedPaymentMethod)
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const selectedShipping = useCartStore((state) => state.selectedShipping)

  const [copiedKey, setCopiedKey] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [installments, setInstallments] = useState('1')

  const subtotal = getSubtotal()
  const shippingPrice = selectedShipping?.price || 0
  const totalCredit = subtotal + shippingPrice

  const pixKeyMock = '00020126580014br.gov.bcb.pix0136onyinfo-pagamentos-pix-oficial5204000053039865802BR5915OnyInfo Hardware6009Sao Paulo62070503***6304E8A2'

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKeyMock)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2500)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(maskCardNumber(e.target.value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(maskCardExpiry(e.target.value))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvv(maskCardCVV(e.target.value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess()
  }

  const installmentOptions: SelectOption<string>[] = Array.from({ length: 12 }, (_, i) => {
    const count = i + 1
    const valuePerInst = totalCredit / count
    const formattedValue = formatCurrency(valuePerInst)
    return {
      value: String(count),
      label: `${count}x de ${formattedValue} sem juros`,
    }
  })

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
            <div className="p-4 sm:p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4 animate-in fade-in-0 duration-200 w-full min-w-0">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full min-w-0">
                {/* QR Code Simulado */}
                <div className="w-28 h-28 rounded-xl bg-background border border-border p-2 flex flex-col items-center justify-center text-foreground shrink-0 shadow-xs">
                  <QrCode className="w-20 h-20 text-foreground" />
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    PIX 5% OFF
                  </span>
                </div>

                {/* Instruções e Chave */}
                <div className="flex-1 min-w-0 w-full space-y-2 text-center sm:text-left">
                  <h4 className="font-bold text-xs text-foreground flex items-center justify-center sm:justify-start gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Pague com PIX e garanta 5% de desconto</span>
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Utilize o aplicativo do seu banco para ler o QR Code ou copie a chave Copia e Cola abaixo.
                  </p>

                  {/* Chave Copia e Cola */}
                  <div className="flex items-center gap-2 pt-1 w-full min-w-0">
                    <div className="flex-1 min-w-0 overflow-hidden bg-background border border-input rounded-md px-2.5 py-1.5 text-xs font-mono text-muted-foreground truncate">
                      {pixKeyMock}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleCopyPix}
                      className="gap-1 text-xs shrink-0 cursor-pointer h-8"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 p-4 sm:p-5 rounded-xl border border-border bg-card/60 animate-in fade-in-0 duration-200 w-full relative">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground pb-1 border-b border-border">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>Dados do Cartão de Crédito</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 w-full">
                {/* Número do Cartão */}
                <div className="sm:col-span-4 space-y-1.5">
                  <Label htmlFor="cardNumber" className="text-xs font-semibold">
                    Número do Cartão *
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    required
                  />
                </div>

                {/* CVV */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="cardCvv" className="text-xs font-semibold">
                    CVV *
                  </Label>
                  <Input
                    id="cardCvv"
                    placeholder="123"
                    maxLength={4}
                    value={cardCvv}
                    onChange={handleCvvChange}
                    required
                  />
                </div>

                {/* Nome do Titular */}
                <div className="sm:col-span-4 space-y-1.5">
                  <Label htmlFor="cardHolder" className="text-xs font-semibold">
                    Nome Impresso no Cartão *
                  </Label>
                  <Input
                    id="cardHolder"
                    placeholder="Ex: ANDRE SILVA"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                {/* Validade */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="cardExpiry" className="text-xs font-semibold">
                    Validade *
                  </Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    required
                  />
                </div>

                {/* Parcelas com CustomSelect */}
                <div className="sm:col-span-6 space-y-1.5 pt-1 w-full relative">
                  <Label htmlFor="installments" className="text-xs font-semibold">
                    Opções de Parcelamento *
                  </Label>
                  <CustomSelect
                    value={installments}
                    options={installmentOptions}
                    onChange={(val) => setInstallments(val)}
                    className="w-full"
                    icon={<CreditCard className="w-3.5 h-3.5 text-muted-foreground" />}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 text-xs text-muted-foreground">
            * Ambiente de pagamento seguro protegido por criptografia de ponta a ponta.
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
