import { Link } from 'react-router'
import {
  Video,
  Layers,
  Zap,
  ShieldCheck,
  Cpu,
  Database,
  Globe,
  ArrowRight,
  Code2,
  FileJson,
  Sparkles,
} from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { buttonVariants } from '../components/ui/button'
import { cn } from '../lib/utils'

const BASE_URL = import.meta.env.BASE_URL || '/'

function formatAssetUrl(path: string): string {
  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

export function HowIDidPage() {
  const videoUrl = formatAssetUrl('/video.mp4')

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12 animate-in fade-in-0 duration-300">
      {/* Cabeçalho da Defesa Técnica */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BOOTCAMP AWS AI FDE FOR COMMERCE &bull; DESAFIO 1</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
          Como Fiz: Defesa Técnica &amp; Arquitetura
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Apresentação detalhada da concepção arquitetural da <strong>OnyInfo</strong>, implementada sob o paradigma de <em>Headless Commerce Client-side</em> 100% data-driven e estático.
        </p>
      </div>

      {/* Seção 1: Vídeo de Apresentação Técnica com Player HTML5 Embutido */}
      <Card className="border-border/80 shadow-md bg-card overflow-hidden">
        <CardHeader className="py-3.5 px-4 sm:px-6 bg-muted/20 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Apresentação Técnica em Vídeo
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-border shadow-inner flex items-center justify-center">
            {/* Player HTML5 Embutido consumindo /video.mp4 */}
            <video
              controls
              preload="metadata"
              className="w-full h-full object-contain rounded-xl"
              aria-label="Vídeo de Defesa Técnica da OnyInfo"
            >
              <source src={videoUrl} type="video/mp4" />
              Seu navegador não suporta a reprodução deste vídeo.
            </video>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Gravação explicativa sobre as decisões arquiteturais, consumo headless de dados, roteamento client-side e conformidade com o desafio.
          </p>
        </CardContent>
      </Card>

      {/* Seção 2: Pilares da Arquitetura */}
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-bold text-foreground">
            Decisões Arquiteturais e Engenharia
          </h2>
          <p className="text-xs text-muted-foreground">
            Princípios aplicados para atender com rigor às restrições do Desafio 1.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Headless Commerce Client-side */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FileJson className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    1. Headless &amp; Data-Driven Puro
                  </CardTitle>
                  <span className="text-[11px] text-muted-foreground">Desacoplamento total de dados e interface</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                A aplicação não possui qualquer produto, categoria ou especificação técnica fixada no código HTML/React (<em>zero hardcode</em>).
              </p>
              <p>
                Toda a vitrine é construída dinamicamente consumindo os arquivos estáticos <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">products.json</code> e <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">categories.json</code> através da API <strong className="text-foreground">fetch nativa</strong>, gerando menus, filtros e páginas sob demanda.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Roteamento & Data Loaders */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    2. Roteamento com Data Mode
                  </CardTitle>
                  <span className="text-[11px] text-muted-foreground">React Router v6+ Data API</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Utilização de <strong className="text-foreground">loaders assíncronos</strong> para carregar e validar os dados de cada rota antes da montagem dos componentes visuais.
              </p>
              <p>
                Isso elimina estados intermediários de carregamento com <em>layout shift</em> (CLS) e garante renderização instantânea das categorias (<code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">/categoria/:slug</code>), detalhes de produtos (<code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">/produto/:slug</code>) e busca global (<code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">/busca</code>).
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Estado & Persistência Local */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    3. Persistência 100% Client-Side
                  </CardTitle>
                  <span className="text-[11px] text-muted-foreground">Zustand com Middleware Persist</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Gerenciamento de estado global leve e reativo utilizando <strong className="text-foreground">Zustand</strong>.
              </p>
              <p>
                O estado do carrinho de compras, os dados de perfil do comprador, o histórico do último pedido e as preferências de tema (Light/Dark Mode) persistem no <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">localStorage</code> sem necessidade de servidores de banco de dados ou Node.js em tempo de execução.
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Formulários, Zod & ViaCEP */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    4. Formulários &amp; Integração ViaCEP
                  </CardTitle>
                  <span className="text-[11px] text-muted-foreground">React Hook Form, Zod &amp; Regex Puras</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Validação estrita de contratos de dados através de <strong className="text-foreground">Zod Schemas</strong> acoplados ao React Hook Form.
              </p>
              <p>
                Máscaras de digitação em tempo real (CPF, Telefone e CEP) desenvolvidas com <strong className="text-foreground">Regex puras</strong> (sem bibliotecas externas pesadas). Ao digitar o CEP, a aplicação consulta a API pública do <strong className="text-foreground">ViaCEP</strong> e auto-preenche o endereço.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seção 3: Stack Tecnológica */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-center">
          Stack Tecnológica Empregada
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-primary" /> React 19 + TypeScript
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-xs gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" /> Vite 8 + Fast Refresh
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-xs gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" /> Tailwind CSS v4 + Shadcn/UI
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-xs gap-1.5">
            <Database className="w-3.5 h-3.5 text-primary" /> Zustand (Persist)
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-xs gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-primary" /> React Hook Form + Zod
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-xs gap-1.5">
            <Globe className="w-3.5 h-3.5 text-primary" /> React Router v7 Data Mode
          </Badge>
        </div>
      </div>

      {/* CTA Final */}
      <div className="text-center pt-4">
        <Link
          to="/"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'gap-2 font-bold shadow-md text-xs sm:text-sm'
          )}
        >
          <span>Explorar Catálogo da OnyInfo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
