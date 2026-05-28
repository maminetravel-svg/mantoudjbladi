import React, { useState, useEffect } from 'react'
import { setToken } from '../../api/client'

const STORE_KEY = 'mantoudj-bladi-store'

export const AdminReturnBar: React.FC = () => {
  const [adminToken, setAdminToken] = useState<string | null>(null)

  useEffect(() => {
    const check = () => setAdminToken(sessionStorage.getItem('admin_return_token'))
    check()
    window.addEventListener('admin_session_changed', check)
    return () => window.removeEventListener('admin_session_changed', check)
  }, [])

  if (!adminToken) return null

  const handleReturn = () => {
    const adminUser = sessionStorage.getItem('admin_return_user')

    // استعادة التوكن
    setToken(adminToken)

    // استعادة بيانات الأدمن في localStorage مباشرة قبل إعادة التحميل
    // حتى يقرأها AdminGuard فوراً دون انتظار rehydrateUser
    if (adminUser) {
      try {
        const stored = JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
        stored.state = { ...(stored.state || {}), currentUser: JSON.parse(adminUser) }
        localStorage.setItem(STORE_KEY, JSON.stringify(stored))
      } catch {}
    }

    sessionStorage.removeItem('admin_return_token')
    sessionStorage.removeItem('admin_return_user')

    window.location.href = '/app-admin?tab=users'
  }

  return (
    <div
      onClick={handleReturn}
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#1e1b4b',
        color: 'white',
        padding: '10px 20px',
        borderRadius: 999,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        fontSize: 13,
        fontWeight: 700,
        direction: 'rtl',
        cursor: 'pointer',
        border: '2px solid #7c3aed',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: 18 }}>🔐</span>
      أنت تتصفح كمستخدم — اضغط للرجوع للوحة الإدارة
      <span style={{ background: '#7c3aed', padding: '2px 10px', borderRadius: 999, fontSize: 12 }}>
        رجوع
      </span>
    </div>
  )
}
