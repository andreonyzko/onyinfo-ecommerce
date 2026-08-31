import { Cpu } from 'lucide-react'
import type { Category, Product } from '../../types'

interface ProductSpecsTableProps {
  product: Product
  category?: Category
}

export function ProductSpecsTable({ product, category }: ProductSpecsTableProps) {
  const specsEntries = Object.entries(product.specs || {})

  return (
    <section className="space-y-4 pt-6 border-t border-border">
      <div className="flex items-center gap-2">
        <Cpu className="w-5 h-5 text-primary" />
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Especificações Técnicas
        </h2>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <tbody className="divide-y divide-border/60">
            {/* Marca / Fabricante */}
            <tr className="hover:bg-muted/20 transition-colors">
              <td className="w-1/3 py-3 px-4 font-semibold text-muted-foreground bg-muted/10">
                Fabricante / Marca
              </td>
              <td className="w-2/3 py-3 px-4 text-foreground font-medium">
                {product.brand}
              </td>
            </tr>

            {/* Departamento / Categoria */}
            {category && (
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="w-1/3 py-3 px-4 font-semibold text-muted-foreground bg-muted/10">
                  Departamento
                </td>
                <td className="w-2/3 py-3 px-4 text-foreground font-medium">
                  {category.name}
                </td>
              </tr>
            )}

            {/* Especificações Dinâmicas de product.specs */}
            {specsEntries.map(([key, value]) => {
              const label = category?.specs?.[key] || key.toUpperCase()

              let displayValue = String(value)
              if (typeof value === 'boolean') {
                displayValue = value ? 'Sim' : 'Não'
              }

              return (
                <tr key={key} className="hover:bg-muted/20 transition-colors">
                  <td className="w-1/3 py-3 px-4 font-semibold text-muted-foreground bg-muted/10">
                    {label}
                  </td>
                  <td className="w-2/3 py-3 px-4 text-foreground font-medium">
                    {displayValue}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
