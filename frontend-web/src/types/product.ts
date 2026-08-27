export type ProductSpecValue = string | number | boolean

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  categorySlug: string
  brand: string
  image: string
  specs: Record<string, ProductSpecValue>
}

export type ProductSortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
