import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import type { ToastMessage } from '../types'

interface ToastContextValue {
  push: (text: string, type?: ToastMessage['type']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (text: string, type: ToastMessage['type'] = 'success') => {
      const id = Date.now() + Math.floor(Math.random() * 1000)
      setToasts((prev) => [...prev, { id, text, type }])
      window.setTimeout(() => remove(id), 3600)
    },
    [remove],
  )

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast 容器：移动端顶部、桌面端右下，避免遮挡导航 */}
      <div
        className="pointer-events-none fixed inset-x-3 top-3 z-[80] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:items-end"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const Icon = t.type === 'success' ? CheckCircle2 : t.type === 'error' ? AlertTriangle : Info
          const tone =
            t.type === 'success'
              ? 'border-success/30 bg-white text-ink'
              : t.type === 'error'
                ? 'border-brand-accent/40 bg-white text-ink'
                : 'border-line bg-white text-ink'
          const iconTone =
            t.type === 'success' ? 'text-success' : t.type === 'error' ? 'text-brand-accent' : 'text-brand'
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-card animate-fade-up ${tone}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconTone}`} aria-hidden="true" />
              <p className="flex-1 text-sm leading-relaxed">{t.text}</p>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="rounded p-1 text-ink-soft transition-colors hover:text-ink"
                aria-label="关闭提示"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast 必须在 ToastProvider 内使用')
  return ctx
}
