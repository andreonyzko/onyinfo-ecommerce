import type { Product } from './product'

export interface CartItem {
  product: Product
  quantity: number
}

export interface ShippingOption {
  id: string
  name: string
  deadlineDays: number
  price: number
}

export const DEFAULT_SHIPPING_OPTIONS: ShippingOption[] = [
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

export type PaymentMethod = 'credit_card' | 'pix'

export interface OrderSummary {
  orderId: string
  createdAt: string
  customer: {
    name: string
    email: string
    cpf: string
    phone: string
  }
  address: {
    cep: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
  }
  items: CartItem[]
  shippingOption: ShippingOption
  paymentMethod: PaymentMethod
  subtotal: number
  shippingPrice: number
  discount: number
  total: number
}
