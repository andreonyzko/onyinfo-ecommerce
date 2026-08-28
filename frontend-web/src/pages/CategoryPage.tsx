import { useLoaderData } from 'react-router'
import type { CategoryLoaderData } from '../router/loaders'

export function CategoryPage() {
  const { category, products } = useLoaderData() as CategoryLoaderData

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{category.name}</h1>
      <p className="text-muted-foreground mb-6">
        Exibindo {products.length} produtos encontrados nesta categoria.
      </p>
    </div>
  )
}
