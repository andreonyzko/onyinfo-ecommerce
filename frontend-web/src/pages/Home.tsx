import { useLoaderData } from 'react-router'
import type { HomeLoaderData } from '../router/loaders'

export function HomePage() {
  const { categories, products } = useLoaderData() as HomeLoaderData

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="rounded-2xl bg-linear-to-r from-primary/10 via-accent/10 to-primary/5 p-8 border border-border">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Hardware de Alta Performance na OnyInfo
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Explore nosso catálogo com os melhores componentes para o seu setup.
          Totalmente data-driven, ultrarrápido e construído para entusiastas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-bold text-lg mb-2">Categorias Ativas</h3>
          <p className="text-3xl font-extrabold text-primary">{categories.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Carregadas via metadados</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-bold text-lg mb-2">Produtos no Catálogo</h3>
          <p className="text-3xl font-extrabold text-primary">{products.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total de peças cadastradas</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-bold text-lg mb-2">Desconto no PIX</h3>
          <p className="text-3xl font-extrabold text-emerald-500">5% OFF</p>
          <p className="text-xs text-muted-foreground mt-1">Economia em todos os itens</p>
        </div>
      </div>
    </div>
  )
}
