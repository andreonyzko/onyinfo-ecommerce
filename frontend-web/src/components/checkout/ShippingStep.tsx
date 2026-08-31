import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, ShieldCheck } from 'lucide-react'
import { addressSchema, type AddressFormData } from '../../lib/schemas'
import { useCartStore, useCustomerStore } from '../../stores'
import { useViaCep } from '../../hooks'
import { DEFAULT_SHIPPING_OPTIONS } from '../../types'
import { ShippingOptionsList } from './ShippingOptionsList'
import { AddressFormFields } from './AddressFormFields'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

interface ShippingStepProps {
  onSuccess: () => void
}

export function ShippingStep({ onSuccess }: ShippingStepProps) {
  const customer = useCustomerStore((state) => state.customer)
  const saveProfile = useCustomerStore((state) => state.saveProfile)

  const selectedShipping = useCartStore((state) => state.selectedShipping)
  const setShipping = useCartStore((state) => state.setShipping)

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

  const {
    isLoadingCep,
    cepStatus,
    cepErrorMessage,
    isAddressLocked,
    handleCepChange,
  } = useViaCep({
    setValue,
    getValues,
    saveProfile,
    initialAddress: customer?.address,
  })

  // Sincroniza a modalidade de frete inicial se não estiver selecionada
  useEffect(() => {
    if (!selectedShipping) {
      setShipping(DEFAULT_SHIPPING_OPTIONS[0])
    }
  }, [selectedShipping, setShipping])

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
    if (!selectedShipping) {
      setShipping(DEFAULT_SHIPPING_OPTIONS[0])
    }

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
          {/* Campos de Endereço e Consulta de CEP */}
          <AddressFormFields
            register={register}
            errors={errors}
            isLoadingCep={isLoadingCep}
            cepStatus={cepStatus}
            cepErrorMessage={cepErrorMessage}
            isAddressLocked={isAddressLocked}
            onCepChange={handleCepChange}
            onFieldChange={handleAddressFieldChange}
          />

          {/* Seleção de Modalidades de Frete */}
          <ShippingOptionsList
            options={DEFAULT_SHIPPING_OPTIONS}
            selectedOption={selectedShipping}
            onSelectOption={setShipping}
          />

          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Endereço verificado e protegido para envio seguro.</span>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
