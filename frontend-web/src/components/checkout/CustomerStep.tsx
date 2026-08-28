import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, CreditCard, Phone } from 'lucide-react'
import { useCustomerStore } from '../../stores'
import { customerSchema, type CustomerFormData } from '../../lib/schemas'
import { maskCPF, maskPhone } from '../../lib/masks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface CustomerStepProps {
  onSuccess: (data: CustomerFormData) => void
}

export function CustomerStep({ onSuccess }: CustomerStepProps) {
  const customer = useCustomerStore((state) => state.customer)
  const saveProfile = useCustomerStore((state) => state.saveProfile)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      cpf: customer?.cpf || '',
      phone: customer?.phone || '',
    },
  })

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCPF(e.target.value)
    setValue('cpf', masked, { shouldValidate: true })
    saveProfile({ cpf: masked })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value)
    setValue('phone', masked, { shouldValidate: true })
    saveProfile({ phone: masked })
  }

  const onSubmit = (data: CustomerFormData) => {
    saveProfile(data)
    onSuccess(data)
  }

  return (
    <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="h-full">
      <Card className="border-border/80 shadow-xs h-full flex flex-col">
        <CardHeader className="py-3.5 px-4 sm:px-6 bg-muted/20 border-b border-border">
          <CardTitle className="text-sm font-bold text-foreground">
            Dados Pessoais do Comprador
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome Completo */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Nome Completo *</span>
              </Label>
              <Input
                id="name"
                placeholder="Ex: André Silva"
                {...register('name', {
                  onChange: (e) => saveProfile({ name: e.target.value }),
                })}
                className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.name && (
                <p className="text-[11px] text-destructive font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* E-mail */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span>E-mail *</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: andre@exemplo.com.br"
                {...register('email', {
                  onChange: (e) => saveProfile({ email: e.target.value }),
                })}
                className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.email && (
                <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* CPF com Máscara */}
            <div className="space-y-1.5">
              <Label htmlFor="cpf" className="text-xs font-semibold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                <span>CPF *</span>
              </Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                maxLength={14}
                {...register('cpf', {
                  onChange: handleCpfChange,
                })}
                className={errors.cpf ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.cpf && (
                <p className="text-[11px] text-destructive font-medium">{errors.cpf.message}</p>
              )}
            </div>

            {/* Telefone com Máscara */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Telefone / WhatsApp *</span>
              </Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                maxLength={15}
                {...register('phone', {
                  onChange: handlePhoneChange,
                })}
                className={errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-[11px] text-destructive font-medium">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4 text-[11px] text-muted-foreground">
            * Campos de preenchimento obrigatório para emissão da nota fiscal e envio.
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
