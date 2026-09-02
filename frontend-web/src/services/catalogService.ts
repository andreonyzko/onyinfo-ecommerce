import type { Category, Product } from '../types'
import { formatAssetUrl } from '../lib/utils'

let categoriesCache: Category[] | null = null
let productsCache: Product[] | null = null

/**
 * Busca todas as categorias a partir do categories.json com cache em memória.
 */
export async function fetchCategories(): Promise<Category[]> {
  if (categoriesCache) {
    return categoriesCache
  }

  try {
    const response = await fetch(formatAssetUrl('/datas/categories.json'))
    if (!response.ok) {
      throw new Error(`Falha ao carregar categorias: status ${response.status}`)
    }
    const data: Category[] = await response.json()
    categoriesCache = data
    return data
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    throw error
  }
}

/**
 * Busca uma categoria específica pelo seu slug.
 */
export async function fetchCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const categories = await fetchCategories()
  return categories.find((cat) => cat.slug === slug)
}

/**
 * Busca todos os produtos a partir do products.json com cache em memória.
 */
export async function fetchProducts(): Promise<Product[]> {
  if (productsCache) {
    return productsCache
  }

  try {
    const response = await fetch(formatAssetUrl('/datas/products.json'))
    if (!response.ok) {
      throw new Error(`Falha ao carregar produtos: status ${response.status}`)
    }
    const data: Product[] = await response.json()
    productsCache = data
    return data
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    throw error
  }
}

/**
 * Busca produtos de uma determinada categoria pelo slug da categoria.
 */
export async function fetchProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const products = await fetchProducts()
  return products.filter((prod) => prod.categorySlug === categorySlug)
}

/**
 * Busca um produto específico pelo seu slug único.
 */
export async function fetchProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await fetchProducts()
  return products.find((prod) => prod.slug === slug)
}

/**
 * Filtra produtos pelo termo de busca textual (nome, descrição ou marca).
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await fetchProducts()
  const normalizedQuery = query.toLowerCase().trim()

  if (!normalizedQuery) {
    return products
  }

  return products.filter(
    (prod) =>
      prod.name.toLowerCase().includes(normalizedQuery) ||
      prod.description.toLowerCase().includes(normalizedQuery) ||
      prod.brand.toLowerCase().includes(normalizedQuery)
  )
}
