import { useState } from 'react'
import { Lock, CreditCard } from 'lucide-react'
import { CustomSelect, type SelectOption } from '../ui/select'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { maskCardNumber, maskCardExpiry, maskCardCVV, formatCurrency } from '../../lib/masks'

interface CreditCardPaymentSectionProps {
  totalCredit: number
}

export function CreditCardPaymentSection({ totalCredit }: CreditCardPaymentSectionProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [installments, setInstallments] = useState('1')

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(maskCardNumber(e.target.value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(maskCardExpiry(e.target.value))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvv(maskCardCVV(e.target.value))
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
  )
}
