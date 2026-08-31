import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { OrderSummary } from '../types'

interface OrdersState {
  orders: OrderSummary[]
  lastOrder: OrderSummary | null
  addOrder: (order: OrderSummary) => void
  setLastOrder: (order: OrderSummary | null) => void
  clearLastOrder: () => void
  getOrderById: (orderId: string) => OrderSummary | undefined
  clearOrders: () => void
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastOrder: null,

      addOrder: (order: OrderSummary) => {
        set((state) => ({
          orders: [order, ...state.orders.filter((o) => o.orderId !== order.orderId)],
          lastOrder: order,
        }))
      },

      setLastOrder: (order: OrderSummary | null) => {
        set({ lastOrder: order })
      },

      clearLastOrder: () => {
        set({ lastOrder: null })
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((o) => o.orderId === orderId)
      },

      clearOrders: () => {
        set({ orders: [], lastOrder: null })
      },
    }),
    {
      name: 'onyinfo-orders',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
