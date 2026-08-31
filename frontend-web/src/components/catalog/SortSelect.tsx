import { ArrowUpDown } from 'lucide-react'
import type { ProductSortOption } from '../../types'
import { CustomSelect } from '../ui/select'
import { SORT_OPTIONS } from '../../lib/sorting'
import { cn } from '../../lib/utils'

interface SortSelectProps {
  value: ProductSortOption
  onChange: (value: ProductSortOption) => void
  className?: string
}

export function SortSelect({ value, onChange, className }: SortSelectProps) {
  return (
    <CustomSelect<ProductSortOption>
      value={value}
      options={SORT_OPTIONS}
      onChange={onChange}
      icon={<ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground mr-1" />}
      className={cn('w-48 sm:w-52 shrink-0', className)}
    />
  )
}
