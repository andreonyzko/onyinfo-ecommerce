import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { PriceRangeFilter } from './PriceRangeFilter'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'

const PRICE_STEP = 10

export interface SearchFiltersState {
  categories: string[]
  brands: string[]
  minPrice: number
  maxPrice: number
}

export interface CategoryOption {
  slug: string
  name: string
  count: number
}

export interface BrandOption {
  brand: string
  count: number
}

interface SearchFiltersProps {
  filters: SearchFiltersState
  minGlobalPrice: number
  maxGlobalPrice: number
  categoryOptions: CategoryOption[]
  brandOptions: BrandOption[]
  onCategoryToggle: (slug: string) => void
  onBrandToggle: (brand: string) => void
  onPriceRangeChange: (range: [number, number]) => void
  onMinPriceInputChange: (val: number) => void
  onMaxPriceInputChange: (val: number) => void
  onResetFilters: () => void
}

export function SearchFilters({
  filters,
  minGlobalPrice,
  maxGlobalPrice,
  categoryOptions,
  brandOptions,
  onCategoryToggle,
  onBrandToggle,
  onPriceRangeChange,
  onMinPriceInputChange,
  onMaxPriceInputChange,
  onResetFilters,
}: SearchFiltersProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice > minGlobalPrice ||
    filters.maxPrice < maxGlobalPrice

  return (
    <div className="space-y-6 text-sm">
      {/* Cabeçalho dos Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span>Filtros da Busca</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar</span>
          </Button>
        )}
      </div>

      <Separator />

      {/* Faixa de Preço */}
      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        minLimit={minGlobalPrice}
        maxLimit={maxGlobalPrice}
        step={PRICE_STEP}
        onRangeChange={onPriceRangeChange}
        onMinInputChange={onMinPriceInputChange}
        onMaxInputChange={onMaxPriceInputChange}
      />

      <Separator />

      {/* Departamentos / Categorias */}
      {categoryOptions.length > 0 && (
        <div className="space-y-3">
          <Label className="font-semibold text-xs text-foreground uppercase tracking-wider block">
            Departamento
          </Label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
            {categoryOptions.map(({ slug, name, count }) => {
              const isChecked = filters.categories.includes(slug)
              return (
                <div
                  key={slug}
                  onClick={() => onCategoryToggle(slug)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onCategoryToggle(slug)}
                    />
                    <span
                      className={
                        isChecked
                          ? 'font-semibold text-foreground text-xs'
                          : 'text-xs group-hover:text-foreground'
                      }
                    >
                      {name}
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
      )}

      {/* Marcas / Fabricantes */}
      {brandOptions.length > 0 && (
        <div className="space-y-3 pt-2">
          <Separator className="mb-4" />
          <Label className="font-semibold text-xs text-foreground uppercase tracking-wider block">
            Fabricante / Marca
          </Label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
            {brandOptions.map(({ brand, count }) => {
              const isChecked = filters.brands.includes(brand)
              return (
                <div
                  key={brand}
                  onClick={() => onBrandToggle(brand)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onBrandToggle(brand)}
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
      )}
    </div>
  )
}
