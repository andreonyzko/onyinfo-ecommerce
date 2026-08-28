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
}

export async function homeLoader(): Promise<HomeLoaderData> {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ])
  return { categories, products }
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

  const category = await fetchCategoryBySlug(product.categorySlug)

  return { product, category }
}

export interface SearchLoaderData {
  products: Product[]
}

export async function searchLoader(): Promise<SearchLoaderData> {
  const products = await fetchProducts()
  return { products }
}
