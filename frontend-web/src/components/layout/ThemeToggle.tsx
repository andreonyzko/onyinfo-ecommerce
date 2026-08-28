import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../stores'
import { Button } from '../ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
      title={`Alternar tema (atual: ${theme})`}
      aria-label="Alternar tema de cores"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100 text-blue-400" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
