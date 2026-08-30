import { RangeSlider } from '../ui/range-slider'
import { Label } from '../ui/label'
import { formatCurrency } from '../../lib/masks'
import { cn } from '../../lib/utils'

interface PriceRangeFilterProps {
  minPrice: number
  maxPrice: number
  minLimit: number
  maxLimit: number
  step?: number
  onRangeChange: (range: [number, number]) => void
  onMinInputChange: (min: number) => void
  onMaxInputChange: (max: number) => void
  className?: string
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  minLimit,
  maxLimit,
  step = 10,
  onRangeChange,
  onMinInputChange,
  onMaxInputChange,
  className,
}: PriceRangeFilterProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Label className="font-semibold text-xs text-foreground uppercase tracking-wider block">
          Faixa de Preço
        </Label>
        <span className="text-[11px] font-bold text-primary">
          {formatCurrency(minPrice)} — {formatCurrency(maxPrice)}
        </span>
      </div>

      {/* Range Slider com 2 controles (mínimo e máximo) */}
      <RangeSlider
        min={minLimit}
        max={maxLimit}
        step={step}
        value={[minPrice, maxPrice]}
        onValueChange={onRangeChange}
      />

      {/* Inputs Numéricos de Mínimo e Máximo */}
      <div className="grid grid-cols-2 gap-2 items-center">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground font-medium">De (R$):</span>
          <input
            type="number"
            min={minLimit}
            max={maxPrice}
            value={minPrice}
            onChange={(e) => onMinInputChange(Number(e.target.value))}
            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground font-medium">Até (R$):</span>
          <input
            type="number"
            min={minPrice}
            max={maxLimit}
            value={maxPrice}
            onChange={(e) => onMaxInputChange(Number(e.target.value))}
            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
    </div>
  )
}
