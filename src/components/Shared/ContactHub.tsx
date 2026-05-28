import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '../../store/appStore'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
    <path d="M16 3C8.82 3 3 8.82 3 16c0 2.33.63 4.53 1.73 6.43L3 29l6.73-1.7A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="white"/>
    <path d="M22.1 19.7c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" fill="#25D366"/>
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
    <circle cx="16" cy="16" r="13" fill="white"/>
    <path d="M22.5 10.5L19.8 22.3c-.2.9-.75 1.1-1.52.7l-4.2-3.1-2.03 1.95c-.22.22-.41.4-.84.4l.3-4.27 7.72-6.98c.33-.3-.07-.46-.52-.16L8.37 17.4l-4.12-1.29c-.9-.28-.91-.9.19-1.33l15.6-6.02c.74-.27 1.4.18 1.46 1.74z" fill="#229ED9"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
    <rect width="32" height="32" rx="16" fill="#010101"/>
    <path d="M21.5 8h-2.8v10.5a2.7 2.7 0 0 1-2.7 2.7 2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7c.27 0 .52.04.76.1v-2.87a5.56 5.56 0 0 0-.76-.05 5.5 5.5 0 0 0-5.5 5.5 5.5 5.5 0 0 0 5.5 5.5 5.5 5.5 0 0 0 5.5-5.5V13.1a7.96 7.96 0 0 0 4.66 1.5v-2.8a4 4 0 0 1-4.66-3.8z" fill="white"/>
    <path d="M23.16 11.8a4 4 0 0 1-1.66-3.8h-1.47a4 4 0 0 0 3.13 3.8z" fill="#69C9D0"/>
    <path d="M13 18.5a2.7 2.7 0 0 1 2.7-2.7c.27 0 .52.04.76.1v-2.87a5.56 5.56 0 0 0-.76-.05 5.5 5.5 0 0 0-5.5 5.5 5.5 5.5 0 0 0 3.4 5.08A5.47 5.47 0 0 1 13 18.5z" fill="#EE1D52"/>
  </svg>
)

const MessengerIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
    <circle cx="16" cy="16" r="13" fill="white"/>
    <path d="M16 4C9.37 4 4 9.06 4 15.28c0 3.52 1.73 6.65 4.44 8.7V28l4.05-2.23A12.44 12.44 0 0 0 16 26.56c6.63 0 12-5.06 12-11.28S22.63 4 16 4zm1.19 15.19l-3.06-3.26-5.97 3.26 6.57-6.97 3.13 3.26 5.9-3.26-6.57 6.97z" fill="url(#msng)"/>
    <defs>
      <linearGradient id="msng" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0099FF"/>
        <stop offset="1" stopColor="#A033FF"/>
      </linearGradient>
    </defs>
  </svg>
)

const InspectionIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
    <circle cx="14" cy="14" r="8" stroke="white" strokeWidth="2.5"/>
    <line x1="20" y1="20" x2="27" y2="27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="14" cy="14" r="4" fill="white" fillOpacity="0.3"/>
  </svg>
)

interface ContactHubProps {
  phone: string
  agentName: string
  cropName: string
  facebookUrl?: string
  tiktokUrl?: string
  onInspectionRequest: () => void
}

export const ContactHub: React.FC<ContactHubProps> = ({ phone, agentName, cropName, facebookUrl, tiktokUrl, onInspectionRequest }) => {
  const [open, setOpen] = useState(false)
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const trackContact = useAppStore(s => s.trackContact)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-contact-hub]') && !target.closest('[data-contact-fan]')) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const openFan = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setBtnPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    }
    setOpen(true)
  }

  const cleanPhone = phone.replace(/^0/, '213')

  const allItems = [
    ...(facebookUrl ? [{
      id: 'messenger',
      label: 'Messenger',
      icon: <MessengerIcon />,
      color: '#0084ff',
      action: () => { trackContact('messenger'); window.open(facebookUrl, '_blank'); setOpen(false) },
    }] : []),
    ...(tiktokUrl ? [{
      id: 'tiktok',
      label: 'TikTok',
      icon: <TikTokIcon />,
      color: '#010101',
      action: () => { trackContact('tiktok'); window.open(tiktokUrl, '_blank'); setOpen(false) },
    }] : []),
    {
      id: 'whatsapp',
      label: 'واتساب',
      icon: <WhatsAppIcon />,
      color: '#25D366',
      action: () => {
        trackContact('whatsapp')
        const text = encodeURIComponent(`السلام عليكم، أريد الاستفسار عن ${cropName}`)
        window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank')
        setOpen(false)
      },
    },
    {
      id: 'telegram',
      label: 'تيليغرام',
      icon: <TelegramIcon />,
      color: '#229ED9',
      action: () => { trackContact('telegram'); window.open(`https://t.me/+${cleanPhone}`, '_blank'); setOpen(false) },
    },
    {
      id: 'inspection',
      label: 'معاينة',
      icon: <InspectionIcon />,
      color: '#1B4332',
      action: () => { trackContact('inspection'); setOpen(false); onInspectionRequest() },
    },
  ]

  // Semicircle arc: angles from 150° → 30°, radius 105px
  const RADIUS = 105
  const START_DEG = 150
  const END_DEG = 30
  const n = allItems.length

  return (
    <div data-contact-hub style={{ position: 'relative', display: 'inline-block' }}>
      {/* Main phone button — always visible */}
      <button
        ref={btnRef}
        onClick={() => {
          if (!open) { openFan() }
          else { trackContact('phone'); window.open(`tel:${phone}`, '_self'); setOpen(false) }
        }}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: open ? '#16a34a' : '#22c55e',
          border: `3px solid white`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: open
            ? '0 0 0 5px rgba(34,197,94,0.3), 0 4px 20px rgba(22,163,74,0.5)'
            : '0 0 12px rgba(34,197,94,0.5), 0 3px 12px rgba(34,197,94,0.4)',
          transition: 'all 0.25s ease',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
        title={open ? `اتصل بـ ${agentName}` : `تواصل مع ${agentName}`}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.95a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
        </svg>
      </button>

      {/* Semicircle portal */}
      {open && createPortal(
        <div data-contact-fan>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(5px)',
              zIndex: 9998,
            }}
            onMouseDown={() => setOpen(false)}
          />

          {/* Phone button clone at same position — shows "call" hint */}
          <div
            style={{
              position: 'fixed',
              left: `${btnPos.x}px`,
              top: `${btnPos.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10001,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <button
              onClick={() => { trackContact('phone'); window.open(`tel:${phone}`, '_self'); setOpen(false) }}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#16a34a',
                border: '3px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 0 5px rgba(34,197,94,0.3), 0 4px 20px rgba(22,163,74,0.5)',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.95a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
              </svg>
            </button>
            <span style={{
              background: '#16a34a',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              padding: '2px 8px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
            }}>
              اتصال
            </span>
          </div>

          {/* Arc items */}
          {allItems.map((btn, i) => {
            const angleDeg = START_DEG - (i / (n - 1)) * (START_DEG - END_DEG)
            const angleRad = (angleDeg * Math.PI) / 180
            const bx = btnPos.x + RADIUS * Math.cos(angleRad)
            const by = btnPos.y - RADIUS * Math.sin(angleRad)

            return (
              <div
                key={btn.id}
                style={{
                  position: 'fixed',
                  left: `${bx}px`,
                  top: `${by}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9999,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  animation: `fanIn 0.22s ease ${i * 45}ms both`,
                }}
              >
                <button
                  onClick={btn.action}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: btn.color,
                    border: '3px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                    flexShrink: 0,
                  }}
                >
                  {btn.icon}
                </button>
                <span style={{
                  background: 'white',
                  color: '#111',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 7px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap',
                  direction: 'rtl',
                }}>
                  {btn.label}
                </span>
              </div>
            )
          })}

          {/* Dashed arc line */}
          <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 9998, pointerEvents: 'none' }}>
            <path
              d={`M ${btnPos.x + RADIUS * Math.cos(START_DEG * Math.PI / 180)} ${btnPos.y - RADIUS * Math.sin(START_DEG * Math.PI / 180)}
                  A ${RADIUS} ${RADIUS} 0 0 0
                  ${btnPos.x + RADIUS * Math.cos(END_DEG * Math.PI / 180)} ${btnPos.y - RADIUS * Math.sin(END_DEG * Math.PI / 180)}`}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
          </svg>
        </div>,
        document.body
      )}
    </div>
  )
}
