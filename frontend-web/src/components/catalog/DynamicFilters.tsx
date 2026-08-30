import { useMemo } from 'react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { Category, Product } from '../../types'
import { Checkbox } from '../ui/checkbox'
import { Slider } from '../ui/slider'
import { PriceRangeFilter } from './PriceRangeFilter'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

export interface FilterState {
  brands: string[]
  minPrice: number
  maxPrice: number
  stringSpecs: Record<string, string[]>
  booleanSpecs: Record<string, boolean>
  numberSpecs: Record<string, number>
}

interface DynamicFiltersProps {
  category: Category
  products: Product[]
  filters: FilterState
  onFilterChange: (newFilters: FilterState) => void
  onResetFilters: () => void
}

type SpecType = 'string' | 'number' | 'boolean'

interface SpecMetadata {
  key: string
  label: string
  type: SpecType
  options?: { value: string; count: number }[]
  min?: number
  max?: number
}

const PRICE_STEP = 10

export function DynamicFilters({
  category,
  products,
  filters,
  onFilterChange,
  onResetFilters,
}: DynamicFiltersProps) {
  // 1. Extração de Marcas Únicas e Contagem
  const brandOptions = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of products) {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1
      }
    }
    return Object.entries(counts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => a.brand.localeCompare(b.brand))
  }, [products])

  // 2. Cálculo do Preço Mínimo e Máximo Real da Categoria com múltiplos exatos do step
  const { minCategoryPrice, maxCategoryPrice } = useMemo(() => {
    if (products.length === 0) return { minCategoryPrice: 0, maxCategoryPrice: 10000 }
    let min = products[0].price
    let max = products[0].price
    for (const p of products) {
      if (p.price < min) min = p.price
      if (p.price > max) max = p.price
    }
    const cleanMin = Math.floor(min / PRICE_STEP) * PRICE_STEP
    const cleanMax = Math.ceil(max / PRICE_STEP) * PRICE_STEP
    return { minCategoryPrice: cleanMin, maxCategoryPrice: cleanMax }
  }, [products])

  // 3. Inferência de Tipos de Specs e Opções a partir de categories.json e products
  const specsMetadata = useMemo<SpecMetadata[]>(() => {
    const list: SpecMetadata[] = []
    const specKeys = Object.keys(category.specs || {})

    for (const key of specKeys) {
      const label = category.specs[key]
      const sampleValues = products
        .map((p) => p.specs?.[key])
        .filter((val) => val !== undefined && val !== null)

      if (sampleValues.length === 0) continue

      const firstVal = sampleValues[0]

      if (typeof firstVal === 'boolean') {
        list.push({
          key,
          label,
          type: 'boolean',
        })
      } else if (typeof firstVal === 'number') {
        const numbers = sampleValues.filter((v): v is number => typeof v === 'number')
        const min = Math.min(...numbers)
        const max = Math.max(...numbers)
        list.push({
          key,
          label,
          type: 'number',
          min,
          max,
        })
      } else {
        // String Spec: agrupa valores e conta ocorrências
        const counts: Record<string, number> = {}
        for (const val of sampleValues) {
          const strVal = String(val)
          counts[strVal] = (counts[strVal] || 0) + 1
        }
        const options = Object.entries(counts)
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => a.value.localeCompare(b.value))

        list.push({
          key,
          label,
          type: 'string',
          options,
        })
      }
    }

    return list
  }, [category, products])

  // Handlers para mutação de filtros
  const handleBrandToggle = (brand: string) => {
    const isSelected = filters.brands.includes(brand)
    const updated = isSelected
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    onFilterChange({ ...filters, brands: updated })
  }

  const handlePriceRangeChange = ([newMin, newMax]: [number, number]) => {
    onFilterChange({ ...filters, minPrice: newMin, maxPrice: newMax })
  }

  const handleMinPriceInputChange = (val: number) => {
    const safeVal = Math.min(Math.max(minCategoryPrice, val), filters.maxPrice)
    onFilterChange({ ...filters, minPrice: safeVal })
  }

  const handleMaxPriceInputChange = (val: number) => {
    const safeVal = Math.max(Math.min(maxCategoryPrice, val), filters.minPrice)
    onFilterChange({ ...filters, maxPrice: safeVal })
  }

  const handleStringSpecToggle = (key: string, value: string) => {
    const currentList = filters.stringSpecs[key] || []
    const isSelected = currentList.includes(value)
    const updated = isSelected
      ? currentList.filter((v) => v !== value)
      : [...currentList, value]

    onFilterChange({
      ...filters,
      stringSpecs: {
        ...filters.stringSpecs,
        [key]: updated,
      },
    })
  }

  const handleBooleanSpecToggle = (key: string) => {
    const current = filters.booleanSpecs[key] || false
    onFilterChange({
      ...filters,
      booleanSpecs: {
        ...filters.booleanSpecs,
        [key]: !current,
      },
    })
  }

  const handleNumberSpecChange = (key: string, value: number) => {
    onFilterChange({
      ...filters,
      numberSpecs: {
        ...filters.numberSpecs,
        [key]: value,
      },
    })
  }

  // Verifica se há algum filtro ativado
  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.minPrice > minCategoryPrice ||
    filters.maxPrice < maxCategoryPrice ||
    Object.values(filters.stringSpecs).some((list) => list.length > 0) ||
    Object.values(filters.booleanSpecs).some((bool) => bool === true) ||
    Object.keys(filters.numberSpecs).length > 0

  return (
    <div className="space-y-6 text-sm">
      {/* Cabeçalho dos Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span>Filtros</span>
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

      {/* 1. Filtro de Faixa de Preço */}
      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        minLimit={minCategoryPrice}
        maxLimit={maxCategoryPrice}
        step={PRICE_STEP}
        onRangeChange={handlePriceRangeChange}
        onMinInputChange={handleMinPriceInputChange}
        onMaxInputChange={handleMaxPriceInputChange}
      />

      <Separator />

      {/* 2. Filtro de Marcas / Fabricantes */}
      {brandOptions.length > 0 && (
        <div className="space-y-3">
          <Label className="font-semibold text-xs text-foreground uppercase tracking-wider block">
            Fabricante / Marca
          </Label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
            {brandOptions.map(({ brand, count }) => {
              const isChecked = filters.brands.includes(brand)
              return (
                <div
                  key={brand}
                  onClick={() => handleBrandToggle(brand)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleBrandToggle(brand)}
                    />
                    <span className={isChecked ? 'font-semibold text-foreground text-xs' : 'text-xs group-hover:text-foreground'}>
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

      {/* 3. Filtros Gerados Dinamicamente por Metadados (specs) */}
      {specsMetadata.map((spec) => (
        <div key={spec.key} className="space-y-3 pt-2">
          <Separator className="mb-4" />
          <Label className="font-semibold text-xs text-foreground uppercase tracking-wider block">
            {spec.label}
          </Label>

          {/* Tipo STRING: Renderiza Lista de Checkboxes clicáveis */}
          {spec.type === 'string' && spec.options && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-none">
              {spec.options.map(({ value, count }) => {
                const isChecked = (filters.stringSpecs[spec.key] || []).includes(value)
                return (
                  <div
                    key={value}
                    onClick={() => handleStringSpecToggle(spec.key, value)}
                    className="w-full flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleStringSpecToggle(spec.key, value)}
                      />
                      <span className={isChecked ? 'font-semibold text-foreground text-xs' : 'text-xs group-hover:text-foreground'}>
                        {value}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                      {count}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}

          {/* Tipo NUMBER: Renderiza Range Slider */}
          {spec.type === 'number' && spec.min !== undefined && spec.max !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Valor Máximo:</span>
                <span className="font-bold text-primary">
                  {filters.numberSpecs[spec.key] !== undefined
                    ? filters.numberSpecs[spec.key]
                    : spec.max}
                </span>
              </div>
              <Slider
                min={spec.min}
                max={spec.max}
                step={1}
                value={filters.numberSpecs[spec.key] ?? spec.max}
                onValueChange={(val) => handleNumberSpecChange(spec.key, val)}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Min: {spec.min}</span>
                <span>Max: {spec.max}</span>
              </div>
            </div>
          )}

          {/* Tipo BOOLEAN: Renderiza Checkbox Simples */}
          {spec.type === 'boolean' && (
            <div
              onClick={() => handleBooleanSpecToggle(spec.key)}
              className="w-full flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
            >
              <Checkbox
                checked={filters.booleanSpecs[spec.key] || false}
                onCheckedChange={() => handleBooleanSpecToggle(spec.key)}
              />
              <span className={filters.booleanSpecs[spec.key] ? 'font-semibold text-foreground text-xs' : 'text-xs group-hover:text-foreground'}>
                Apenas com {spec.label}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
