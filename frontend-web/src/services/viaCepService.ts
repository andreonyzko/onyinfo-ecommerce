export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge?: string
  gia?: string
  ddd?: string
  siafi?: string
  erro?: boolean | string
}

/**
 * Consulta de endereço via API pública do ViaCEP utilizando fetch nativo.
 */
export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse | null> {
  const cleanCep = cep.replace(/\D/g, '')

  if (cleanCep.length !== 8) {
    throw new Error('O CEP informado deve conter exatamente 8 dígitos.')
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)

    if (!response.ok) {
      throw new Error(`Erro na requisição ao ViaCEP: status ${response.status}`)
    }

    const data: ViaCepResponse = await response.json()

    if (data.erro === true || data.erro === 'true') {
      return null
    }

    return data
  } catch (error) {
    console.error('Falha ao consultar CEP no ViaCEP:', error)
    throw error
  }
}
