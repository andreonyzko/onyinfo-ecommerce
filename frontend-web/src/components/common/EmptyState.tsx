import { type ReactNode } from 'react'
import { PackageOpen } from 'lucide-react'
import { cn } from '../../lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon = <PackageOpen className="w-12 h-12 text-muted-foreground/60 mb-3" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-xl bg-card/40 animate-in fade-in-0 duration-200',
        className
      )}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <h3 className="font-bold text-lg text-foreground mt-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground max-w-sm mt-1.5 mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
