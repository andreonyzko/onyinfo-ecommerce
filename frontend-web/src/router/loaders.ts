import type { LoaderFunctionArgs } from 'react-router'
import type { Category, Product } from '../types'
import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchProducts,
  fetchProductsByCategory,
  fetchProductBySlug,
} from '../services'

export interface RootLoaderData {
  categories: Category[]
}

export async function rootLoader(): Promise<RootLoaderData> {
  const categories = await fetchCategories()
  return { categories }
}

export interface HomeLoaderData {
  categories: Category[]
  products: Product[]
  totalProductsCount: number
}

export async function homeLoader(): Promise<HomeLoaderData> {
  const [allCategories, allProducts] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ])

  // Limita para as 3 primeiras categorias que possuem produtos
  const categories = allCategories
    .filter((cat) => allProducts.some((p) => p.categorySlug === cat.slug))
    .slice(0, 3)

  // Limita para no máximo 5 produtos para cada uma das 3 categorias
  const products: Product[] = []
  for (const cat of categories) {
    const categoryProducts = allProducts
      .filter((p) => p.categorySlug === cat.slug)
      .slice(0, 5)
    products.push(...categoryProducts)
  }

  return {
    categories,
    products,
    totalProductsCount: allProducts.length,
  }
}

export interface CategoryLoaderData {
  category: Category
  products: Product[]
}

export async function categoryLoader({
  params,
}: LoaderFunctionArgs): Promise<CategoryLoaderData> {
  const { slug } = params
  if (!slug) {
    throw new Response('Slug de categoria não informado', { status: 400 })
  }

  const [category, products] = await Promise.all([
    fetchCategoryBySlug(slug),
    fetchProductsByCategory(slug),
  ])

  if (!category) {
    throw new Response('Categoria não encontrada', { status: 404 })
  }

  return { category, products }
}

export interface ProductLoaderData {
  product: Product
  category?: Category
  relatedProducts: Product[]
}

export async function productLoader({
  params,
}: LoaderFunctionArgs): Promise<ProductLoaderData> {
  const { slug } = params
  if (!slug) {
    throw new Response('Slug de produto não informado', { status: 400 })
  }

  const product = await fetchProductBySlug(slug)
  if (!product) {
    throw new Response('Produto não encontrado', { status: 404 })
  }

  const [category, categoryProducts] = await Promise.all([
    fetchCategoryBySlug(product.categorySlug),
    fetchProductsByCategory(product.categorySlug),
  ])

  const relatedProducts = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return { product, category, relatedProducts }
}

export interface SearchLoaderData {
  products: Product[]
  categories: Category[]
  query: string
}

export async function searchLoader({
  request,
}: LoaderFunctionArgs): Promise<SearchLoaderData> {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')?.trim().toLowerCase() || ''

  const [allProducts, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ])

  // Filtragem inicial por termo de busca (?q=...) no loader
  const products = !query
    ? allProducts
    : allProducts.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(query)
        const descMatch = p.description.toLowerCase().includes(query)
        const brandMatch = p.brand.toLowerCase().includes(query)
        const categoryObj = categories.find((c) => c.slug === p.categorySlug)
        const catMatch = categoryObj?.name.toLowerCase().includes(query)
        return nameMatch || descMatch || brandMatch || catMatch
      })

  return {
    products,
    categories,
    query,
  }
}
