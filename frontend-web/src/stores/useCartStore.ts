import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product, ShippingOption, PaymentMethod } from '../types'

interface CartState {
  items: CartItem[]
  selectedShipping: ShippingOption | null
  selectedPaymentMethod: PaymentMethod
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  setShipping: (shipping: ShippingOption | null) => void
  setPaymentMethod: (method: PaymentMethod) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedShipping: null,
      selectedPaymentMethod: 'pix',

      addItem: (product: Product, quantity = 1) => {
        if (quantity <= 0) return

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          )

          if (existingIndex > -1) {
            const updated = [...state.items]
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            }
            return { items: updated }
          }

          return {
            items: [...state.items, { product, quantity }],
          }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }))
      },

      setShipping: (shipping: ShippingOption | null) => {
        set({ selectedShipping: shipping })
      },

      setPaymentMethod: (method: PaymentMethod) => {
        set({ selectedPaymentMethod: method })
      },

      clearCart: () => {
        set({
          items: [],
          selectedShipping: null,
          selectedPaymentMethod: 'pix',
        })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal()
        if (get().selectedPaymentMethod === 'pix') {
          return subtotal * 0.05
        }
        return 0
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().getDiscount()
        const shipping = get().selectedShipping?.price || 0
        return Math.max(0, subtotal - discount + shipping)
      },
    }),
    {
      name: 'onyinfo-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
