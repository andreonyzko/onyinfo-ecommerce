/**
 * Utilitários de Máscaras e Formatação com Expressões Regulares Puras
 * Conforme Hard Constraints do AGENTS.md (sem bibliotecas externas pesadas).
 */

/** Formata CPF no padrão 000.000.000-00 */
export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/** Formata Telefone fixo (00) 0000-0000 ou Celular (00) 00000-0000 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{4})$/, '$1-$2')
}

/** Formata CEP no padrão 00000-000 */
export function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return digits.replace(/(\d{5})(\d)/, '$1-$2')
}

/** Formata Número de Cartão de Crédito no padrão 0000 0000 0000 0000 */
export function maskCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

/** Formata Validade de Cartão no padrão MM/AA */
export function maskCardExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

/** Formata CVV de Cartão até 4 dígitos */
export function maskCardCVV(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4)
}

/** Remove qualquer caractere não numérico de uma string */
export function cleanMask(value: string): string {
  return value.replace(/\D/g, '')
}

/** Formata valores numéricos para moeda brasileira (BRL - R$ 0,00) */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
