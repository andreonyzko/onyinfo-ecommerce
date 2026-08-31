import { useState } from 'react'
import { useLoaderData } from 'react-router'
import type { CategoryLoaderData } from '../router/loaders'
import type { Category, Product } from '../types'
import { useCategoryFilters } from '../hooks'
import { ProductCard } from '../components/catalog/ProductCard'
import { DynamicFilters } from '../components/catalog/DynamicFilters'
import { SortSelect } from '../components/catalog/SortSelect'
import { FilterToggle } from '../components/catalog/FilterToggle'
import { PaginationControls } from '../components/catalog/PaginationControls'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { EmptyState } from '../components/common/EmptyState'
import { Sheet, SheetHeader, SheetTitle } from '../components/ui/sheet'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { cn } from '../lib/utils'

interface CategoryViewProps {
  category: Category
  products: Product[]
}

function CategoryView({ category, products }: CategoryViewProps) {
  const {
    filters,
    sortBy,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedProducts,
    filteredAndSortedProducts,
    activeFilterCount,
    setCurrentPage,
    handleFilterChange,
    handleResetFilters,
    handleSortChange,
  } = useCategoryFilters({ category, products })

  const [isDesktopFiltersVisible, setIsDesktopFiltersVisible] = useState(true)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

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
          <SortSelect value={sortBy} onChange={handleSortChange} />
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
        {/* Sidebar Desktop */}
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
                pageSize={itemsPerPage}
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
