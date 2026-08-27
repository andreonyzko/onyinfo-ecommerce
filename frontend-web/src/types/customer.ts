export interface AddressData {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface CustomerProfile {
  name: string
  email: string
  cpf: string
  phone: string
  address?: AddressData
}
