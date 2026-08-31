import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Badge } from '../ui/badge'

interface BrandOption {
  brand: string
  count: number
}

interface BrandFilterGroupProps {
  options: BrandOption[]
  selectedBrands: string[]
  onToggleBrand: (brand: string) => void
}

export function BrandFilterGroup({
  options,
  selectedBrands,
  onToggleBrand,
}: BrandFilterGroupProps) {
  if (options.length === 0) return null

  return (
    <div className="space-y-3">
      <Label className="font-semibold text-xs text-foreground uppercase tracking-wider block">
        Fabricante / Marca
      </Label>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
        {options.map(({ brand, count }) => {
          const isChecked = selectedBrands.includes(brand)
          return (
            <div
              key={brand}
              onClick={() => onToggleBrand(brand)}
              className="w-full flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => onToggleBrand(brand)}
                />
                <span
                  className={
                    isChecked
                      ? 'font-semibold text-foreground text-xs'
                      : 'text-xs group-hover:text-foreground'
                  }
                >
                  {brand}
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                {count}
              </Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}
