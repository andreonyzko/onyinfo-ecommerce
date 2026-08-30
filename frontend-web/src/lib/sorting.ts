import type { Product, ProductSortOption } from '../types'
import type { SelectOption } from '../components/ui/select'

export const SORT_OPTIONS: SelectOption<ProductSortOption>[] = [
  { value: 'relevance', label: 'Destaques (Padrão)' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'name-asc', label: 'Nome (A - Z)' },
  { value: 'name-desc', label: 'Nome (Z - A)' },
]

/**
 * Função pura para ordenação determinística de produtos.
 */
export function sortProducts(products: Product[], sortBy: ProductSortOption): Product[] {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'name-asc':
        return a.name.localeCompare(b.name, 'pt-BR')
      case 'name-desc':
        return b.name.localeCompare(a.name, 'pt-BR')
      case 'relevance':
      default:
        return 0
    }
  })
}
