import { useState } from 'react'
import { QrCode, Zap, Copy, Check } from 'lucide-react'
import { Button } from '../ui/button'

const PIX_KEY_MOCK =
  '00020126580014br.gov.bcb.pix0136onyinfo-pagamentos-pix-oficial5204000053039865802BR5915OnyInfo Hardware6009Sao Paulo62070503***6304E8A2'

export function PixPaymentSection() {
  const [copiedKey, setCopiedKey] = useState(false)

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY_MOCK)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2500)
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4 animate-in fade-in-0 duration-200 w-full min-w-0">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full min-w-0">
        {/* QR Code Simulado */}
        <div className="w-28 h-28 rounded-xl bg-background border border-border p-2 flex flex-col items-center justify-center text-foreground shrink-0 shadow-xs">
          <QrCode className="w-20 h-20 text-foreground" />
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            PIX 5% OFF
          </span>
        </div>

        {/* Instruções e Chave */}
        <div className="flex-1 min-w-0 w-full space-y-2 text-center sm:text-left">
          <h4 className="font-bold text-xs text-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Pague com PIX e garanta 5% de desconto</span>
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Utilize o aplicativo do seu banco para ler o QR Code ou copie a chave Copia e Cola abaixo.
          </p>

          {/* Chave Copia e Cola */}
          <div className="flex items-center gap-2 pt-1 w-full min-w-0">
            <div className="flex-1 min-w-0 overflow-hidden bg-background border border-input rounded-md px-2.5 py-1.5 text-xs font-mono text-muted-foreground truncate">
              {PIX_KEY_MOCK}
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCopyPix}
              className="gap-1 text-xs shrink-0 cursor-pointer h-8"
            >
              {copiedKey ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
