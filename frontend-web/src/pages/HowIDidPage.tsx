import { Link } from 'react-router'
import {
  Video,
  Zap,
  ShieldCheck,
  Database,
  Globe,
  ArrowRight,
  Code2,
  FileJson,
  Sparkles,
  Bot,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Server,
  Gauge,
  User,
  GraduationCap,
  Sparkle,
  Network,
  Lock,
  ShoppingCart,
  SlidersHorizontal,
  Moon,
  Smartphone,
  Eye,
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
  const videoUrl =
    'https://ocjiabowhpnoupjjsypi.supabase.co/storage/v1/object/public/videos/air-aws-ai-fde-presentation.mp4'
  const architectureDiagramUrl = formatAssetUrl('/architecture-diagram.png')

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12 animate-in fade-in-0 duration-300">
      {/* 1. Cabeçalho & Autor */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BOOTCAMP AWS AI FDE FOR COMMERCE &bull; DESAFIO 1</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
          Como Fiz: Defesa Técnica &amp; Arquitetura
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Documentação completa sobre as decisões de engenharia, arquitetura estática <em>Headless</em>,
          infraestrutura em nuvem na AWS e visão de futuro com Inteligência Artificial.
        </p>

        {/* Card do Autor */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border shadow-xs text-left">
            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-sm font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
                <span>André Onyszko</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  21 anos
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                <span>Estudante de Engenharia de Software &bull; UTFPR (Campus Dois Vizinhos)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Player de Vídeo da Apresentação Técnica */}
      <Card className="border-border/80 shadow-md bg-card overflow-hidden">
        <CardHeader className="py-3.5 px-4 sm:px-6 bg-muted/20 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Apresentação Técnica em Vídeo
            </CardTitle>
          </div>
          <Badge variant="success" className="text-[11px] font-semibold">
            Vídeo Oficial
          </Badge>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-border shadow-inner flex items-center justify-center">
            <video
              controls
              preload="metadata"
              className="w-full h-full object-contain rounded-xl"
              aria-label="Vídeo de Apresentação Técnica da OnyInfo"
            >
              <source src={videoUrl} type="video/mp4" />
              Seu navegador não suporta a reprodução de vídeos HTML5.
            </video>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Vídeo demonstrativo abordando o fluxo de navegação, catálogo data-driven, checkout simulado, decisões de código limpo e plano de escalabilidade na AWS.
          </p>
        </CardContent>
      </Card>

      {/* 3. Contextualização do Desafio */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border bg-muted/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkle className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-bold text-foreground">
              Contexto do Desafio
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5 text-xs sm:text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            O <strong>Desafio 1 do Bootcamp AWS AI FDE for Commerce</strong> propõe a criação de um e-commerce de hardware de alto desempenho concebido sob o modelo de <strong>Headless Commerce em miniatura</strong>, operando de forma <strong className="text-foreground">100% client-side e estática</strong>.
          </p>
          <p>
            A premissa central é eliminar qualquer dependência de servidores de back-end em tempo de execução (como <code className="text-foreground font-mono bg-muted px-1.5 py-0.5 rounded text-xs">json-server</code> ou APIs Node.js dedicadas), consumindo os dados do catálogo diretamente de arquivos JSON estáticos e garantindo persistência no navegador, fidelidade visual de alto padrão e pontuação máxima nas diretrizes do <strong>Google Lighthouse</strong>.
          </p>
        </CardContent>
      </Card>

      {/* 4. Pontuação no Lighthouse */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Auditoria Google Lighthouse
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Métricas de excelência auditadas com foco em experiência do usuário e Core Web Vitals.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-border/80 bg-card p-4 text-center space-y-1 shadow-xs hover:border-emerald-500/50 transition-colors">
            <div className="text-3xl sm:text-4xl font-black text-emerald-500 font-mono">100</div>
            <div className="text-xs font-bold text-foreground">SEO</div>
            <p className="text-[11px] text-muted-foreground">Metatags completas &amp; OpenGraph</p>
          </Card>

          <Card className="border-border/80 bg-card p-4 text-center space-y-1 shadow-xs hover:border-emerald-500/50 transition-colors">
            <div className="text-3xl sm:text-4xl font-black text-emerald-500 font-mono">100</div>
            <div className="text-xs font-bold text-foreground">Performance</div>
            <p className="text-[11px] text-muted-foreground">FCP 0.5s &bull; LCP 0.6s &bull; TBT 0ms</p>
          </Card>

          <Card className="border-border/80 bg-card p-4 text-center space-y-1 shadow-xs hover:border-emerald-500/50 transition-colors">
            <div className="text-3xl sm:text-4xl font-black text-emerald-500 font-mono">100</div>
            <div className="text-xs font-bold text-foreground">Acessibilidade</div>
            <p className="text-[11px] text-muted-foreground">Contraste, ARIA &amp; navegação teclado</p>
          </Card>

          <Card className="border-border/80 bg-card p-4 text-center space-y-1 shadow-xs hover:border-emerald-500/50 transition-colors">
            <div className="text-3xl sm:text-4xl font-black text-emerald-500 font-mono">96</div>
            <div className="text-xs font-bold text-foreground">Boas Práticas</div>
            <p className="text-[11px] text-muted-foreground">Segurança HTTPS &amp; modern web standards</p>
          </Card>
        </div>
      </div>

      {/* 5. Features do Projeto */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Funcionalidades Implementadas (Features)
          </h2>
          <p className="text-xs text-muted-foreground">
            Uma jornada de compras completa e refinada em cada detalhe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Home Page Comercial</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hero com value propositions, vitrines com rolagem horizontal contínua por departamento e cortes centralizados via loaders.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Páginas de Categoria &amp; Filtros</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Filtros laterais <em>data-driven</em> automáticos por strings (checkboxes), números (sliders), booleanos, fabricantes e faixas de preço.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Eye className="w-4 h-4" />
              <span>Página de Produto (PDP)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Galeria interativa com zoom lightbox em tela cheia com atalhos de teclado, tabela dinâmica de especificações e simulação de frete.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <ShoppingCart className="w-4 h-4" />
              <span>Carrinho Reativo</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gerenciamento de itens com controle de quantidades, remoção individual, limpeza total, cálculo de 5% de desconto no PIX e parcelamento em 12x.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>Checkout Multi-Step</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Identificação com máscaras Regex, consulta automática de endereço via ViaCEP com travamento inteligente, e pagamento PIX (QR Code) ou Cartão.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Meus Pedidos &amp; Detalhes</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Histórico de compras persistido em <code className="text-[11px] font-mono">/meus-pedidos</code> e visualização detalhada em <code className="text-[11px] font-mono">/pedido/:id</code> com impressão.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Moon className="w-4 h-4" />
              <span>Dark / Light Mode</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Alternância instantânea de temas com persistência da preferência do usuário e adaptação de logos e contrastes em toda a aplicação.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Smartphone className="w-4 h-4" />
              <span>100% Responsivo (Mobile-First)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gavetas de filtros móveis via Sheet, navbar com rolagem suave por toque e navegação adaptada para qualquer dispositivo.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Globe className="w-4 h-4" />
              <span>Busca Global Instantânea</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pesquisa rápida em todo o catálogo por nome, marca ou categoria com filtros compostos integrados ao React Router loader.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Stack Tecnológica & Clean Code */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Stack Tecnológica &amp; Clean Code
          </h2>
          <p className="text-xs text-muted-foreground">
            Arquitetura moderna, separação rígida de camadas e zero dependências redundantes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Code2 className="w-4 h-4" />
                <span>Bibliotecas e Tecnologias Core</span>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2.5 leading-relaxed">
              <ul className="space-y-2 list-disc list-inside">
                <li><strong className="text-foreground">Core:</strong> React 19 + TypeScript + Vite 8.</li>
                <li><strong className="text-foreground">Roteamento:</strong> React Router DOM v7 operando em <em>Data Mode</em> com loaders puros.</li>
                <li><strong className="text-foreground">Estilização:</strong> Tailwind CSS v4 + componentes modulares Shadcn/UI + Lucide Icons.</li>
                <li><strong className="text-foreground">Estado Global:</strong> Zustand com middleware <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">persist</code> sincronizado no <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">localStorage</code>.</li>
                <li><strong className="text-foreground">Formulários &amp; Schemas:</strong> React Hook Form com validação estrita via Zod.</li>
                <li><strong className="text-foreground">Máscaras:</strong> Regex puras sem bibliotecas pesadas de terceiros.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Princípios de Clean Code Aplicados</span>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2.5 leading-relaxed">
              <ul className="space-y-2 list-disc list-inside">
                <li><strong className="text-foreground">Custom Hooks Especializados:</strong> Isolamento de regras de negócio em <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">useViaCep</code>, <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">useHorizontalScroll</code> e <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">useCategoryFilters</code>.</li>
                <li><strong className="text-foreground">Componentização Profunda:</strong> Desacoplamento de páginas em subcomponentes atômicos com arquivos enxutos (média &lt; 100 linhas).</li>
                <li><strong className="text-foreground">Lighthouse First:</strong> Zero uso de Axios ou Lodash, priorizando a API nativa <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">fetch</code> e imports tipados.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 7. Headless Commerce & Maior Dificuldade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <FileJson className="w-4 h-4" />
              <span>Conceito de Headless Commerce</span>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
            <p>
              O projeto foi concebido sob o modelo de <strong>Headless Commerce em miniatura</strong>: a camada de apresentação (React) é 100% desacoplada dos dados.
            </p>
            <p>
              Nenhum produto, categoria ou filtro técnico é escrito fixo no HTML (<em>zero hardcode</em>). O front-end consome arquivos JSON estáticos através de requisições <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">fetch</code> nos loaders, permitindo que a fonte de dados seja substituída por qualquer API ou CMS sem reescrever a interface.
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Maior Dificuldade do Projeto</span>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
            <p className="font-semibold text-foreground">
              Arquitetar uma experiência completa de e-commerce sem possuir um back-end real.
            </p>
            <p>
              O grande desafio foi construir um fluxo rico e transacional — incluindo busca global com filtros compostos, cálculo dinâmico de frete, preenchimento de endereço via API pública, checkout multi-step e histórico de pedidos — de forma <strong>100% client-side</strong>, mantendo persistência no <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">localStorage</code>, performance instantânea e zero inconsistência de dados.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 8. Futura Implementação de IA: PC Builder AI */}
      <Card className="border-primary/40 bg-linear-to-b from-primary/5 via-card to-card shadow-md">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Visão de Futuro: Sistema Inteligente de Recomendação de Setups (IA)
                </CardTitle>
                <span className="text-xs text-muted-foreground">Assistente Generativo para Montagem de Computadores Personalizados</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold">
              Roadmap AI
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 text-xs sm:text-sm text-muted-foreground space-y-4 leading-relaxed">
          <p>
            A próxima evolução da <strong>OnyInfo</strong> será a integração de um <strong className="text-foreground">Assistente de IA Especialista em Hardware</strong> integrado diretamente à vitrine da loja:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
              <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">1</span>
                <span>Coleta Interativa de Perfil</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                O usuário responde a um formulário guiado ou conversa com a IA informando finalidade de uso (jogos, edição 3D, programação), títulos específicos que deseja jogar, orçamento disponível, expectativa de upgrades futuros e marcas preferidas.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
              <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">2</span>
                <span>Cruzamento &amp; Compatibilidade</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                O modelo de IA cruza as especificações do catálogo da OnyInfo, valida restrições técnicas (soquetes de processador, dimensões de GPU, potência da fonte de alimentação) e balanceia o melhor custo-benefício.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
              <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">3</span>
                <span>Build Completa &amp; 1-Click Cart</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                A IA entrega a configuração ideal com justificativas técnicas de cada escolha, valor consolidado com desconto no PIX e um botão para adicionar todos os produtos compatíveis diretamente ao carrinho de compras.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. Plano de Deploy na AWS */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Plano de Deploy &amp; Arquitetura na AWS
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Hospedagem estática, distribuição global de borda e alta disponibilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/80 bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Database className="w-4 h-4" />
              <span>1. Amazon S3 (Origin Bucket)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bucket configurado para hospedagem estática segura, armazenando os artefatos compilados (<code className="text-[11px] font-mono">index.html</code>, JS, CSS, fontes e os JSONs de dados).
            </p>
          </Card>

          <Card className="border-border/80 bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Globe className="w-4 h-4" />
              <span>2. AWS CloudFront (CDN)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Distribuição global responsável por entregar o site com certificado SSL/HTTPS automático, compressão Brotli e roteamento inteligente com baixa latência.
            </p>
          </Card>

          <Card className="border-border/80 bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Server className="w-4 h-4" />
              <span>3. Amazon Route 53 (DNS)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gerenciamento de DNS com registros de Alias altamente disponíveis, apontando o domínio customizado da OnyInfo diretamente para a distribuição CloudFront.
            </p>
          </Card>
        </div>
      </div>

      {/* 10. Diagrama de Arquitetura & BFF */}
      <Card className="border-border/80 shadow-md bg-card overflow-hidden">
        <CardHeader className="py-3.5 px-4 sm:px-6 bg-muted/20 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Diagrama de Arquitetura de Nuvem (BFF &amp; Microsserviços)
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="rounded-xl border border-border/80 overflow-hidden bg-background/50 flex items-center justify-center p-2">
            <img
              src={architectureDiagramUrl}
              alt="Diagrama de Arquitetura OnyInfo na AWS"
              loading="lazy"
              decoding="async"
              className="max-h-96 w-auto object-contain drop-shadow-sm rounded-lg"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Representação da infraestrutura em nuvem: CloudFront e S3 na camada de borda estática, integrando com um padrão Backend for Frontend (BFF) em microsserviços para orquestração de pedidos, frete e catálogos dinâmicos.
          </p>
        </CardContent>
      </Card>

      {/* 11. Como o Cache da AWS Sustentaria 10 Mil Requisições Simultâneas */}
      <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-xs">
        <CardHeader className="pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-bold text-foreground">
              Como o Cache da AWS Sustentaria 10.000 Requisições Simultâneas
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5 text-xs sm:text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            O segredo para absorver picos massivos de tráfego (10.000+ requisições concorrentes) com latência abaixo de 20ms e custo de infraestrutura quase nulo está na estratégia de <strong className="text-foreground">Cache Regional em Edge Locations do AWS CloudFront</strong>:
          </p>
          <div className="space-y-2.5 pt-1">
            <div className="p-3 rounded-lg bg-background border border-border/80 space-y-1">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                1ª Requisição (Cache Miss Regional):
              </span>
              <p className="text-xs text-muted-foreground">
                Quando o primeiro usuário de uma determinada região geográfica acessa a OnyInfo, o CloudFront busca os arquivos originais compilados no bucket do <strong>Amazon S3</strong> e armazena uma cópia em cache no <strong>Edge Location (Ponto de Presença)</strong> mais próximo geograficamente daquele usuário.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-background border border-border/80 space-y-1">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Próximas 9.999 Requisições Simultâneas (Cache Hit na Borda):
              </span>
              <p className="text-xs text-muted-foreground">
                Para todos os acessos seguintes, a AWS entrega os arquivos diretamente a partir da memória do Edge Location mais perto do cliente. O bucket S3 <strong>permanece 100% intocado</strong>, sem sofrer qualquer concorrência de I/O ou gargalo de conexão, sustentando picos massivos de tráfego com estabilidade absoluta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
