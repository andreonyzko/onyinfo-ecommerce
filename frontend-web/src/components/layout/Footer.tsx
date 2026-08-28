import { Link } from 'react-router'
import { Cpu, ShieldCheck, Zap, Video, Code2 } from 'lucide-react'

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
            <Link to="/" className="inline-block">
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
              Plataforma e-commerce estática de alta performance para hardware e
              periféricos, construída sob o conceito de <em>headless commerce</em> em
              miniatura e 100% orientada a dados.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-primary">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> 100% Client-Side
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Data-Driven
              </span>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-foreground font-semibold text-xs tracking-wider uppercase">
              Navegação
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
                <Link to="/checkout" className="hover:text-foreground transition-colors">
                  Carrinho de Compras
                </Link>
              </li>
              <li>
                <Link
                  to="/como-fiz"
                  className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                >
                  <Video className="w-3.5 h-3.5" />
                  Defesa Técnica (/como-fiz)
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Stack Tecnológica */}
          <div className="space-y-3">
            <h4 className="text-foreground font-semibold text-xs tracking-wider uppercase">
              Stack Tecnológica
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                React 19 & TypeScript
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                Vite 8 & React Router
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Tailwind CSS v4 & Shadcn/UI
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Zustand (Persist) & Zod
              </li>
            </ul>
          </div>

          {/* Coluna 4: Desafio & Regras de Negócio */}
          <div className="space-y-3">
            <h4 className="text-foreground font-semibold text-xs tracking-wider uppercase">
              Bootcamp AWS AI FDE
            </h4>
            <p className="text-xs leading-relaxed">
              Entrega do <strong>Desafio 1</strong> com foco em arquitetura
              desacoplada, performance no Lighthouse e simulação de checkout com 5% de
              desconto no PIX.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Desconto de 5% no PIX ativo
              </span>
            </div>
          </div>
        </div>

        {/* Linha inferior de copyright e avisos */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} OnyInfo Hardware. Projeto Acadêmico sem fins lucrativos.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/como-fiz"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Documentação do Projeto</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
