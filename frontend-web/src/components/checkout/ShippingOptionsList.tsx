import { Truck } from 'lucide-react'
import { type ShippingOption, DEFAULT_SHIPPING_OPTIONS } from '../../types'
import { Label } from '../ui/label'
import { cn } from '../../lib/utils'

interface ShippingOptionsListProps {
  options?: ShippingOption[]
  selectedOption: ShippingOption | null
  onSelectOption: (option: ShippingOption) => void
}

export function ShippingOptionsList({
  options = DEFAULT_SHIPPING_OPTIONS,
  selectedOption,
  onSelectOption,
}: ShippingOptionsListProps) {
  return (
    <div className="space-y-2.5 pt-2">
      <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground uppercase tracking-wider">
        <Truck className="w-3.5 h-3.5 text-primary" />
        <span>Opções de Envio Disponíveis</span>
      </Label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id
          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option)}
              className={cn(
                'p-3 rounded-xl border transition-all cursor-pointer space-y-1 flex flex-col justify-between',
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs'
                  : 'border-border bg-card/60 hover:border-primary/40 hover:bg-muted/20'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-xs text-foreground truncate">
                  {option.name}
                </div>
                <div
                  className={cn(
                    'w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                  )}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-[11px] text-muted-foreground">
                  {option.deadlineDays === 0
                    ? 'Retirada imediata'
                    : `Até ${option.deadlineDays} dias úteis`}
                </span>
                <span className="font-bold text-xs text-foreground">
                  {option.price === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">GRÁTIS</span>
                  ) : (
                    option.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
