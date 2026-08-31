import { MapPin, User, Truck } from 'lucide-react'
import type { OrderSummary } from '../../types'

interface OrderDeliveryCardProps {
  customer: OrderSummary['customer']
  address: OrderSummary['address']
  shippingOption: OrderSummary['shippingOption']
}

export function OrderDeliveryCard({
  customer,
  address,
  shippingOption,
}: OrderDeliveryCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-2 text-xs">
      <div className="font-bold text-foreground flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        <span>Dados de Entrega</span>
      </div>
      <div className="text-muted-foreground space-y-0.5 leading-relaxed">
        <p className="font-medium text-foreground flex items-center gap-1">
          <User className="w-3 h-3 text-muted-foreground" />
          <span>
            {customer.name} (CPF: {customer.cpf})
          </span>
        </p>
        <p>
          {address.street}, {address.number}
          {address.complement ? ` - ${address.complement}` : ''}
        </p>
        <p>
          {address.neighborhood} &bull; {address.city} - {address.state}
        </p>
        <p className="font-mono">CEP: {address.cep}</p>
      </div>

      <div className="pt-2 border-t border-border/60 flex items-center gap-1.5 text-xs font-semibold text-primary">
        <Truck className="w-4 h-4" />
        <span>
          Modalidade: {shippingOption.name} (
          {shippingOption.deadlineDays === 0
            ? 'Retirada imediata'
            : `até ${shippingOption.deadlineDays} dias úteis`}
          )
        </span>
      </div>
    </div>
  )
}
