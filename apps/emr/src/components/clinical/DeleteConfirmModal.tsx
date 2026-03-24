import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@patient-health/ui'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeleteConfirmModalProps {
  title: string
  message: string
  confirmLabel?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function DeleteConfirmModal({
  title,
  message,
  confirmLabel = 'Delete',
  isDestructive = true,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // ── Focus trap ─────────────────────────────────────────────────────────────

  useEffect(() => {
    cancelButtonRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCancel()
        return
      }
      if (e.key !== 'Tab') return

      const modal = modalRef.current
      if (!modal) return

      const focusable = modal.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 transition-opacity"
        aria-hidden="true"
        onClick={onCancel}
      />

      {/* Centred modal */}
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4" aria-hidden="true">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          aria-describedby="delete-confirm-message"
          className="relative w-full max-w-md rounded-xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Body */}
          <div className="p-6">
            {isDestructive && (
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
            )}

            <h2
              id="delete-confirm-title"
              className="text-base font-semibold text-gray-900"
            >
              {title}
            </h2>

            <p
              id="delete-confirm-message"
              className="mt-2 text-sm text-gray-600 leading-relaxed"
            >
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <Button
              ref={cancelButtonRef}
              variant="outline"
              size="default"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              variant={isDestructive ? 'destructive' : 'default'}
              size="default"
              onClick={onConfirm}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
