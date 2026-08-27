import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Theme } from '../types'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

function applyThemeToDocument(theme: Theme): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'

  const root = document.documentElement
  const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const isDark =
    theme === 'dark' || (theme === 'system' && systemPrefersDark)

  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  return isDark ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',

      setTheme: (theme: Theme) => {
        const resolved = applyThemeToDocument(theme)
        set({ theme, resolvedTheme: resolved })
      },

      toggleTheme: () => {
        const current = get().theme
        const nextTheme: Theme = current === 'dark' ? 'light' : 'dark'
        const resolved = applyThemeToDocument(nextTheme)
        set({ theme: nextTheme, resolvedTheme: resolved })
      },
    }),
    {
      name: 'onyinfo-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.resolvedTheme = applyThemeToDocument(state.theme)
        }
      },
    }
  )
)
