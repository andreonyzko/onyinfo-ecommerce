import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CustomerProfile, OrderSummary } from '../types'

interface CustomerState {
  customer: CustomerProfile | null
  lastOrder: OrderSummary | null
  saveProfile: (profile: Partial<CustomerProfile>) => void
  setLastOrder: (order: OrderSummary) => void
  clearProfile: () => void
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customer: null,
      lastOrder: null,

      saveProfile: (profile: Partial<CustomerProfile>) => {
        set((state) => ({
          customer: {
            name: profile.name ?? state.customer?.name ?? '',
            email: profile.email ?? state.customer?.email ?? '',
            cpf: profile.cpf ?? state.customer?.cpf ?? '',
            phone: profile.phone ?? state.customer?.phone ?? '',
            address: {
              cep: profile.address?.cep ?? state.customer?.address?.cep ?? '',
              street: profile.address?.street ?? state.customer?.address?.street ?? '',
              number: profile.address?.number ?? state.customer?.address?.number ?? '',
              complement:
                profile.address?.complement ??
                state.customer?.address?.complement ??
                '',
              neighborhood:
                profile.address?.neighborhood ??
                state.customer?.address?.neighborhood ??
                '',
              city: profile.address?.city ?? state.customer?.address?.city ?? '',
              state: profile.address?.state ?? state.customer?.address?.state ?? '',
            },
          },
        }))
      },

      setLastOrder: (order: OrderSummary) => {
        set({ lastOrder: order })
      },

      clearProfile: () => {
        set({ customer: null, lastOrder: null })
      },
    }),
    {
      name: 'onyinfo-customer',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
