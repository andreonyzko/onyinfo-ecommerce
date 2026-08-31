import { MapPin, Building, Home, CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { AddressFormData } from '../../lib/schemas'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'

interface AddressFormFieldsProps {
  register: UseFormRegister<AddressFormData>
  errors: FieldErrors<AddressFormData>
  isLoadingCep: boolean
  cepStatus: 'idle' | 'success' | 'error'
  cepErrorMessage: string
  isAddressLocked: boolean
  onCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFieldChange: (field: keyof AddressFormData, value: string) => void
}

export function AddressFormFields({
  register,
  errors,
  isLoadingCep,
  cepStatus,
  cepErrorMessage,
  isAddressLocked,
  onCepChange,
  onFieldChange,
}: AddressFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
      {/* CEP */}
      <div className="sm:col-span-4 space-y-1.5">
        <Label htmlFor="cep" className="text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span>CEP *</span>
          </span>
          {isLoadingCep && (
            <span className="flex items-center gap-1 text-[11px] text-primary font-normal">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Buscando endereço...</span>
            </span>
          )}
        </Label>
        <div className="relative">
          <Input
            id="cep"
            placeholder="00000-000"
            maxLength={9}
            {...register('cep', {
              onChange: onCepChange,
            })}
            className={errors.cep ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {cepStatus === 'success' && !isLoadingCep && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-2.5 pointer-events-none" />
          )}
        </div>
        {errors.cep && (
          <p className="text-[11px] text-destructive font-medium">{errors.cep.message}</p>
        )}
        {cepStatus === 'error' && (
          <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{cepErrorMessage}</span>
          </p>
        )}
      </div>

      {/* Estado / UF */}
      <div className="sm:col-span-3 space-y-1.5">
        <Label htmlFor="state" className="text-xs font-semibold flex items-center justify-between">
          <span>Estado (UF) *</span>
          {isAddressLocked && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
              <Lock className="w-3 h-3" />
              <span>Auto</span>
            </span>
          )}
        </Label>
        <Input
          id="state"
          placeholder="Ex: SP"
          maxLength={2}
          readOnly={isAddressLocked}
          {...register('state', {
            onChange: (e) => onFieldChange('state', e.target.value.toUpperCase()),
          })}
          className={cn(
            errors.state && 'border-destructive focus-visible:ring-destructive',
            isAddressLocked && 'bg-muted/40 text-muted-foreground cursor-not-allowed select-none'
          )}
        />
        {errors.state && (
          <p className="text-[11px] text-destructive font-medium">{errors.state.message}</p>
        )}
      </div>

      {/* Logradouro / Rua */}
      <div className="sm:col-span-5 space-y-1.5">
        <Label htmlFor="street" className="text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Logradouro / Rua *</span>
          </span>
          {isAddressLocked && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
              <Lock className="w-3 h-3" />
              <span>Auto</span>
            </span>
          )}
        </Label>
        <Input
          id="street"
          placeholder="Ex: Av. Paulista"
          readOnly={isAddressLocked}
          {...register('street', {
            onChange: (e) => onFieldChange('street', e.target.value),
          })}
          className={cn(
            errors.street && 'border-destructive focus-visible:ring-destructive',
            isAddressLocked && 'bg-muted/40 text-muted-foreground cursor-not-allowed select-none'
          )}
        />
        {errors.street && (
          <p className="text-[11px] text-destructive font-medium">{errors.street.message}</p>
        )}
      </div>

      {/* Número */}
      <div className="sm:col-span-3 space-y-1.5">
        <Label htmlFor="number" className="text-xs font-semibold">
          Número *
        </Label>
        <Input
          id="number"
          placeholder="Ex: 1000"
          {...register('number', {
            onChange: (e) => onFieldChange('number', e.target.value),
          })}
          className={errors.number ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.number && (
          <p className="text-[11px] text-destructive font-medium">{errors.number.message}</p>
        )}
      </div>

      {/* Bairro */}
      <div className="sm:col-span-4 space-y-1.5">
        <Label htmlFor="neighborhood" className="text-xs font-semibold flex items-center justify-between">
          <span>Bairro *</span>
          {isAddressLocked && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
              <Lock className="w-3 h-3" />
              <span>Auto</span>
            </span>
          )}
        </Label>
        <Input
          id="neighborhood"
          placeholder="Ex: Bela Vista"
          readOnly={isAddressLocked}
          {...register('neighborhood', {
            onChange: (e) => onFieldChange('neighborhood', e.target.value),
          })}
          className={cn(
            errors.neighborhood && 'border-destructive focus-visible:ring-destructive',
            isAddressLocked && 'bg-muted/40 text-muted-foreground cursor-not-allowed select-none'
          )}
        />
        {errors.neighborhood && (
          <p className="text-[11px] text-destructive font-medium">{errors.neighborhood.message}</p>
        )}
      </div>

      {/* Cidade */}
      <div className="sm:col-span-5 space-y-1.5">
        <Label htmlFor="city" className="text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Cidade *</span>
          </span>
          {isAddressLocked && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
              <Lock className="w-3 h-3" />
              <span>Auto</span>
            </span>
          )}
        </Label>
        <Input
          id="city"
          placeholder="Ex: São Paulo"
          readOnly={isAddressLocked}
          {...register('city', {
            onChange: (e) => onFieldChange('city', e.target.value),
          })}
          className={cn(
            errors.city && 'border-destructive focus-visible:ring-destructive',
            isAddressLocked && 'bg-muted/40 text-muted-foreground cursor-not-allowed select-none'
          )}
        />
        {errors.city && (
          <p className="text-[11px] text-destructive font-medium">{errors.city.message}</p>
        )}
      </div>

      {/* Complemento (Opcional) */}
      <div className="sm:col-span-12 space-y-1.5">
        <Label htmlFor="complement" className="text-xs font-semibold">
          Complemento <span className="text-muted-foreground font-normal">(Opcional)</span>
        </Label>
        <Input
          id="complement"
          placeholder="Ex: Apto 42, Bloco B"
          {...register('complement', {
            onChange: (e) => onFieldChange('complement', e.target.value),
          })}
        />
      </div>
    </div>
  )
}
