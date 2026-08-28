import { useCartStore } from '../stores'

export function CheckoutPage() {
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Carrinho e Checkout</h1>
      <p className="text-muted-foreground mb-6">
        {totalItems} item(ns) no seu carrinho de compras.
      </p>
    </div>
  )
}
