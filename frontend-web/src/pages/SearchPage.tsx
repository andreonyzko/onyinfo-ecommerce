import { useState, useMemo } from 'react'
import { useLoaderData, useSearchParams, Link } from 'react-router'
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { SearchLoaderData } from '../router/loaders'
import type { Product, ProductSortOption } from '../types'
import { ProductCard } from '../components/catalog/ProductCard'
import { PriceRangeFilter } from '../components/catalog/PriceRangeFilter'
import { SortSelect } from '../components/catalog/SortSelect'
import { FilterToggle } from '../components/catalog/FilterToggle'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { EmptyState } from '../components/common/EmptyState'
import { Checkbox } from '../components/ui/checkbox'
import { Sheet, SheetHeader, SheetTitle } from '../components/ui/sheet'
import { Button, buttonVariants } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { sortProducts } from '../lib/sorting'
import { cn } from '../lib/utils'

const PRICE_STEP = 10

interface SearchFiltersState {
  categories: string[]
  brands: string[]
  minPrice: number
  maxPrice: number
}

export function SearchPage() {
  const { products, categories } = useLoaderData() as SearchLoaderData
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim().toLowerCase() || ''

  // 1. Filtragem Inicial por Termo de Busca (?q=...)
  const matchedByQuery = useMemo(() => {
    if (!query) return products
    return products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query)
      const descMatch = p.description.toLowerCase().includes(query)
      const brandMatch = p.brand.toLowerCase().includes(query)
      const categoryObj = categories.find((c) => c.slug === p.categorySlug)
      const catMatch = categoryObj?.name.toLowerCase().includes(query)
      return nameMatch || descMatch || brandMatch || catMatch
    })
  }, [products, categories, query])

  // 2. Limites de Preço do Resultado da Busca
  const { minGlobalPrice, maxGlobalPrice } = useMemo(() => {
    if (matchedByQuery.length === 0) return { minGlobalPrice: 0, maxGlobalPrice: 10000 }
    let min = matchedByQuery[0].price
    let max = matchedByQuery[0].price
    for (const p of matchedByQuery) {
      if (p.price < min) min = p.price
      if (p.price > max) max = p.price
    }
    return {
      minGlobalPrice: Math.floor(min / PRICE_STEP) * PRICE_STEP,
      maxGlobalPrice: Math.ceil(max / PRICE_STEP) * PRICE_STEP,
    }
  }, [matchedByQuery])

  // 3. Estado dos Filtros Laterais
  const [filters, setFilters] = useState<SearchFiltersState>(() => ({
    categories: [],
    brands: [],
    minPrice: minGlobalPrice,
    maxPrice: maxGlobalPrice,
  }))

  const [sortBy, setSortBy] = useState<ProductSortOption>('relevance')
  const [isDesktopFiltersVisible, setIsDesktopFiltersVisible] = useState(true)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // 4. Extração de Opções de Categorias presentes no resultado
  const categoryOptions = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of matchedByQuery) {
      counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1
    }
    return Object.entries(counts)
      .map(([slug, count]) => {
        const cat = categories.find((c) => c.slug === slug)
        return {
          slug,
          name: cat ? cat.name : slug,
          count,
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }, [matchedByQuery, categories])

  // 5. Extração de Opções de Marcas presentes no resultado
  const brandOptions = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of matchedByQuery) {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1
      }
    }
    return Object.entries(counts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => a.brand.localeCompare(b.brand, 'pt-BR'))
  }, [matchedByQuery])

  // Handlers de Filtros
  const handleCategoryToggle = (slug: string) => {
    setFilters((prev) => {
      const isSelected = prev.categories.includes(slug)
      return {
        ...prev,
        categories: isSelected
          ? prev.categories.filter((c) => c !== slug)
          : [...prev.categories, slug],
      }
    })
  }

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => {
      const isSelected = prev.brands.includes(brand)
      return {
        ...prev,
        brands: isSelected
          ? prev.brands.filter((b) => b !== brand)
          : [...prev.brands, brand],
      }
    })
  }

  const handlePriceRangeChange = ([newMin, newMax]: [number, number]) => {
    setFilters((prev) => ({ ...prev, minPrice: newMin, maxPrice: newMax }))
  }

  const handleMinPriceInputChange = (val: number) => {
    const safeVal = Math.min(Math.max(minGlobalPrice, val), filters.maxPrice)
    setFilters((prev) => ({ ...prev, minPrice: safeVal }))
  }

  const handleMaxPriceInputChange = (val: number) => {
    const safeVal = Math.max(Math.min(maxGlobalPrice, val), filters.minPrice)
    setFilters((prev) => ({ ...prev, maxPrice: safeVal }))
  }

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      minPrice: minGlobalPrice,
      maxPrice: maxGlobalPrice,
    })
  }

  // 6. Filtragem e Ordenação Final
  const finalProducts = useMemo(() => {
    const filtered = matchedByQuery.filter((product: Product) => {
      // Filtro por Categoria
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.categorySlug)
      ) {
        return false
      }

      // Filtro por Marca
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      // Filtro por Preço
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false
      }

      return true
    })

    return sortProducts(filtered, sortBy)
  }, [matchedByQuery, filters, sortBy])

  // Contagem de filtros ativos
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice > minGlobalPrice ||
    filters.maxPrice < maxGlobalPrice

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    (filters.minPrice > minGlobalPrice ? 1 : 0) +
    (filters.maxPrice < maxGlobalPrice ? 1 : 0)

  // Componente de Sidebar de Filtros da Busca
  const SearchFiltersContent = (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span>Filtros da Busca</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar</span>
          </Button>
        )}
      </div>

      <Separator />

      {/* Faixa de Preço Reutilizável */}
      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        minLimit={minGlobalPrice}
        maxLimit={maxGlobalPrice}
        step={PRICE_STEP}
        onRangeChange={handlePriceRangeChange}
        onMinInputChange={handleMinPriceInputChange}
        onMaxInputChange={handleMaxPriceInputChange}
      />

      <Separator />

      {/* Departamentos / Categorias */}
      {categoryOptions.length > 0 && (
        <div className="space-y-3">
          <Label className="font-semibold text-xs text-foreground uppercase tracking-wider block">
            Departamento
          </Label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
            {categoryOptions.map(({ slug, name, count }) => {
              const isChecked = filters.categories.includes(slug)
              return (
                <div
                  key={slug}
                  onClick={() => handleCategoryToggle(slug)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleCategoryToggle(slug)}
                    />
                    <span className={isChecked ? 'font-semibold text-foreground text-xs' : 'text-xs group-hover:text-foreground'}>
                      {name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                    {count}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Marcas / Fabricantes */}
      {brandOptions.length > 0 && (
        <div className="space-y-3 pt-2">
          <Separator className="mb-4" />
          <Label className="font-semibold text-xs text-foreground uppercase tracking-wider block">
            Fabricante / Marca
          </Label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
            {brandOptions.map(({ brand, count }) => {
              const isChecked = filters.brands.includes(brand)
              return (
                <div
                  key={brand}
                  onClick={() => handleBrandToggle(brand)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleBrandToggle(brand)}
                    />
                    <span className={isChecked ? 'font-semibold text-foreground text-xs' : 'text-xs group-hover:text-foreground'}>
                      {brand}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                    {count}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb de Navegação Estruturada */}
      <Breadcrumb
        items={
          query
            ? [{ label: 'Busca', href: '/busca' }, { label: `"${query}"` }]
            : [{ label: 'Busca' }]
        }
      />

      {/* Cabeçalho da Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {query ? (
                <span>
                  Resultados para <span className="text-primary">&quot;{query}&quot;</span>
                </span>
              ) : (
                'Catálogo Completo de Hardware'
              )}
            </h1>
            <Badge variant="secondary" className="text-xs">
              {finalProducts.length} de {matchedByQuery.length} itens
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Encontre componentes de alta performance com filtros avançados de hardware.
          </p>
        </div>

        {/* Controles de Ordenação e Botões de Filtro */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Botões de Toggle de Filtros Desktop e Mobile */}
          <FilterToggle
            isDesktopVisible={isDesktopFiltersVisible}
            onToggleDesktop={() => setIsDesktopFiltersVisible((prev) => !prev)}
            onOpenMobile={() => setIsMobileFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {/* Dropdown de Ordenação Customizado */}
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Layout Principal: Sidebar de Filtros + Grid de Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Desktop (Colapsável) */}
        {isDesktopFiltersVisible && (
          <aside className="hidden lg:block p-5 rounded-xl border border-border bg-card shadow-xs sticky top-28 animate-in fade-in-0 duration-200">
            {SearchFiltersContent}
          </aside>
        )}

        {/* Drawer de Filtros Mobile (Sheet) */}
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetHeader>
            <SheetTitle>Filtros da Busca</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto pr-2 flex-1">
            {SearchFiltersContent}
          </div>
          <div className="pt-4 mt-auto border-t border-border">
            <Button
              className="w-full font-semibold"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Ver {finalProducts.length} produtos
            </Button>
          </div>
        </Sheet>

        {/* Grid de Produtos */}
        <div className={cn(isDesktopFiltersVisible ? 'lg:col-span-3' : 'lg:col-span-4')}>
          {finalProducts.length > 0 ? (
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-2 gap-5',
                isDesktopFiltersVisible
                  ? 'md:grid-cols-3'
                  : 'md:grid-cols-3 lg:grid-cols-4'
              )}
            >
              {finalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum produto encontrado"
              description={
                query
                  ? `Não encontramos resultados para "${query}". Tente buscar por outros termos ou redefinir os filtros.`
                  : 'Nenhum item corresponde à combinação de filtros selecionada.'
              }
              action={
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      Redefinir Filtros
                    </Button>
                  )}
                  <Link
                    to="/"
                    className={cn(
                      buttonVariants({ size: 'sm' }),
                      'gap-1.5 font-semibold'
                    )}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Voltar à Home</span>
                  </Link>
                </div>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
