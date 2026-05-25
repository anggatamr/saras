"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

interface ToastContextType {
  toast: (opts: Omit<Toast, 'id'>) => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export const useToast = () => useContext(ToastContext)

// ─── Style map ───────────────────────────────────────────────────────────────

const TOAST_STYLES: Record<ToastType, { bg: string; icon: React.ReactNode; label: string }> = {
  success: {
    bg: 'bg-green-200',
    icon: <CheckCircle2 className="h-5 w-5 shrink-0 text-green-800" />,
    label: 'SUCCESS',
  },
  error: {
    bg: 'bg-red-200',
    icon: <XCircle className="h-5 w-5 shrink-0 text-red-800" />,
    label: 'ERROR',
  },
  warning: {
    bg: 'bg-amber-200',
    icon: <AlertTriangle className="h-5 w-5 shrink-0 text-amber-800" />,
    label: 'WARNING',
  },
  info: {
    bg: 'bg-blue-200',
    icon: <Info className="h-5 w-5 shrink-0 text-blue-800" />,
    label: 'INFO',
  },
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Slide-in on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  // Auto-dismiss after 4s
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleDismiss()
    }, 4000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    // Wait for slide-out animation before removing
    setTimeout(() => onDismiss(toast.id), 300)
  }

  const { bg, icon } = TOAST_STYLES[toast.type]

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        w-[340px] max-w-[calc(100vw-2rem)]
        border-2 border-foreground rounded-none neo-shadow
        ${bg}
        flex items-start gap-3 p-4
        transition-all duration-300 ease-out
        ${visible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
        }
      `}
    >
      {/* Icon */}
      <div className="mt-0.5">{icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-black text-xs uppercase tracking-wider text-foreground leading-tight">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-1 text-xs font-medium text-foreground/80 leading-snug">
            {toast.description}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        aria-label="Tutup notifikasi"
        className="
          shrink-0 flex h-6 w-6 items-center justify-center
          border border-foreground/40 hover:border-foreground
          bg-background/40 hover:bg-background
          transition-all duration-150 rounded-none
          text-foreground
        "
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── Toaster (renders the toast stack) ───────────────────────────────────────

export function Toaster() {
  const { toasts, dismiss } = useToasterState()

  return (
    <div
      aria-label="Notifikasi"
      className="
        fixed bottom-4 right-4 z-[9999]
        flex flex-col gap-3
        items-end
        pointer-events-none
        sm:bottom-6 sm:right-6
      "
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  )
}

// ─── Internal state atom (shared between Provider & Toaster) ─────────────────

interface ToasterStateContextType {
  toasts: Toast[]
  dismiss: (id: string) => void
}

const ToasterStateContext = createContext<ToasterStateContextType>({
  toasts: [],
  dismiss: () => {},
})

function useToasterState() {
  return useContext(ToasterStateContext)
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 10)
    setToasts((prev) => {
      // Cap at 3 visible toasts; remove oldest if needed
      const next = [...prev, { id, ...opts }]
      return next.length > 3 ? next.slice(next.length - 3) : next
    })
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToasterStateContext.Provider value={{ toasts, dismiss }}>
        {children}
      </ToasterStateContext.Provider>
    </ToastContext.Provider>
  )
}
