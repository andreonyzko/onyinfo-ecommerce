import { useEffect } from 'react'
import { Outlet, useLoaderData, useNavigation } from 'react-router'
import { useThemeStore } from '../../stores'
import type { RootLoaderData } from '../../router/loaders'
import { Header } from './Header'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'

export function RootLayout() {
  const { categories } = useLoaderData() as RootLoaderData
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    // Garante sincronização da classe dark no elemento raiz ao montar
    const root = document.documentElement
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = theme === 'dark' || (theme === 'system' && systemDark)

    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200 antialiased selection:bg-primary/20">
      {/* Scroll restoration automático para o topo em cada transição de rota */}
      <ScrollToTop />

      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20 overflow-hidden">
          <div className="h-full bg-primary animate-pulse w-1/3" />
        </div>
      )}

      {/* Header com busca global, logo responsiva, theme toggle e carrinho */}
      <Header />

      {/* Navbar com links dinâmicos das categorias a partir do categories.json */}
      <Navbar categories={categories} />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1">
        <Outlet context={{ categories }} />
      </main>

      {/* Rodapé institucional com links de navegação e defesa técnica */}
      <Footer />
    </div>
  )
}
