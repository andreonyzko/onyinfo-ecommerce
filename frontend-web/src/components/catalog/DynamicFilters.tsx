import { useMemo } from 'react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { Category, Product } from '../../types'
import { PriceRangeFilter } from './PriceRangeFilter'
import { BrandFilterGroup } from './BrandFilterGroup'
import { SpecFilterItem, type SpecMetadata } from './SpecFilterItem'
import { Button } from '../ui/button'
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
        const counts: Record<string, number> = {}
        for (const p of products) {
          const raw = p.specs?.[key]
          if (raw !== undefined && raw !== null) {
            const strVal = String(raw)
            counts[strVal] = (counts[strVal] || 0) + 1
          }
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

  // Manipuladores de Filtros
  const handleBrandToggle = (brand: string) => {
    const isSelected = filters.brands.includes(brand)
    const updated = isSelected
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    onFilterChange({ ...filters, brands: updated })
  }

  const handlePriceRangeChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    })
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
      <BrandFilterGroup
        options={brandOptions}
        selectedBrands={filters.brands}
        onToggleBrand={handleBrandToggle}
      />

      {/* 3. Filtros Gerados Dinamicamente por Metadados (specs) */}
      {specsMetadata.map((spec) => (
        <SpecFilterItem
          key={spec.key}
          spec={spec}
          selectedStringValues={filters.stringSpecs[spec.key]}
          isBooleanChecked={filters.booleanSpecs[spec.key]}
          selectedNumberValue={filters.numberSpecs[spec.key]}
          onStringToggle={handleStringSpecToggle}
          onBooleanToggle={handleBooleanSpecToggle}
          onNumberChange={handleNumberSpecChange}
        />
      ))}
    </div>
  )
}
