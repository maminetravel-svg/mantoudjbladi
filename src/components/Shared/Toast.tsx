import React, { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'info' | 'error'
  onDismiss: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onDismiss, duration = 3000 }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  const bg =
    type === 'success' ? '#2D6A4F' :
    type === 'error' ? '#dc2626' :
    '#1e40af'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        zIndex: 9999,
        background: bg,
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        maxWidth: '320px',
        textAlign: 'center',
        direction: 'rtl',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  )
}

// Global toast manager
interface ToastItem {
  id: number
  message: string
  type: 'success' | 'info' | 'error'
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = []
let toastItems: ToastItem[] = []
let toastCounter = 0

export function showToast(message: string, type: 'success' | 'info' | 'error' = 'success') {
  const id = ++toastCounter
  toastItems = [...toastItems, { id, message, type }]
  toastListeners.forEach(fn => fn(toastItems))
  setTimeout(() => {
    toastItems = toastItems.filter(t => t.id !== id)
    toastListeners.forEach(fn => fn(toastItems))
  }, 3500)
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const listener = (items: ToastItem[]) => setToasts([...items])
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  return (
    <>
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          style={{ position: 'fixed', bottom: `${80 + i * 60}px`, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 + i }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => {
              toastItems = toastItems.filter(t => t.id !== toast.id)
              toastListeners.forEach(fn => fn(toastItems))
            }}
          />
        </div>
      ))}
    </>
  )
}
