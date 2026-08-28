import { useLoaderData, Link } from 'react-router'
import { ArrowRight, Cpu, ShieldCheck, Truck, Zap, Sparkles } from 'lucide-react'
import type { HomeLoaderData } from '../router/loaders'
import { ProductCard } from '../components/catalog/ProductCard'
import { buttonVariants } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { cn } from '../lib/utils'

export function HomePage() {
  const { categories, products } = useLoaderData() as HomeLoaderData

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-primary/5 via-background to-background py-12 md:py-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Desafio 1 Bootcamp AWS AI FDE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                Hardware de Alta Performance,{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-blue-500 to-indigo-500">
                  100% Data-Driven
                </span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Explore o catálogo completo de processadores, placas de vídeo, memórias e periféricos.
                Construído como uma aplicação <em>headless em miniatura</em> totalmente no client-side com carregamento instantâneo.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/busca"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'rounded-full px-6 font-semibold gap-2 shadow-md'
                  )}
                >
                  <span>Explorar Todos os Produtos</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/como-fiz"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'rounded-full px-6 font-semibold gap-2'
                  )}
                >
                  <span>Defesa Técnica</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl border border-border bg-card/80 backdrop-blur-xs shadow-xs space-y-1">
                <Zap className="w-5 h-5 text-amber-500 mb-2" />
                <div className="text-lg font-black text-foreground">5% OFF</div>
                <p className="text-xs text-muted-foreground">Desconto automático via PIX</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card/80 backdrop-blur-xs shadow-xs space-y-1">
                <Truck className="w-5 h-5 text-blue-500 mb-2" />
                <div className="text-lg font-black text-foreground">ViaCEP</div>
                <p className="text-xs text-muted-foreground">Consulta de CEP em tempo real</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card/80 backdrop-blur-xs shadow-xs space-y-1">
                <Cpu className="w-5 h-5 text-emerald-500 mb-2" />
                <div className="text-lg font-black text-foreground">{products.length} Peças</div>
                <p className="text-xs text-muted-foreground">Em 16 categorias mapeadas</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card/80 backdrop-blur-xs shadow-xs space-y-1">
                <ShieldCheck className="w-5 h-5 text-violet-500 mb-2" />
                <div className="text-lg font-black text-foreground">Lighthouse</div>
                <p className="text-xs text-muted-foreground">Performance e acessibilidade 90+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vitrines por Categoria (Até 5 produtos por seção + "Ver mais") */}
      <div className="container mx-auto px-4 space-y-14">
        {categories.map((category) => {
          const categoryProducts = products.filter(
            (p) => p.categorySlug === category.slug
          )

          if (categoryProducts.length === 0) {
            return null
          }

          // RF05: Limitar a até 5 itens por vitrine na Home
          const showcaseProducts = categoryProducts.slice(0, 5)

          return (
            <section
              key={category.slug}
              className="space-y-5"
              aria-labelledby={`category-heading-${category.slug}`}
            >
              {/* Header da Vitrine */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <h2
                    id={`category-heading-${category.slug}`}
                    className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
                  >
                    {category.name}
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    {categoryProducts.length} itens
                  </Badge>
                </div>

                <Link
                  to={`/categoria/${category.slug}`}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'gap-1.5 text-primary hover:text-primary font-semibold text-xs self-start sm:self-auto cursor-pointer'
                  )}
                >
                  <span>Ver mais em {category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Grid de Produtos da Vitrine */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {showcaseProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
