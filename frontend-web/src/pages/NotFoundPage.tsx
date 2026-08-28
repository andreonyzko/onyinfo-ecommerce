import { Link } from 'react-router'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { buttonVariants } from '../components/ui/button'
import { cn } from '../lib/utils'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="p-4 mb-4 rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
        Página não encontrada
      </h1>
      <p className="text-muted-foreground max-w-md mb-6">
        O hardware ou a página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/" className={cn(buttonVariants({ variant: 'default' }), 'gap-2')}>
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Home
      </Link>
    </div>
  )
}
