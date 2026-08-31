import { Link } from 'react-router'
import { Cpu, ShieldCheck, Zap, Truck, CreditCard, Package } from 'lucide-react'

const BASE_URL = import.meta.env.BASE_URL || '/'

function formatAssetUrl(path: string): string {
  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 text-muted-foreground text-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Coluna 1: Marca e Conceito */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block" aria-label="OnyInfo Hardware">
              <img
                src={formatAssetUrl('/onyinfo-white.png')}
                alt="OnyInfo"
                className="h-7 w-auto hidden dark:block"
              />
              <img
                src={formatAssetUrl('/onyinfo-black.png')}
                alt="OnyInfo"
                className="h-7 w-auto block dark:hidden"
              />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sua loja especializada em hardware de alta performance, componentes e
              periféricos gamer. As melhores marcas com garantia oficial e entrega rápida em todo o Brasil.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-primary">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Compra Segura
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> 100% Original
              </span>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="space-y-3">
            <h4 className="text-foreground font-semibold text-xs tracking-wider uppercase">
              Departamentos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/busca" className="hover:text-foreground transition-colors">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link to="/meus-pedidos" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <Package className="w-3 h-3 text-primary" />
                  <span>Meus Pedidos</span>
                </Link>
              </li>
              <li>
                <Link to="/carrinho" className="hover:text-foreground transition-colors">
                  Meu Carrinho
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Formas de Pagamento & Benefícios */}
          <div className="space-y-3">
            <h4 className="text-foreground font-semibold text-xs tracking-wider uppercase">
              Pagamento &amp; Envio
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>5% de desconto à vista no PIX</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                <span>Até 12x sem juros no cartão</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                <span>PAC, SEDEX e Retirada Expressa</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Segurança & Atendimento */}
          <div className="space-y-3">
            <h4 className="text-foreground font-semibold text-xs tracking-wider uppercase">
              Segurança &amp; Garantia
            </h4>
            <p className="text-xs leading-relaxed">
              Todos os produtos comercializados possuem garantia direta do fabricante e nota fiscal eletrônica.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ambiente 100% Protegido via SSL
              </span>
            </div>
          </div>
        </div>

        {/* Linha inferior de copyright e termos */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} OnyInfo Hardware. Todos os direitos reservados.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Privacidade &amp; Termos</span>
            <span>&bull;</span>
            <span>Atendimento ao Cliente</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
