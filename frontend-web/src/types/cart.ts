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
