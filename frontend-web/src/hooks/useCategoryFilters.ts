import { useState, useMemo } from 'react'
import type { Category, Product, ProductSortOption } from '../types'
import type { FilterState } from '../components/catalog/DynamicFilters'
import { sortProducts } from '../lib/sorting'

const PRICE_STEP = 10
const ITEMS_PER_PAGE = 8

interface UseCategoryFiltersOptions {
  category: Category
  products: Product[]
}

export function useCategoryFilters({ products }: UseCategoryFiltersOptions) {
  // Cálculo dos limites de preço inicial da categoria com múltiplos exatos de PRICE_STEP
  const { minInitialPrice, maxInitialPrice } = useMemo(() => {
    if (products.length === 0) return { minInitialPrice: 0, maxInitialPrice: 10000 }
    let min = products[0].price
    let max = products[0].price
    for (const p of products) {
      if (p.price < min) min = p.price
      if (p.price > max) max = p.price
    }
    return {
      minInitialPrice: Math.floor(min / PRICE_STEP) * PRICE_STEP,
      maxInitialPrice: Math.ceil(max / PRICE_STEP) * PRICE_STEP,
    }
  }, [products])

  // Estado dos filtros
  const [filters, setFilters] = useState<FilterState>(() => ({
    brands: [],
    minPrice: minInitialPrice,
    maxPrice: maxInitialPrice,
    stringSpecs: {},
    booleanSpecs: {},
    numberSpecs: {},
  }))

  const [sortBy, setSortBy] = useState<ProductSortOption>('relevance')
  const [currentPage, setCurrentPage] = useState(1)

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters({
      brands: [],
      minPrice: minInitialPrice,
      maxPrice: maxInitialPrice,
      stringSpecs: {},
      booleanSpecs: {},
      numberSpecs: {},
    })
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: ProductSortOption) => {
    setSortBy(newSort)
    setCurrentPage(1)
  }

  // Motor de Filtragem e Ordenação Reativa
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // 1. Filtro de Marcas
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      // 2. Filtro de Faixa de Preço
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false
      }

      // 3. Filtro de Especificações do tipo String
      for (const [key, selectedValues] of Object.entries(filters.stringSpecs)) {
        if (selectedValues.length > 0) {
          const productValue = product.specs[key]
          if (!productValue || !selectedValues.includes(String(productValue))) {
            return false
          }
        }
      }

      // 4. Filtro de Especificações do tipo Boolean
      for (const [key, isChecked] of Object.entries(filters.booleanSpecs)) {
        if (isChecked) {
          const productValue = product.specs[key]
          if (productValue !== true) {
            return false
          }
        }
      }

      // 5. Filtro de Especificações do tipo Number
      for (const [key, value] of Object.entries(filters.numberSpecs)) {
        const productValue = Number(product.specs[key])
        if (isNaN(productValue) || productValue > value) {
          return false
        }
      }

      return true
    })

    return sortProducts(filtered, sortBy)
  }, [products, filters, sortBy])

  // Paginação dos produtos filtrados
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAndSortedProducts, currentPage])

  // Contagem de filtros ativos
  const activeFilterCount =
    filters.brands.length +
    (filters.minPrice > minInitialPrice ? 1 : 0) +
    (filters.maxPrice < maxInitialPrice ? 1 : 0) +
    Object.values(filters.stringSpecs).reduce((acc, list) => acc + list.length, 0) +
    Object.values(filters.booleanSpecs).filter(Boolean).length +
    Object.keys(filters.numberSpecs).length

  return {
    filters,
    sortBy,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    totalPages,
    paginatedProducts,
    filteredAndSortedProducts,
    activeFilterCount,
    setCurrentPage,
    handleFilterChange,
    handleResetFilters,
    handleSortChange,
  }
}
