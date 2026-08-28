import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, disabled, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      onClick?.(e)
      if (!disabled) {
        onCheckedChange?.(!checked)
      }
    }

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "relative inline-flex size-4 shrink-0 items-center justify-center rounded-xs border border-input shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background hover:border-primary/50",
          className
        )}
        {...props}
      >
        {checked && <Check className="size-3 stroke-[3]" />}
      </button>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
