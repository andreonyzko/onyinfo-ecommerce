import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  MapPin,
  Truck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building,
  Home,
  Lock,
} from 'lucide-react'
import type { ShippingOption } from '../../types'
import { useCartStore, useCustomerStore } from '../../stores'
import { addressSchema, type AddressFormData } from '../../lib/schemas'
import { maskCEP, cleanMask } from '../../lib/masks'
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
    name: 'Retirada na Loja Oficial (SP)',
    deadlineDays: 0,
    price: 0,
  },
]

interface ShippingStepProps {
  onSuccess: (data: AddressFormData) => void
}

export function ShippingStep({ onSuccess }: ShippingStepProps) {
  const customer = useCustomerStore((state) => state.customer)
  const saveProfile = useCustomerStore((state) => state.saveProfile)
  const selectedShipping = useCartStore((state) => state.selectedShipping)
  const setShipping = useCartStore((state) => state.setShipping)

  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepStatus, setCepStatus] = useState<'idle' | 'success' | 'error'>(
    customer?.address?.street ? 'success' : 'idle'
  )
  const [cepErrorMessage, setCepErrorMessage] = useState('')
  const [isAddressLocked, setIsAddressLocked] = useState(
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

  // Seleciona PAC por padrão se nenhum frete estiver ativo
  useEffect(() => {
    if (!selectedShipping) {
      setShipping(SHIPPING_OPTIONS[0])
    }
  }, [selectedShipping, setShipping])

  const handleCepSearch = async (cepInput: string) => {
    const raw = cleanMask(cepInput)
    if (raw.length !== 8) {
      setCepStatus('idle')
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
        setCepErrorMessage('CEP não encontrado no ViaCEP.')
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
      setCepErrorMessage('Erro ao consultar ViaCEP. Verifique sua conexão.')
      setIsAddressLocked(false)
    } finally {
      setIsLoadingCep(false)
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value)
    setValue('cep', masked, { shouldValidate: true })
    if (cleanMask(masked).length === 8) {
      handleCepSearch(masked)
    } else {
      setIsAddressLocked(false)
      setCepStatus('idle')
    }
  }

  const handleAddressFieldChange = (field: keyof AddressFormData, value: string) => {
    const currentValues = getValues()
    saveProfile({
      address: {
        ...currentValues,
        [field]: value,
      },
    })
  }

  const onSubmit = (data: AddressFormData) => {
    saveProfile({ address: data })
    onSuccess(data)
  }

  return (
    <form id="shipping-form" onSubmit={handleSubmit(onSubmit)} className="h-full">
      <Card className="border-border/80 shadow-xs h-full flex flex-col">
        <CardHeader className="py-3.5 px-4 sm:px-6 bg-muted/20 border-b border-border">
          <CardTitle className="text-sm font-bold text-foreground">
            Endereço de Entrega & Opções de Envio
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-6">
          {/* Formulário de Endereço */}
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3.5">
            {/* Campo de CEP com Consulta ViaCEP */}
            <div className="sm:col-span-3 space-y-1.5">
              <Label htmlFor="cep" className="text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>CEP *</span>
                </span>
                {isLoadingCep && (
                  <span className="flex items-center gap-1 text-[11px] text-primary font-normal">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Consultando ViaCEP...</span>
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

            {/* Estado / UF (Bloqueado quando preenchido pelo ViaCEP) */}
            <div className="sm:col-span-3 space-y-1.5">
              <Label htmlFor="state" className="text-xs font-semibold flex items-center justify-between">
                <span>Estado (UF) *</span>
                {isAddressLocked && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
                    <Lock className="w-3 h-3" />
                    <span>ViaCEP</span>
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

            {/* Logradouro / Rua (Bloqueado quando preenchido pelo ViaCEP) */}
            <div className="sm:col-span-4 space-y-1.5">
              <Label htmlFor="street" className="text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Logradouro / Rua *</span>
                </span>
                {isAddressLocked && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
                    <Lock className="w-3 h-3" />
                    <span>ViaCEP</span>
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

            {/* Número (Sempre Editável) */}
            <div className="sm:col-span-2 space-y-1.5">
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

            {/* Bairro (Bloqueado quando preenchido pelo ViaCEP) */}
            <div className="sm:col-span-3 space-y-1.5">
              <Label htmlFor="neighborhood" className="text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Bairro *</span>
                </span>
                {isAddressLocked && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
                    <Lock className="w-3 h-3" />
                    <span>ViaCEP</span>
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
                <p className="text-[11px] text-destructive font-medium">
                  {errors.neighborhood.message}
                </p>
              )}
            </div>

            {/* Cidade (Bloqueada quando preenchida pelo ViaCEP) */}
            <div className="sm:col-span-3 space-y-1.5">
              <Label htmlFor="city" className="text-xs font-semibold flex items-center justify-between">
                <span>Cidade *</span>
                {isAddressLocked && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
                    <Lock className="w-3 h-3" />
                    <span>ViaCEP</span>
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

            {/* Complemento (Sempre Editável / Opcional) */}
            <div className="sm:col-span-6 space-y-1.5">
              <Label htmlFor="complement" className="text-xs font-semibold">
                Complemento / Ponto de Referência <span className="text-muted-foreground font-normal">(Opcional)</span>
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
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground uppercase tracking-wider block">
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
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-foreground">{option.name}</span>
                        {option.price === 0 && (
                          <Badge variant="success" className="text-[9px] py-0 px-1 font-bold">
                            GRÁTIS
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {option.deadlineDays === 0
                          ? 'Disponível em 2 horas'
                          : `Prazo: até ${option.deadlineDays} dias úteis`}
                      </p>
                    </div>

                    <div className="pt-1.5 text-right">
                      <span className="font-extrabold text-xs text-foreground">
                        {option.price === 0
                          ? 'R$ 0,00'
                          : option.price.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
