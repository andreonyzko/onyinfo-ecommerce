import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Slider } from '../ui/slider'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

export type SpecType = 'string' | 'number' | 'boolean'

export interface SpecMetadata {
  key: string
  label: string
  type: SpecType
  options?: { value: string; count: number }[]
  min?: number
  max?: number
}

interface SpecFilterItemProps {
  spec: SpecMetadata
  selectedStringValues?: string[]
  isBooleanChecked?: boolean
  selectedNumberValue?: number
  onStringToggle: (key: string, value: string) => void
  onBooleanToggle: (key: string) => void
  onNumberChange: (key: string, value: number) => void
}

export function SpecFilterItem({
  spec,
  selectedStringValues = [],
  isBooleanChecked = false,
  selectedNumberValue,
  onStringToggle,
  onBooleanToggle,
  onNumberChange,
}: SpecFilterItemProps) {
  return (
    <div className="space-y-3 pt-2">
      <Separator className="mb-4" />
      <Label className="font-semibold text-xs text-foreground uppercase tracking-wider block">
        {spec.label}
      </Label>

      {/* Tipo STRING: Renderiza Lista de Checkboxes */}
      {spec.type === 'string' && spec.options && (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-none">
          {spec.options.map(({ value, count }) => {
            const isChecked = selectedStringValues.includes(value)
            return (
              <div
                key={value}
                onClick={() => onStringToggle(spec.key, value)}
                className="w-full flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onStringToggle(spec.key, value)}
                  />
                  <span
                    className={
                      isChecked
                        ? 'font-semibold text-foreground text-xs'
                        : 'text-xs group-hover:text-foreground'
                    }
                  >
                    {value}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                  {count}
                </Badge>
              </div>
            )
          })}
        </div>
      )}

      {/* Tipo NUMBER: Renderiza Range Slider */}
      {spec.type === 'number' && spec.min !== undefined && spec.max !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Valor Máximo:</span>
            <span className="font-bold text-primary">
              {selectedNumberValue !== undefined ? selectedNumberValue : spec.max}
            </span>
          </div>
          <Slider
            min={spec.min}
            max={spec.max}
            step={1}
            value={selectedNumberValue ?? spec.max}
            onValueChange={(val) => onNumberChange(spec.key, val)}
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Min: {spec.min}</span>
            <span>Max: {spec.max}</span>
          </div>
        </div>
      )}

      {/* Tipo BOOLEAN: Renderiza Checkbox Simples */}
      {spec.type === 'boolean' && (
        <div
          onClick={() => onBooleanToggle(spec.key)}
          className="w-full flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors cursor-pointer text-left group"
        >
          <Checkbox
            checked={isBooleanChecked}
            onCheckedChange={() => onBooleanToggle(spec.key)}
          />
          <span
            className={
              isBooleanChecked
                ? 'font-semibold text-foreground text-xs'
                : 'text-xs group-hover:text-foreground'
            }
          >
            Apenas com {spec.label}
          </span>
        </div>
      )}
    </div>
  )
}
