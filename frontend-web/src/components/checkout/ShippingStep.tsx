import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  MapPin,
  Truck,
  Building,
  Home,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Lock,
} from 'lucide-react'
import type { ShippingOption } from '../../types'
import { addressSchema, type AddressFormData } from '../../lib/schemas'
import { maskCEP } from '../../lib/masks'
import { useCartStore, useCustomerStore } from '../../stores'
import { fetchAddressByCep } from '../../services/viaCepService'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'pac',
    name: 'PAC / Econômico',
    deadlineDays: 6,
    price: 19.9,
  },
  {
    id: 'sedex',
    name: 'SEDEX / Expresso',
    deadlineDays: 2,
    price: 34.9,
  },
  {
    id: 'retirada',
    name: 'Retirada na Loja',
    deadlineDays: 0,
    price: 0.0,
  },
]

interface ShippingStepProps {
  onSuccess: () => void
}

export function ShippingStep({ onSuccess }: ShippingStepProps) {
  const customer = useCustomerStore((state) => state.customer)
  const saveProfile = useCustomerStore((state) => state.saveProfile)

  const selectedShipping = useCartStore((state) => state.selectedShipping)
  const setShipping = useCartStore((state) => state.setShipping)

  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepStatus, setCepStatus] = useState<'idle' | 'success' | 'error'>(() =>
    customer?.address?.street && customer?.address?.city ? 'success' : 'idle'
  )
  const [cepErrorMessage, setCepErrorMessage] = useState('')
  const [isAddressLocked, setIsAddressLocked] = useState(() =>
    Boolean(customer?.address?.street && customer?.address?.city)
  )

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: {
      cep: customer?.address?.cep || '',
      street: customer?.address?.street || '',
      number: customer?.address?.number || '',
      complement: customer?.address?.complement || '',
      neighborhood: customer?.address?.neighborhood || '',
      city: customer?.address?.city || '',
      state: customer?.address?.state || '',
    },
  })

  // Sincroniza a modalidade de frete inicial se não estiver selecionada
  useEffect(() => {
    if (!selectedShipping) {
      setShipping(SHIPPING_OPTIONS[0])
    }
  }, [selectedShipping, setShipping])

  // Consulta endereço
  const handleQueryCep = async (rawCep: string) => {
    const raw = rawCep.replace(/\D/g, '')
    if (raw.length !== 8) {
      setCepStatus('idle')
      setCepErrorMessage('')
      setIsAddressLocked(false)
      return
    }

    setIsLoadingCep(true)
    setCepStatus('idle')
    setCepErrorMessage('')

    try {
      const data = await fetchAddressByCep(raw)
      if (!data) {
        setCepStatus('error')
        setCepErrorMessage('CEP não encontrado. Verifique o número digitado.')
        setIsAddressLocked(false)
        return
      }

      // Preenche os campos do formulário
      setValue('street', data.logradouro, { shouldValidate: true })
      setValue('neighborhood', data.bairro, { shouldValidate: true })
      setValue('city', data.localidade, { shouldValidate: true })
      setValue('state', data.uf, { shouldValidate: true })

      // Sincroniza com a store do cliente
      const currentValues = getValues()
      saveProfile({
        address: {
          cep: maskCEP(raw),
          street: data.logradouro,
          number: currentValues.number || '',
          complement: currentValues.complement || '',
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        },
      })

      setCepStatus('success')
      setIsAddressLocked(true)
    } catch (err) {
      console.error(err)
      setCepStatus('error')
      setCepErrorMessage('Erro ao consultar endereço. Verifique sua conexão.')
      setIsAddressLocked(false)
    } finally {
      setIsLoadingCep(false)
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value)
    setValue('cep', masked)

    const raw = e.target.value.replace(/\D/g, '')
    if (raw.length === 8) {
      handleQueryCep(raw)
    } else {
      setIsAddressLocked(false)
      setCepStatus('idle')
    }
  }

  const handleAddressFieldChange = (field: keyof AddressFormData, value: string) => {
    const current = getValues()
    saveProfile({
      address: {
        cep: current.cep || '',
        street: field === 'street' ? value : current.street || '',
        number: field === 'number' ? value : current.number || '',
        complement: field === 'complement' ? value : current.complement || '',
        neighborhood: field === 'neighborhood' ? value : current.neighborhood || '',
        city: field === 'city' ? value : current.city || '',
        state: field === 'state' ? value : current.state || '',
      },
    })
  }

  const onSubmit = (data: AddressFormData) => {
    // Garante que o frete está gravado no carrinho
    if (!selectedShipping) {
      setShipping(SHIPPING_OPTIONS[0])
    }

    // Atualiza endereço persistido do cliente
    saveProfile({
      address: {
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement || '',
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      },
    })

    onSuccess()
  }

  return (
    <form id="shipping-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-border/80 shadow-xs bg-card">
        <CardHeader className="py-3.5 px-4 sm:px-6 bg-muted/20 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                Endereço de Entrega
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              Etapa 2 de 3
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Grid de Endereço */}
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
                    onChange: handleCepChange,
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

            {/* Estado / UF (Bloqueado quando preenchido automaticamente) */}
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
                  onChange: (e) => handleAddressFieldChange('state', e.target.value.toUpperCase()),
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

            {/* Logradouro / Rua (Bloqueado quando preenchido automaticamente) */}
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
                  onChange: (e) => handleAddressFieldChange('street', e.target.value),
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
                  onChange: (e) => handleAddressFieldChange('number', e.target.value),
                })}
                className={errors.number ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.number && (
                <p className="text-[11px] text-destructive font-medium">{errors.number.message}</p>
              )}
            </div>

            {/* Bairro (Bloqueado quando preenchido automaticamente) */}
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
                  onChange: (e) => handleAddressFieldChange('neighborhood', e.target.value),
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

            {/* Cidade (Bloqueada quando preenchida automaticamente) */}
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
                  onChange: (e) => handleAddressFieldChange('city', e.target.value),
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
                  onChange: (e) => handleAddressFieldChange('complement', e.target.value),
                })}
              />
            </div>
          </div>

          {/* Seleção de Frete */}
          <div className="space-y-2.5 pt-2">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-primary" />
              <span>Opções de Envio Disponíveis</span>
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SHIPPING_OPTIONS.map((option) => {
                const isSelected = selectedShipping?.id === option.id
                return (
                  <div
                    key={option.id}
                    onClick={() => setShipping(option)}
                    className={cn(
                      'p-3 rounded-xl border transition-all cursor-pointer space-y-1 flex flex-col justify-between',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs'
                        : 'border-border bg-card/60 hover:border-primary/40 hover:bg-muted/20'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-xs text-foreground truncate">
                        {option.name}
                      </div>
                      <div
                        className={cn(
                          'w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0',
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                        )}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[11px] text-muted-foreground">
                        {option.deadlineDays === 0
                          ? 'Retirada imediata'
                          : `Até ${option.deadlineDays} dias úteis`}
                      </span>
                      <span className="font-bold text-xs text-foreground">
                        {option.price === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">GRÁTIS</span>
                        ) : (
                          option.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        )}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Endereço verificado e protegido para envio seguro.</span>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
