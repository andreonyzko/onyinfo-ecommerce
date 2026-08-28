import { useLoaderData } from 'react-router'
import type { ProductLoaderData } from '../router/loaders'

export function ProductPage() {
  const { product } = useLoaderData() as ProductLoaderData

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
      <p className="text-muted-foreground">{product.description}</p>
    </div>
  )
}
