import { useState } from 'react'
import { fetchAddressByCep } from '../services/viaCepService'
import { maskCEP } from '../lib/masks'
import type { UseFormSetValue, UseFormGetValues } from 'react-hook-form'
import type { AddressFormData } from '../lib/schemas'
import type { CustomerProfile } from '../types'

interface UseViaCepOptions {
  setValue: UseFormSetValue<AddressFormData>
  getValues: UseFormGetValues<AddressFormData>
  saveProfile: (data: Partial<CustomerProfile>) => void
  initialAddress?: Partial<CustomerProfile['address']> | null
}

export function useViaCep({
  setValue,
  getValues,
  saveProfile,
  initialAddress,
}: UseViaCepOptions) {
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepStatus, setCepStatus] = useState<'idle' | 'success' | 'error'>(() =>
    initialAddress?.street && initialAddress?.city ? 'success' : 'idle'
  )
  const [cepErrorMessage, setCepErrorMessage] = useState('')
  const [isAddressLocked, setIsAddressLocked] = useState(() =>
    Boolean(initialAddress?.street && initialAddress?.city)
  )

  const queryCep = async (rawCep: string) => {
    const raw = rawCep.replace(/\D/g, '')
    if (raw.length !== 8) {
      setCepStatus('idle')
      setCepErrorMessage('')
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
        setCepErrorMessage('CEP não encontrado. Verifique o número digitado.')
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
      setCepErrorMessage('Erro ao consultar endereço. Verifique sua conexão.')
      setIsAddressLocked(false)
    } finally {
      setIsLoadingCep(false)
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value)
    setValue('cep', masked, { shouldValidate: true })
    if (masked.replace(/\D/g, '').length === 8) {
      queryCep(masked)
    } else {
      setCepStatus('idle')
      setCepErrorMessage('')
      setIsAddressLocked(false)
    }
  }

  const unlockAddress = () => {
    setIsAddressLocked(false)
  }

  return {
    isLoadingCep,
    cepStatus,
    cepErrorMessage,
    isAddressLocked,
    handleCepChange,
    queryCep,
    unlockAddress,
  }
}
