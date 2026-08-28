import { Link } from 'react-router'
import {
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  ShoppingBag,
  CreditCard,
} from 'lucide-react'
import { useCartStore } from '../stores'
import { CartItemCard } from '../components/cart/CartItemCard'
import { Button, buttonVariants } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { cn } from '../lib/utils'

export function CheckoutPage() {
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

  // Estado de Carrinho Vazio
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg space-y-6">
        <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Seu carrinho está vazio</h1>
          <p className="text-sm text-muted-foreground">
            Explore nossa seleção de hardware de alta performance e adicione itens ao seu setup.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'gap-2 font-semibold shadow-md'
            )}
          >
            <span>Explorar Produtos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
              Carrinho de Compras
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Revise os itens selecionados antes de prosseguir para as etapas de entrega e pagamento.
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

      {/* Grid Principal: Lista de Itens com Scroll Interno Pareado + Resumo Financeiro Estático */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Lista de Itens do Carrinho */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-border/80 shadow-xs overflow-hidden">
            <CardHeader className="py-3 px-4 md:px-6 bg-muted/20 border-b border-border">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Produtos ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                <span>Subtotal</span>
              </div>
            </CardHeader>

            {/* Container de Produtos com Scroll Interno no Desktop */}
            <CardContent className="p-0 max-h-[300px] overflow-y-auto divide-y divide-border/60">
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

          {/* Continuidade de Compra */}
          <div className="flex justify-between items-center pt-1">
            <Link
              to="/"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'gap-1.5 text-xs font-semibold'
              )}
            >
              <span>Continuar Comprando</span>
            </Link>
          </div>
        </div>

        {/* Coluna Direita: Resumo Financeiro (Estático na Grade) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-border/80 shadow-md bg-card">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground">
                Resumo do Pedido
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Linhas de Valores */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} itens):</span>
                  <span className="font-semibold text-foreground">
                    {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Desconto PIX (5%):</span>
                  </span>
                  <span>
                    - {discountPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Frete estimado:</span>
                  <span className="italic text-muted-foreground">Calculado na etapa seguinte</span>
                </div>
              </div>

              <Separator />

              {/* Total Final */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-foreground">Total no PIX:</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {totalPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground text-right flex items-center justify-end gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>ou 12x de {installmentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</span>
                </div>
              </div>

              {/* Botão de Avançar */}
              <Button
                size="lg"
                className="w-full font-bold gap-2 text-sm shadow-md cursor-pointer mt-2"
                onClick={() => {
                  // Conectará com a Subtarefa 2
                }}
              >
                <span>Avançar para Identificação</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Selo de Segurança */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Compra 100% segura &bull; Desafio AWS FDE</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
