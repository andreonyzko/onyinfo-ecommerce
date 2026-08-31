import { useState, useMemo } from 'react'
import { useLoaderData } from 'react-router'
import type { CategoryLoaderData } from '../router/loaders'
import type { Category, Product, ProductSortOption } from '../types'
import { ProductCard } from '../components/catalog/ProductCard'
import { DynamicFilters, type FilterState } from '../components/catalog/DynamicFilters'
import { SortSelect } from '../components/catalog/SortSelect'
import { FilterToggle } from '../components/catalog/FilterToggle'
import { PaginationControls } from '../components/catalog/PaginationControls'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { EmptyState } from '../components/common/EmptyState'
import { Sheet, SheetHeader, SheetTitle } from '../components/ui/sheet'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { sortProducts } from '../lib/sorting'
import { cn } from '../lib/utils'

interface CategoryViewProps {
  category: Category
  products: Product[]
}

const PRICE_STEP = 10
const ITEMS_PER_PAGE = 8

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

  // Estado de ordenação, paginação, visibilidade no desktop e gaveta móvel
  const [sortBy, setSortBy] = useState<ProductSortOption>('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [isDesktopFiltersVisible, setIsDesktopFiltersVisible] = useState(true)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Reseta a página para 1 quando os filtros mudam
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters({
      brands: [],
      minPrice: minInitialPrice,
      maxPrice: maxInitialPrice,
      stringSpecs: {},
      booleanSpecs: {},
      numberSpecs: {},
    })
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: ProductSortOption) => {
    setSortBy(newSort)
    setCurrentPage(1)
  }

  // Motor de Filtragem e Ordenação Reativa
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // 1. Filtro de Marcas
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      // 2. Filtro de Faixa de Preço (Mínimo e Máximo)
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false
      }

      // 3. Filtro de Especificações do tipo String (Multi-select)
      for (const [key, selectedValues] of Object.entries(filters.stringSpecs)) {
        if (selectedValues.length > 0) {
          const productValue = product.specs[key]
          if (!productValue || !selectedValues.includes(String(productValue))) {
            return false
          }
        }
      }

      // 4. Filtro de Especificações do tipo Boolean (Toggle)
      for (const [key, isChecked] of Object.entries(filters.booleanSpecs)) {
        if (isChecked) {
          const productValue = product.specs[key]
          if (productValue !== true) {
            return false
          }
        }
      }

      // 5. Filtro de Especificações do tipo Number (Range Slider)
      for (const [key, value] of Object.entries(filters.numberSpecs)) {
        const productValue = Number(product.specs[key])
        if (isNaN(productValue) || productValue > value) {
          return false
        }
      }

      return true
    })

    return sortProducts(filtered, sortBy)
  }, [products, filters, sortBy])

  // Paginação dos produtos filtrados
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAndSortedProducts, currentPage])

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
      {/* Breadcrumb de Navegação Estruturada */}
      <Breadcrumb items={[{ label: category.name }]} />

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
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Dropdown de Ordenação Customizado */}
          <SortSelect value={sortBy} onChange={handleSortChange} />

          {/* Botões de Toggle de Filtros Desktop e Mobile */}
          <FilterToggle
            isDesktopVisible={isDesktopFiltersVisible}
            onToggleDesktop={() => setIsDesktopFiltersVisible((prev) => !prev)}
            onOpenMobile={() => setIsMobileFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>

      {/* Layout Principal: Sidebar de Filtros + Grid de Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Desktop (Colapsável com rolagem interna contida) */}
        {isDesktopFiltersVisible && (
          <aside
            aria-label="Filtros da categoria"
            className="hidden lg:block p-5 rounded-xl border border-border bg-card shadow-xs sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-none animate-in fade-in-0 duration-200"
          >
            <DynamicFilters
              category={category}
              products={products}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </aside>
        )}

        {/* Sheet Mobile de Filtros */}
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetHeader>
            <SheetTitle>Filtrar {category.name}</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto pr-2 flex-1 scrollbar-none">
            <DynamicFilters
              category={category}
              products={products}
              filters={filters}
              onFilterChange={handleFilterChange}
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

        {/* Grid de Produtos Pagina e Empty State */}
        <div className={cn('space-y-6', isDesktopFiltersVisible ? 'lg:col-span-3' : 'lg:col-span-4')}>
          {paginatedProducts.length > 0 ? (
            <>
              <div
                className={cn(
                  'grid grid-cols-1 sm:grid-cols-2 gap-5',
                  isDesktopFiltersVisible
                    ? 'md:grid-cols-3'
                    : 'md:grid-cols-3 lg:grid-cols-4'
                )}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Controles de Paginação Abaixo do Grid */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAndSortedProducts.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={(page) => {
                  setCurrentPage(page)
                  window.scrollTo({ top: 0, behavior: 'instant' })
                }}
              />
            </>
          ) : (
            <EmptyState
              title="Nenhum produto encontrado"
              description="Não encontramos itens correspondentes à combinação de filtros selecionados para esta categoria."
              action={
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Redefinir Filtros
                </Button>
              }
            />
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
