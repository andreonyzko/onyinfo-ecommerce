import { useState, useMemo } from 'react'
import { useLoaderData, Link } from 'react-router'
import {
  ChevronRight,
  Filter,
  PackageOpen,
  ArrowUpDown,
  EyeOff,
  Eye,
} from 'lucide-react'
import type { CategoryLoaderData } from '../router/loaders'
import type { Category, Product, ProductSortOption } from '../types'
import { ProductCard } from '../components/catalog/ProductCard'
import {
  DynamicFilters,
  type FilterState,
} from '../components/catalog/DynamicFilters'
import { Sheet, SheetHeader, SheetTitle } from '../components/ui/sheet'
import { CustomSelect, type SelectOption } from '../components/ui/select'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { cn } from '../lib/utils'

interface CategoryViewProps {
  category: Category
  products: Product[]
}

const SORT_OPTIONS: SelectOption<ProductSortOption>[] = [
  { value: 'relevance', label: 'Destaques (Padrão)' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'name-asc', label: 'Nome (A - Z)' },
  { value: 'name-desc', label: 'Nome (Z - A)' },
]

const PRICE_STEP = 10

function CategoryView({ category, products }: CategoryViewProps) {
  // Cálculo dos limites de preço inicial da categoria com múltiplos exatos de PRICE_STEP
  const { minInitialPrice, maxInitialPrice } = useMemo(() => {
    if (products.length === 0) return { minInitialPrice: 0, maxInitialPrice: 10000 }
    let min = products[0].price
    let max = products[0].price
    for (const p of products) {
      if (p.price < min) min = p.price
      if (p.price > max) max = p.price
    }
    return {
      minInitialPrice: Math.floor(min / PRICE_STEP) * PRICE_STEP,
      maxInitialPrice: Math.ceil(max / PRICE_STEP) * PRICE_STEP,
    }
  }, [products])

  // Estado dos filtros
  const [filters, setFilters] = useState<FilterState>(() => ({
    brands: [],
    minPrice: minInitialPrice,
    maxPrice: maxInitialPrice,
    stringSpecs: {},
    booleanSpecs: {},
    numberSpecs: {},
  }))

  // Estado de ordenação, visibilidade no desktop e gaveta móvel
  const [sortBy, setSortBy] = useState<ProductSortOption>('relevance')
  const [isDesktopFiltersVisible, setIsDesktopFiltersVisible] = useState(true)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const handleResetFilters = () => {
    setFilters({
      brands: [],
      minPrice: minInitialPrice,
      maxPrice: maxInitialPrice,
      stringSpecs: {},
      booleanSpecs: {},
      numberSpecs: {},
    })
  }

  // Motor de Filtragem e Ordenação Reativa
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      // 1. Filtro de Marcas
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      // 2. Filtro de Faixa de Preço (Mínimo e Máximo)
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false
      }

      // 3. Filtros de String Specs
      for (const [specKey, selectedValues] of Object.entries(filters.stringSpecs)) {
        if (selectedValues.length > 0) {
          const productValue = String(product.specs?.[specKey] ?? '')
          if (!selectedValues.includes(productValue)) {
            return false
          }
        }
      }

      // 4. Filtros de Boolean Specs
      for (const [specKey, isRequired] of Object.entries(filters.booleanSpecs)) {
        if (isRequired) {
          const productValue = Boolean(product.specs?.[specKey])
          if (!productValue) {
            return false
          }
        }
      }

      // 5. Filtros de Number Specs
      for (const [specKey, maxAllowed] of Object.entries(filters.numberSpecs)) {
        const productValue = Number(product.specs?.[specKey] ?? 0)
        if (productValue > maxAllowed) {
          return false
        }
      }

      return true
    })

    // Ordenação
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
      return 0
    })

    return result
  }, [products, filters, sortBy])

  // Contagem de filtros ativos
  const activeFilterCount =
    filters.brands.length +
    (filters.minPrice > minInitialPrice ? 1 : 0) +
    (filters.maxPrice < maxInitialPrice ? 1 : 0) +
    Object.values(filters.stringSpecs).reduce((acc, list) => acc + list.length, 0) +
    Object.values(filters.booleanSpecs).filter(Boolean).length +
    Object.keys(filters.numberSpecs).length

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb de Navegação */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-semibold">{category.name}</span>
      </nav>

      {/* Cabeçalho da Categoria */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {category.name}
            </h1>
            <Badge variant="secondary" className="text-xs">
              {filteredAndSortedProducts.length} de {products.length} produtos
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Filtre por especificações técnicas e encontre o hardware ideal para o seu setup.
          </p>
        </div>

        {/* Controles de Ordenação e Botões de Filtro */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Botão de Toggle de Filtros Desktop */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDesktopFiltersVisible((prev) => !prev)}
            className="hidden lg:inline-flex items-center gap-1.5 cursor-pointer text-xs h-9"
          >
            {isDesktopFiltersVisible ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Ocultar Filtros</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Mostrar Filtros</span>
              </>
            )}
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-1 px-1.5 py-0 text-[10px] h-4">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Botão de Filtro Mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden gap-1.5 cursor-pointer text-xs h-9"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-1 px-1.5 py-0 text-[10px] h-4">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Dropdown de Ordenação Customizado (com suporte completo a Dark/Light Mode) */}
          <CustomSelect<ProductSortOption>
            value={sortBy}
            options={SORT_OPTIONS}
            onChange={setSortBy}
            icon={<ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground mr-1" />}
            className="min-w-[170px]"
          />
        </div>
      </div>

      {/* Layout Principal: Sidebar de Filtros + Grid de Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Desktop (Colapsável) */}
        {isDesktopFiltersVisible && (
          <aside className="hidden lg:block p-5 rounded-xl border border-border bg-card shadow-xs sticky top-28 animate-in fade-in-0 duration-200">
            <DynamicFilters
              category={category}
              products={products}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
            />
          </aside>
        )}

        {/* Drawer de Filtros Mobile (Sheet) */}
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetHeader>
            <SheetTitle>Filtros de {category.name}</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto pr-2 flex-1">
            <DynamicFilters
              category={category}
              products={products}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
            />
          </div>
          <div className="pt-4 mt-auto border-t border-border">
            <Button
              className="w-full font-semibold"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Ver {filteredAndSortedProducts.length} produtos
            </Button>
          </div>
        </Sheet>

        {/* Grid de Produtos (Expansível para 4 colunas quando filtros ocultos) */}
        <div className={cn(isDesktopFiltersVisible ? 'lg:col-span-3' : 'lg:col-span-4')}>
          {filteredAndSortedProducts.length > 0 ? (
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-2 gap-5',
                isDesktopFiltersVisible
                  ? 'md:grid-cols-3'
                  : 'md:grid-cols-3 lg:grid-cols-4'
              )}
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-xl bg-card/40">
              <PackageOpen className="w-12 h-12 text-muted-foreground/60 mb-3" />
              <h3 className="font-bold text-lg text-foreground">Nenhum produto encontrado</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-5">
                Não encontramos itens correspondentes à combinação de filtros selecionados para esta categoria.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Redefinir Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CategoryPage() {
  const { category, products } = useLoaderData() as CategoryLoaderData
  return <CategoryView key={category.slug} category={category} products={products} />
}
