import React, { useState } from 'react'
import { BadgesSection } from '../../components/Shared/BadgesSection'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { SyncIndicator } from '../../components/Shared/SyncIndicator'
import { CropProgressBar } from '../../components/Shared/CropProgressBar'
import { CROP_LABELS, CROP_EMOJIS } from '../../types'
import { Plus, Users, Sprout, Handshake, ChevronLeft, Check, X, Bell } from 'lucide-react'
import { showToast } from '../../components/Shared/Toast'

function BarChart({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.5s' }} />
    </div>
  )
}

export default function AgentDashboard() {
  const navigate = useNavigate()
  const { currentUser, farmers, crops, contactAnalytics, updateInspectionStatus } = useAppStore()
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)

  const myFarmers = farmers.filter(f => f.agentId === currentUser?.id)
  const myCrops = crops.filter(c => c.agentId === currentUser?.id)
  const activeCrops = myCrops.filter(c => c.stage !== 'ready')
  const totalDeals = myCrops.reduce((sum, c) => sum + c.preOrders.filter(p => p.status === 'accepted' || p.status === 'completed').length, 0)

  // All pending inspection requests across my crops
  const pendingInspections = myCrops.flatMap(crop =>
    crop.inspectionRequests
      .filter(r => r.status === 'pending')
      .map(r => ({
        ...r,
        reqId: (r as any)._id || r.id,
        cropId: (crop as any)._id || crop.id,
        cropType: crop.type,
        cropWilaya: crop.wilaya,
      }))
  )

  const handleInspection = async (cropId: string, inspectionId: string, status: 'approved' | 'rejected') => {
    setActionLoading(inspectionId)
    try {
      await updateInspectionStatus(cropId, inspectionId, status)
      showToast(status === 'approved' ? '✅ تم قبول طلب المعاينة' : '❌ تم رفض الطلب', status === 'approved' ? 'success' : 'error')
    } catch {
      showToast('حدث خطأ، حاول مجدداً', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const analyticsMax = Math.max(
    contactAnalytics.phone,
    contactAnalytics.whatsapp,
    contactAnalytics.telegram,
    contactAnalytics.messenger,
    contactAnalytics.tiktok,
    contactAnalytics.inspection,
    1,
  )

  const analyticsRows = [
    { label: 'اتصال', icon: '📞', value: contactAnalytics.phone, color: '#2D6A4F' },
    { label: 'واتساب', icon: '💬', value: contactAnalytics.whatsapp, color: '#25D366' },
    { label: 'تيليغرام', icon: '✈️', value: contactAnalytics.telegram, color: '#229ED9' },
    { label: 'معاينات', icon: '👁', value: contactAnalytics.inspection, color: '#22c55e' },
  ]

  return (
    <div className="min-h-screen bg-sage-50" dir="rtl">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-6"
        style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' }}
      >
        {/* Top action buttons */}
        <div className="flex items-center gap-2 mb-3" style={{ direction: 'ltr' }}>
          <button onClick={() => navigate('/agent/settings')} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-white" title="الملف الشخصي">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
          <button onClick={() => setShowNotifications(true)} className="relative w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-white" title="الإشعارات">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            {pendingInspections.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black">{pendingInspections.length}</span>
            )}
          </button>
          <button onClick={() => navigate('/agent/ai')} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-white" title="المساعد الذكي">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg>
          </button>
        </div>
        <div className="flex items-center justify-between mb-1">
          <SyncIndicator />
          <div className="text-white text-opacity-70 text-sm">وسيط معتمد</div>
        </div>
        <h1 className="text-white text-2xl font-black mt-2">
          مرحباً، {currentUser?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sage-300 text-sm mt-1">هنا كل محاصيلك في نظرة واحدة</p>
      </div>

      {/* Stats Row */}
      <div className="px-4 -mt-4 grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-2xl p-3 shadow-md text-center">
          <div className="text-2xl font-black text-primary-500">{myFarmers.length}</div>
          <div className="text-xs text-gray-500 font-bold mt-1">الفلاحين</div>
          <Users size={16} className="mx-auto mt-1 text-primary-400" />
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-md text-center">
          <div className="text-2xl font-black text-yellow-500">{activeCrops.length}</div>
          <div className="text-xs text-gray-500 font-bold mt-1">محاصيل نشطة</div>
          <Sprout size={16} className="mx-auto mt-1 text-harvest-400" />
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-md text-center">
          <div className="text-2xl font-black text-green-600">{totalDeals + (currentUser?.dealsCount || 0)}</div>
          <div className="text-xs text-gray-500 font-bold mt-1">الصفقات</div>
          <Handshake size={16} className="mx-auto mt-1 text-earth-400" />
        </div>
      </div>

      <BadgesSection
        role="agent"
        dealsCount={currentUser?.dealsCount || 0}
        trustScore={currentUser?.trustScore || 0}
        manualBadges={(currentUser as any)?.badges || []}
      />

      {/* Quick Actions */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/agent/add-crop')}
            className="bg-primary-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-md hover:bg-primary-600 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Plus size={22} />
            </div>
            <div className="text-right">
              <div className="font-black text-sm">محصول جديد</div>
              <div className="text-xs text-white text-opacity-70">إضافة محصول</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/agent/farmers')}
            className="bg-green-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-md hover:bg-earth-600 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Users size={22} />
            </div>
            <div className="text-right">
              <div className="font-black text-sm">الفلاحون</div>
              <div className="text-xs text-white text-opacity-70">إدارة الفلاحين</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/agent/marketplace')}
            className="bg-blue-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-md active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <div className="text-right">
              <div className="font-black text-sm">السوق</div>
              <div className="text-xs text-white text-opacity-70">تصفح المنتجات</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/agent/add-farmer')}
            className="bg-gray-600 text-white rounded-2xl p-4 flex items-center gap-3 shadow-md active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Plus size={22} />
            </div>
            <div className="text-right">
              <div className="font-black text-sm">فلاح جديد</div>
              <div className="text-xs text-white text-opacity-70">تسجيل فلاح</div>
            </div>
          </button>
        </div>
      </div>

      {/* Pending Inspections Section */}
      {pendingInspections.length > 0 && (
        <div className="px-4 mb-5">
          <h2 className="text-gray-800 text-lg font-black mb-3">
            🔔 طلبات معاينة جديدة
            <span className="mr-2 text-sm bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
              {pendingInspections.length}
            </span>
          </h2>
          <div className="space-y-3">
            {pendingInspections.map(req => (
              <div
                key={req.reqId}
                style={{
                  background: '#fff7ed',
                  border: '2px solid #fed7aa',
                  borderRadius: '14px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    background: '#f97316',
                    color: '#fff',
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}>
                    قيد الانتظار
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '900', fontSize: '13px', color: '#9a3412' }}>
                      {CROP_EMOJIS[req.cropType as keyof typeof CROP_EMOJIS]} {CROP_LABELS[req.cropType as keyof typeof CROP_LABELS]} — {req.cropWilaya}
                    </div>
                    <div style={{ fontSize: '12px', color: '#78350f', marginTop: '2px' }}>
                      من: {req.buyerName}
                    </div>
                  </div>
                </div>
                {req.buyerPhone && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <a
                      href={`tel:${req.buyerPhone}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: '#2D6A4F', color: '#fff',
                        fontSize: '12px', fontWeight: 'bold',
                        padding: '6px 14px', borderRadius: '10px',
                        textDecoration: 'none',
                      }}
                    >
                      📞 اتصال
                    </a>
                    <a
                      href={`https://wa.me/213${req.buyerPhone.replace(/^0/, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: '#25D366', color: '#fff',
                        fontSize: '12px', fontWeight: 'bold',
                        padding: '6px 14px', borderRadius: '10px',
                        textDecoration: 'none',
                      }}
                    >
                      💬 واتساب
                    </a>
                    <span style={{ fontSize: '11px', color: '#92400e', fontFamily: 'monospace', alignSelf: 'center' }} dir="ltr">
                      {req.buyerPhone}
                    </span>
                  </div>
                )}
                {/* أزرار القبول والرفض */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #fed7aa', paddingTop: '8px' }}>
                  <button
                    onClick={() => handleInspection(req.cropId, req.reqId, 'approved')}
                    disabled={actionLoading === req.reqId}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      background: '#2D6A4F', color: '#fff',
                      fontSize: '13px', fontWeight: 'bold',
                      padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      opacity: actionLoading === req.reqId ? 0.6 : 1,
                    }}
                  >
                    <Check size={14} /> قبول المعاينة
                  </button>
                  <button
                    onClick={() => handleInspection(req.cropId, req.reqId, 'rejected')}
                    disabled={actionLoading === req.reqId}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      background: '#fee2e2', color: '#dc2626',
                      fontSize: '13px', fontWeight: 'bold',
                      padding: '8px', borderRadius: '10px', border: '1px solid #fca5a5', cursor: 'pointer',
                      opacity: actionLoading === req.reqId ? 0.6 : 1,
                    }}
                  >
                    <X size={14} /> رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Widget */}
      <div className="px-4 mb-5">
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ fontWeight: '900', fontSize: '15px', color: '#1B4332', marginBottom: '12px' }}>
            📊 إحصائيات التواصل هذا الشهر
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analyticsRows.map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', width: '22px', textAlign: 'center', flexShrink: 0 }}>{row.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', width: '70px', flexShrink: 0, textAlign: 'right' }}>
                  {row.label}:
                </span>
                <BarChart value={row.value} max={analyticsMax} color={row.color} />
                <span style={{ fontSize: '13px', fontWeight: '900', color: row.color, width: '30px', flexShrink: 0 }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crops List */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/agent/contracts')}
            className="text-primary-500 text-sm font-bold flex items-center gap-1"
          >
            عرض الكل <ChevronLeft size={16} />
          </button>
          <h2 className="text-gray-800 text-lg font-black">المحاصيل الأخيرة</h2>
        </div>

        <div className="space-y-3">
          {myCrops.slice(0, 6).map((crop) => {
            const farmer = farmers.find(f => f.id === crop.farmerId)
            return (
              <div key={crop.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {(crop as any).status === 'pending' && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200">
                        ⏳ قيد المراجعة
                      </span>
                    )}
                    {(crop as any).status === 'approved' && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">
                        ✅ منشور
                      </span>
                    )}
                    {(crop as any).status === 'rejected' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold border border-red-200">
                        ❌ مرفوض
                      </span>
                    )}
                    {crop.isOfflinePending && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                        معلق
                      </span>
                    )}
                    <div className="text-left">
                      <div className="text-xs text-gray-500">{farmer?.name}</div>
                      <div className="text-xs text-gray-400">{crop.wilaya}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-base font-black text-gray-800 text-right">
                        {CROP_EMOJIS[crop.type]} {CROP_LABELS[crop.type]}
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {(crop.estimatedQuantityKg / 1000).toFixed(1)} طن
                      </div>
                    </div>
                  </div>
                </div>
                <CropProgressBar
                  plantingDate={crop.plantingDate}
                  expectedHarvestDate={crop.expectedHarvestDate}
                  cropType={crop.type}
                  compact
                />
                {(crop.inspectionRequests.length > 0 || crop.preOrders.length > 0) && (
                  <div className="mt-2 flex gap-2">
                    {crop.inspectionRequests.length > 0 && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                        {crop.inspectionRequests.length} طلب معاينة
                      </span>
                    )}
                    {crop.preOrders.length > 0 && (
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                        {crop.preOrders.length} طلب حجز
                      </span>
                    )}
                  </div>
                )}
                <button
                  onClick={() => navigate(`/agent/edit-crop/${crop.id}`)}
                  className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-green-400 text-green-700 rounded-xl py-2 font-bold text-sm hover:bg-green-50 transition-all"
                >
                  ✏️ تعديل الحالة / إضافة صور
                </button>
              </div>
            )
          })}
        </div>

        {myCrops.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-500 text-lg font-bold">لا توجد محاصيل بعد</p>
            <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة محصولك الأول</p>
          </div>
        )}
      </div>

      {/* Bottom padding */}
      <div className="h-6" />

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowNotifications(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md shadow-2xl">
            <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
              <button onClick={() => setShowNotifications(false)}><X size={22} className="text-gray-500" /></button>
              <h2 className="font-black text-gray-800 text-lg">الإشعارات</h2>
              <Bell size={20} className="text-blue-500" />
            </div>
            <div className="py-3 px-4 max-h-96 overflow-y-auto">
              {pendingInspections.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-gray-400 font-bold">لا توجد إشعارات جديدة</p>
                </div>
              ) : pendingInspections.map(r => (
                <div key={r.reqId} className="py-3 border-b border-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🔍</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">طلب معاينة على {(CROP_LABELS as any)[r.cropType]} — {r.cropWilaya}</p>
                      <p className="text-xs text-gray-500 mt-0.5">من: {(r as any).buyerName || 'مشتري'}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { handleInspection(r.cropId, r.reqId, 'approved'); setShowNotifications(false) }} className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                          <Check size={11} /> قبول
                        </button>
                        <button onClick={() => { handleInspection(r.cropId, r.reqId, 'rejected'); setShowNotifications(false) }} className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                          <X size={11} /> رفض
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pb-6" />
          </div>
        </div>
      )}
    </div>
  )
}
