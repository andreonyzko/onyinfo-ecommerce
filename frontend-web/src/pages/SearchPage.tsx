import { useLoaderData, useSearchParams } from 'react-router'
import type { SearchLoaderData } from '../router/loaders'

export function SearchPage() {
  const { products } = useLoaderData() as SearchLoaderData
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim().toLowerCase() || ''

  const filteredProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      )
    : products

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {query ? `Resultados para "${query}"` : 'Todos os Produtos'}
      </h1>
      <p className="text-muted-foreground mb-6">
        {filteredProducts.length} produto(s) encontrado(s).
      </p>
    </div>
  )
}
