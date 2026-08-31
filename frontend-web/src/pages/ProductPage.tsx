import { useState } from 'react'
import { useLoaderData, useNavigate, Link } from 'react-router'
import {
  ChevronRight,
  ShoppingCart,
  Zap,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  PackageCheck,
  CreditCard,
} from 'lucide-react'
import type { ProductLoaderData } from '../router/loaders'
import { useCartStore } from '../stores'
import { ProductCard } from '../components/catalog/ProductCard'
import { ProductGallery } from '../components/catalog/ProductGallery'
import { ProductSpecsTable } from '../components/catalog/ProductSpecsTable'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { Button, buttonVariants } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { formatCurrency } from '../lib/masks'
import { cn } from '../lib/utils'

export function ProductPage() {
  const { product, category, relatedProducts } = useLoaderData() as ProductLoaderData
  const addItem = useCartStore((state) => state.addItem)
  const navigate = useNavigate()

  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const pixPrice = product.price * 0.95
  const installmentPrice = product.price / 12
  const sku = `ONY-${product.id.padStart(4, '0')}`

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    navigate('/carrinho')
  }

  const breadcrumbItems = category
    ? [{ label: category.name, href: `/categoria/${category.slug}` }, { label: product.name }]
    : [{ label: product.name }]

  return (
    <div className="container mx-auto px-4 py-6 space-y-12">
      {/* Breadcrumb de Navegação Estruturada */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Grid Principal: Galeria de Imagens + Detalhes de Compra */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Coluna Esquerda: Galeria com Miniaturas Verticais */}
        <div className="lg:col-span-6 space-y-5">
          <ProductGallery product={product} category={category} />

          {/* Selos de Confiança e Benefícios */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-border bg-card/50 text-center space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-primary" />
              <div className="text-[11px] font-bold text-foreground">Garantia Nacional</div>
              <p className="text-[10px] text-muted-foreground">12 meses direto de fábrica</p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card/50 text-center space-y-1">
              <Truck className="w-4 h-4 mx-auto text-blue-500" />
              <div className="text-[11px] font-bold text-foreground">Envio Expresso</div>
              <p className="text-[10px] text-muted-foreground">Rastreio em tempo real</p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card/50 text-center space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-emerald-500" />
              <div className="text-[11px] font-bold text-foreground">7 Dias p/ Troca</div>
              <p className="text-[10px] text-muted-foreground">Devolução garantida</p>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Preços, Estoque e CTA */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                Cód: <span className="font-semibold text-foreground">{sku}</span>
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <PackageCheck className="w-4 h-4" />
                <span>Disponível em Estoque</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
              {product.name}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Card de Preços e Condições de Pagamento */}
          <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
            {/* Preço no PIX */}
            <div>
              <div className="text-xs text-muted-foreground">
                Preço à vista com <span className="font-bold text-emerald-600 dark:text-emerald-400">5% de desconto</span> no PIX:
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  R$
                </span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {pixPrice.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Preço Parcelado no Cartão */}
            <div className="pt-3 border-t border-primary/10 flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="w-4 h-4 text-primary shrink-0" />
              <div>
                Ou <span className="font-semibold text-foreground">{formatCurrency(product.price)}</span> em até{' '}
                <span className="font-bold text-foreground">12x de {formatCurrency(installmentPrice)}</span> sem juros no cartão
              </div>
            </div>
          </div>

          {/* Controles de Quantidade e Ação */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Seletor de Quantidade */}
              <div className="flex items-center border border-input rounded-md bg-card shadow-xs">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer transition-colors"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= 10}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer transition-colors"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Botão Adicionar ao Carrinho */}
              <Button
                variant={isAdded ? 'secondary' : 'outline'}
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 font-semibold gap-2 cursor-pointer transition-all duration-200"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Adicionado ({quantity})!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Adicionar ao Carrinho</span>
                  </>
                )}
              </Button>
            </div>

            {/* Botão Comprar Agora */}
            <Button
              size="lg"
              onClick={handleBuyNow}
              className="w-full font-bold gap-2 text-base cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Comprar Agora</span>
            </Button>
          </div>

          {/* Informações Extras de Frete e Entrega */}
          <div className="p-3.5 rounded-lg border border-border bg-card/40 flex items-center gap-3 text-xs text-muted-foreground">
            <Truck className="w-4 h-4 text-primary shrink-0" />
            <span>
              Calcule o frete e visualize as opções de entrega diretamente no checkout.
            </span>
          </div>
        </div>
      </div>

      {/* Tabela Completa de Especificações Técnicas */}
      <ProductSpecsTable product={product} category={category} />

      {/* Produtos Relacionados da Mesma Categoria */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Quem viu este produto também comprou
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Outras opções recomendadas em {category?.name || 'nossa loja'}
              </p>
            </div>

            {category && (
              <Link
                to={`/categoria/${category.slug}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'gap-1 text-primary text-xs font-semibold'
                )}
              >
                <span>Ver mais</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
