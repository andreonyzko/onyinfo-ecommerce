import * as React from "react"
import { cn } from "@/lib/utils"

export interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  className?: string
}

export function RangeSlider({
  min,
  max,
  step = 10,
  value,
  onValueChange,
  className,
}: RangeSliderProps) {
  const [minVal, maxVal] = value

  const minPercent = max > min ? Math.max(0, Math.min(100, ((minVal - min) / (max - min)) * 100)) : 0
  const maxPercent = max > min ? Math.max(0, Math.min(100, ((maxVal - min) / (max - min)) * 100)) : 100

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value)
    // Se estiver no limite inferior, força o min exato
    const nextMin = raw <= min + step ? min : Math.min(raw, maxVal)
    onValueChange([nextMin, maxVal])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value)
    // Se estiver no limite superior, força o max exato
    const nextMax = raw >= max - step ? max : Math.max(raw, minVal)
    onValueChange([minVal, nextMax])
  }

  return (
    <div className={cn("relative w-full py-4 select-none touch-none", className)}>
      {/* Barra de Fundo */}
      <div className="h-2 w-full rounded-full bg-muted relative">
        {/* Barra Ativa entre o Mínimo e o Máximo */}
        <div
          className="absolute h-2 rounded-full bg-primary transition-all duration-75"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />
      </div>

      {/* Slider do Valor Mínimo */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        aria-label="Preço mínimo"
        className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none z-20 focus-visible:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
      />

      {/* Slider do Valor Máximo */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        aria-label="Preço máximo"
        className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none z-30 focus-visible:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
      />
    </div>
  )
}
