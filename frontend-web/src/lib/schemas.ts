import { z } from 'zod'
import { cleanMask } from './masks'

export const customerSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string().email('Informe um endereço de e-mail válido'),
  cpf: z
    .string()
    .refine((val) => cleanMask(val).length === 11, 'O CPF deve conter 11 dígitos numéricos'),
  phone: z
    .string()
    .refine(
      (val) => cleanMask(val).length >= 10 && cleanMask(val).length <= 11,
      'Informe um telefone válido com DDD (10 ou 11 dígitos)'
    ),
})

export type CustomerFormData = z.infer<typeof customerSchema>

export const addressSchema = z.object({
  cep: z
    .string()
    .refine((val) => cleanMask(val).length === 8, 'O CEP deve conter 8 dígitos'),
  street: z.string().min(2, 'Informe o logradouro / rua'),
  number: z.string().min(1, 'Informe o número do endereço'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  city: z.string().min(2, 'Informe a cidade'),
  state: z.string().min(2, 'UF inválida').max(2, 'UF deve ter 2 letras'),
})

export type AddressFormData = z.infer<typeof addressSchema>
