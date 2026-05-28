import React, { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { showToast } from './Toast'

interface InspectionModalProps {
  cropId: string
  cropName: string
  farmerName: string
  wilaya: string
  onClose: () => void
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  cropId,
  cropName,
  farmerName,
  wilaya,
  onClose,
}) => {
  const { currentUser, requestInspectionWithDetails } = useAppStore()
  const [buyerName, setBuyerName] = useState(currentUser?.name || '')
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '')

  const handleConfirm = () => {
    requestInspectionWithDetails(cropId, buyerName, buyerPhone)
    showToast('تم إرسال طلب المعاينة ✓', 'success')
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          width: '100%',
          maxWidth: '360px',
          direction: 'rtl',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Title */}
        <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '900', color: '#1B4332' }}>
          تأكيد طلب المعاينة
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#666' }}>
          سيتم إرسال إشعار للوسيط لتنسيق زيارة خبيرك للمزرعة
        </p>

        {/* Crop info */}
        <div
          style={{
            background: '#f0fdf4',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '16px',
            borderRight: '4px solid #2D6A4F',
          }}
        >
          <div style={{ fontWeight: '900', color: '#1B4332', marginBottom: '4px' }}>{cropName}</div>
          <div style={{ fontSize: '13px', color: '#555' }}>الفلاح: {farmerName}</div>
          <div style={{ fontSize: '13px', color: '#555' }}>الولاية: {wilaya}</div>
        </div>

        {/* Buyer name */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px', color: '#333' }}>
            اسم المشتري
          </label>
          <input
            type="text"
            value={buyerName}
            onChange={e => setBuyerName(e.target.value)}
            placeholder="أدخل اسمك"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '2px solid #e5e7eb',
              fontSize: '14px',
              direction: 'rtl',
              textAlign: 'right',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        {/* Buyer phone */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px', color: '#333' }}>
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={buyerPhone}
            onChange={e => setBuyerPhone(e.target.value)}
            placeholder="05XXXXXXXX"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '2px solid #e5e7eb',
              fontSize: '14px',
              direction: 'ltr',
              textAlign: 'right',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        {/* Buttons */}
        <button
          onClick={handleConfirm}
          disabled={!buyerName.trim()}
          style={{
            width: '100%',
            padding: '14px',
            background: buyerName.trim() ? '#2D6A4F' : '#9ca3af',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            fontWeight: '900',
            fontSize: '16px',
            cursor: buyerName.trim() ? 'pointer' : 'default',
            marginBottom: '10px',
          }}
        >
          تأكيد الطلب
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            color: '#666',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          إلغاء
        </button>
      </div>
    </div>
  )
}
