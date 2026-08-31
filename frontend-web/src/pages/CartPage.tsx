import { Link } from 'react-router'
import { ShoppingCart, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../stores'
import { CartItemCard } from '../components/cart/CartItemCard'
import { CartSummary } from '../components/cart/CartSummary'
import { EmptyState } from '../components/common/EmptyState'
import { Button, buttonVariants } from '../components/ui/button'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { cn } from '../lib/utils'

export function CartPage() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const getDiscount = useCartStore((state) => state.getDiscount)
  const getTotal = useCartStore((state) => state.getTotal)

  const subtotal = getSubtotal()
  const discountPix = getDiscount()
  const totalPix = getTotal()
  const installmentPrice = subtotal / 12
  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0)

  // Estado de Carrinho Vazio
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <EmptyState
          icon={
            <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
          }
          title="Seu carrinho está vazio"
          description="Explore nossa seleção de hardware de alta performance e adicione itens ao seu setup."
          action={
            <Link
              to="/"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'gap-2 font-semibold shadow-md'
              )}
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Cabeçalho do Carrinho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Meu Carrinho
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Revise e ajuste seus produtos antes de prosseguir para o checkout.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-muted-foreground hover:text-destructive gap-1.5 text-xs self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar Carrinho</span>
        </Button>
      </div>

      {/* Grid Principal: Lista de Itens com Scroll Interno Pareado + Resumo Financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Lista de Itens do Carrinho com Rolagem Própria */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-border/80 shadow-xs overflow-hidden">
            <CardHeader className="py-3 px-4 md:px-6 bg-muted/20 border-b border-border">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Produtos ({totalItemsCount})</span>
                <span>Subtotal</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/60 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <CartItemCard
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita: Resumo Financeiro Modularizado */}
        <div className="lg:col-span-4 space-y-4">
          <CartSummary
            totalItemsCount={totalItemsCount}
            subtotal={subtotal}
            discountPix={discountPix}
            totalPix={totalPix}
            installmentPrice={installmentPrice}
          />
        </div>
      </div>
    </div>
  )
}
