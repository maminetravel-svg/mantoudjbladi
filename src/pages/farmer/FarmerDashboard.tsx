import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { TrustScore } from '../../components/Shared/TrustScore'
import { getRoleBadges, getEarnedBadges } from '../../types/badges'
import { BadgesSection } from '../../components/Shared/BadgesSection'
import { CropProgressBar } from '../../components/Shared/CropProgressBar'
import { CropImage } from '../../components/Shared/CropImage'
import { showToast } from '../../components/Shared/Toast'
import { CROP_LABELS, CROP_EMOJIS } from '../../types'
import { getPendingConnections, acceptConnection, rejectConnection, getMyCrops } from '../../api/agentManagement'
import type { ConnectionRequest } from '../../types'
import {
  Bell, Package, Settings, MessageSquare, Star, Info, Share2, LogOut,
  ChevronLeft, Wrench, MapPin, X, Plus, Edit2, Phone, Link, CheckCircle, XCircle
} from 'lucide-react'


function InlineBadges({ dealsCount, trustScore, manualBadges }: { dealsCount: number; trustScore: number; manualBadges: string[] }) {
  const all = getRoleBadges('farmer')
  const earned = new Set(getEarnedBadges('farmer', dealsCount, trustScore, manualBadges).map(b => b.id))
  if (all.length === 0) return null
  return (
    <div className="mt-3 flex flex-nowrap gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {all.map(badge => {
        const isEarned = earned.has(badge.id)
        return (
          <div key={badge.id} className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border transition-all ${isEarned ? 'bg-white bg-opacity-20 border-white border-opacity-30' : 'bg-black bg-opacity-10 border-white border-opacity-10 opacity-50'}`}>
            <span className={`text-xl ${isEarned ? '' : 'grayscale'}`}>{badge.icon}</span>
            <span className={`text-xs font-bold whitespace-nowrap ${isEarned ? 'text-white' : 'text-white text-opacity-60'}`}>{badge.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function getDaysRemaining(date: string): number {
  const diff = new Date(date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function FarmerDashboard() {
  const { currentUser, crops, farmers, logout, fetchAll, farmerMenuOpen, setFarmerMenuOpen } = useAppStore()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [pendingConnections, setPendingConnections] = useState<ConnectionRequest[]>([])
  const [allMyCrops, setAllMyCrops] = useState<any[]>([])

  useEffect(() => {
    fetchAll()
    getPendingConnections().then(setPendingConnections).catch(() => {})
    getMyCrops().then(setAllMyCrops).catch(() => {})
  }, [])

  useEffect(() => {
    if (farmerMenuOpen) {
      setShowMenu(true)
      setFarmerMenuOpen(false)
    }
  }, [farmerMenuOpen])

  const handleAcceptConnection = async (requestId: string) => {
    try {
      await acceptConnection(requestId)
      setPendingConnections(prev => prev.filter(r => r._id !== requestId))
      showToast('تم قبول طلب الربط ✅')
      fetchAll()
    } catch {
      showToast('فشل قبول الطلب', 'error')
    }
  }

  const handleRejectConnection = async (requestId: string) => {
    try {
      await rejectConnection(requestId)
      setPendingConnections(prev => prev.filter(r => r._id !== requestId))
      showToast('تم رفض طلب الربط')
    } catch {
      showToast('فشل رفض الطلب', 'error')
    }
  }

  // Find the farmer record linked to current user (by userId or agentId)
  const myFarmerRecord = farmers.find(f =>
    (f as any).userId === currentUser?.id || f.agentId === currentUser?.id
  )

  // Find the farmer record for current user, fall back to currentUser data
  const farmerRecord = myFarmerRecord || {
      id: currentUser?.id || '',
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      wilaya: currentUser?.wilaya || '',
      gpsLat: 0,
      gpsLng: 0,
      agentId: '',
      trustScore: currentUser?.trustScore ?? 0,
      dealsCompleted: currentUser?.dealsCount ?? 0,
      specialization: undefined,
    }

  // Use allMyCrops (includes pending) if available, otherwise fall back to store crops
  const myCrops = allMyCrops.length > 0 ? allMyCrops : crops.filter(c =>
    c.farmerId === currentUser?.id ||
    (myFarmerRecord && c.farmerId === myFarmerRecord.id) ||
    c.agentId === currentUser?.id
  )
  const myPreOrders = myCrops.flatMap((c: any) => (c.preOrders || []).map((p: any) => ({ ...p, cropType: c.type })))
  const myInspections = myCrops.flatMap((c: any) => (c.inspectionRequests || []).map((r: any) => ({ ...r, cropType: c.type })))

  const handleShare = async () => {
    setShowMenu(false)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'منتوج بلادي',
          text: 'تطبيق يربط الفلاحين بالمشترين مباشرة — اكتشف المحاصيل الطازجة من منطقتك!',
          url: window.location.origin,
        })
      } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.origin)
      showToast('تم نسخ رابط التطبيق!', 'success')
    }
  }

  const menuItems = [
    { icon: <Bell size={20} className="text-blue-500" />, label: 'الإشعارات', badge: myInspections.filter(r => r.status === 'pending').length + myPreOrders.filter(p => p.status === 'pending').length || undefined, action: () => { setShowMenu(false); setShowNotifications(true) } },
    { icon: <Package size={20} className="text-primary-500" />, label: 'منتجاتي', action: () => { setShowMenu(false); navigate('/farmer/add-crop') } },
    { icon: <Wrench size={20} className="text-yellow-500" />, label: 'المعدات', action: () => { navigate('/farmer/equipment'); setShowMenu(false) } },
    { icon: <MapPin size={20} className="text-green-600" />, label: 'الأراضي', action: () => { navigate('/farmer/lands'); setShowMenu(false) } },
    { icon: <Settings size={20} className="text-gray-500" />, label: 'الإعدادات', action: () => { navigate('/farmer/settings'); setShowMenu(false) } },
    { icon: <MessageSquare size={20} className="text-purple-500" />, label: 'تعليق', action: () => { setShowMenu(false); window.open('mailto:support@mantoudjbladi.dz?subject=تعليق على التطبيق', '_blank') } },
    { icon: <Star size={20} className="text-yellow-500" />, label: 'قيّمنا', action: () => { setShowMenu(false); window.open('https://play.google.com/store', '_blank') } },
    { icon: <Info size={20} className="text-blue-400" />, label: 'من نحن', action: () => { setShowMenu(false); setShowAbout(true) } },
    { icon: <Share2 size={20} className="text-green-500" />, label: 'شارك التطبيق', action: handleShare },
    { icon: <LogOut size={20} className="text-red-500" />, label: 'تسجيل الخروج', action: () => { logout(); navigate('/') }, danger: true },
  ]

  return (
    <div className="min-h-screen bg-sage-50" dir="rtl">
      {/* Profile Header */}
      <div
        className="px-4 pt-10 pb-6"
        style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
      >
        {/* Profile row: avatar | name/info | 3 icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMenu(true)}
            className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg hover:bg-opacity-30 transition-all flex-shrink-0"
          >
            👨‍🌾
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-lg font-black truncate">{farmerRecord.name}</h1>
            <p className="text-earth-200 text-xs">{farmerRecord.wilaya}</p>
            {farmerRecord.specialization && (
              <p className="text-white text-opacity-80 text-xs truncate">{farmerRecord.specialization}</p>
            )}
            <div className="mt-1">
              <TrustScore score={farmerRecord.trustScore} size="sm" />
            </div>
          </div>
          {/* 3 icons same size as market page */}
          <div className="flex gap-1.5 flex-shrink-0" style={{ direction: 'ltr' }}>
            <button onClick={() => navigate('/farmer/settings')} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-white" title="الملف الشخصي">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </button>
            <button onClick={() => setShowNotifications(true)} className="relative w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-white" title="الإشعارات">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              {(myInspections.filter(r => r.status === 'pending').length + myPreOrders.filter(p => p.status === 'pending').length) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {myInspections.filter(r => r.status === 'pending').length + myPreOrders.filter(p => p.status === 'pending').length}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/farmer/ai')} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-white" title="المساعد الذكي">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg>
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-white bg-opacity-15 rounded-xl p-2 text-center">
            <div className="text-white font-black text-xl">{farmerRecord.dealsCompleted}</div>
            <div className="text-earth-200 text-xs">صفقة منجزة</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-xl p-2 text-center">
            <div className="text-white font-black text-xl">{myCrops.length}</div>
            <div className="text-earth-200 text-xs">محاصيل</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-xl p-2 text-center">
            <div className="text-white font-black text-xl">{myPreOrders.length}</div>
            <div className="text-earth-200 text-xs">عروض شراء</div>
          </div>
        </div>

      </div>

      <BadgesSection
        role="farmer"
        dealsCount={farmerRecord.dealsCompleted}
        trustScore={farmerRecord.trustScore}
        manualBadges={(currentUser as any)?.badges || []}
      />

      {/* Quick access: Equipment & Lands */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/farmer/equipment')}
          className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">🔧</div>
          <div className="text-right">
            <div className="font-black text-gray-800 text-sm">المعدات</div>
            <div className="text-xs text-gray-400">سوق الأدوات</div>
          </div>
        </button>
        <button
          onClick={() => navigate('/farmer/lands')}
          className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-earth-100 rounded-xl flex items-center justify-center text-2xl">🌍</div>
          <div className="text-right">
            <div className="font-black text-gray-800 text-sm">الأراضي</div>
            <div className="text-xs text-gray-400">بيع وإيجار</div>
          </div>
        </button>
      </div>

      {/* Pending connection requests */}
      {pendingConnections.length > 0 && (
        <div className="px-4 mt-4 space-y-2">
          <h2 className="text-gray-800 font-black text-lg mb-2">🔗 طلبات ربط الوسيط</h2>
          {pendingConnections.map(req => (
            <div key={req._id} className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Link size={16} className="text-blue-600" />
                <p className="font-bold text-blue-800 text-sm">طلب ربط من الوسيط: {req.agentName}</p>
              </div>
              <p className="text-xs text-blue-600 mb-3">يطلب منك الانضمام إليه كوسيط لإدارة منتجاتك</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAcceptConnection(req._id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded-xl text-sm font-bold"
                >
                  <CheckCircle size={14} /> قبول
                </button>
                <button
                  onClick={() => handleRejectConnection(req._id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-bold"
                >
                  <XCircle size={14} /> رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Crops */}
      <div className="px-4 mt-5">
        <h2 className="text-gray-800 font-black text-lg mb-3">🌾 محاصيلي</h2>
        {myCrops.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-4xl mb-2">🌱</div>
            <p className="text-gray-500 font-bold">لا توجد محاصيل مسجلة</p>
            <p className="text-gray-400 text-sm mt-1">تواصل مع وسيطك لتسجيل محاصيلك</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myCrops.map(crop => {
              const daysLeft = getDaysRemaining(crop.expectedHarvestDate)
              return (
                <div key={crop.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${crop.status === 'pending' ? 'border-yellow-200' : 'border-gray-100'}`}>
                  {/* Status badge for pending */}
                  {crop.status === 'pending' && (
                    <div className="bg-yellow-50 px-4 py-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                      <p className="text-xs text-yellow-700 font-bold">قيد الانتظار — بانتظار موافقة الإدارة</p>
                    </div>
                  )}
                  {crop.status === 'rejected' && (
                    <div className="bg-red-50 px-4 py-1.5">
                      <p className="text-xs text-red-600 font-bold">مرفوض من الإدارة</p>
                    </div>
                  )}
                  {/* Crop image */}
                  <CropImage type={crop.type} images={crop.images} className="w-full h-32" emojiSize="text-5xl" />
                  <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-400">{crop.wilaya}</div>
                      {crop.marketTarget && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          crop.marketTarget === 'محلي' ? 'bg-harvest-100 text-harvest-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {crop.marketTarget}
                        </span>
                      )}
                    </div>
                    <div className="font-black text-gray-800 text-lg">
                      {(CROP_EMOJIS as any)[crop.type]} {(CROP_LABELS as any)[crop.type]}
                    </div>
                  </div>
                  <CropProgressBar
                    plantingDate={crop.plantingDate}
                    expectedHarvestDate={crop.expectedHarvestDate}
                    cropType={crop.type}
                    compact
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{(crop.estimatedQuantityKg / 1000).toFixed(1)} طن متوقعة</span>
                    {crop.pricePerKg && <span>{crop.pricePerKg} دج/كغ</span>}
                  </div>
                  <button
                    onClick={() => navigate(`/farmer/edit-crop/${crop.id}`)}
                    className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-green-400 text-green-700 rounded-xl py-2 font-bold text-sm hover:bg-green-50 transition-all"
                  >
                    <Edit2 size={15} />
                    تعديل الحالة / إضافة صور
                  </button>
                  {(crop.inspectionRequests.length > 0 || crop.preOrders.length > 0) && (
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      {crop.inspectionRequests.length > 0 && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                          🔍 {crop.inspectionRequests.length} طلب معاينة
                        </span>
                      )}
                      {crop.preOrders.length > 0 && (
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                          📦 {crop.preOrders.length} عرض شراء
                        </span>
                      )}
                    </div>
                  )}
                  </div>{/* end p-4 */}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pre-orders */}
      {myPreOrders.length > 0 && (
        <div className="px-4 mt-5">
          <h2 className="text-gray-800 font-black text-lg mb-3">📦 عروض الشراء</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3 text-xs text-amber-800 font-bold text-right">
            ⚠️ للتأكيد تواصل مع المشتري مباشرة — المنصة غير مسؤولة عن الإجراءات اللاحقة
          </div>
          <div className="space-y-2">
            {myPreOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-black px-2 py-1 rounded-full ${
                    order.status === 'accepted' ? 'bg-green-100 text-green-700'
                    : order.status === 'rejected' ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'accepted' ? '✓ مقبول' : order.status === 'rejected' ? '✗ مرفوض' : '⏳ قيد الانتظار'}
                  </span>
                  <div className="text-right font-bold text-gray-800">
                    {(CROP_EMOJIS as any)[order.cropType]} {(CROP_LABELS as any)[order.cropType]}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-primary-600 font-black">
                    {(order.quantityKg / 1000).toFixed(1)} طن × {order.pricePerKg} دج
                  </span>
                  <button
                    onClick={() => navigate(`/profile/${order.buyerId}`)}
                    className="text-blue-600 font-black underline underline-offset-2">
                    {order.buyerName}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {(order as any).buyerPhone ? (
                      <>
                        <a href={`tel:${(order as any).buyerPhone}`}
                          className="flex items-center gap-1 bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                          <Phone size={12} /> اتصال
                        </a>
                        <a href={`https://wa.me/213${(order as any).buyerPhone.replace(/^0/, '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                          واتساب
                        </a>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`/profile/${order.buyerId}`)}
                        className="flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                        👤 عرض الملف الشخصي
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-mono" dir="ltr">
                    {(order as any).buyerPhone || ''}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('ar-DZ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inspection requests */}
      {myInspections.length > 0 && (
        <div className="px-4 mt-5 mb-6">
          <h2 className="text-gray-800 font-black text-lg mb-3">🔍 طلبات المعاينة</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mb-3 text-xs text-blue-800 font-bold text-right">
            ⚠️ للتأكيد تواصل مع المشتري مباشرة — المنصة غير مسؤولة عن الإجراءات اللاحقة
          </div>
          <div className="space-y-2">
            {myInspections.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-black px-2 py-1 rounded-full ${
                    req.status === 'completed' ? 'bg-green-100 text-green-700'
                    : req.status === 'approved' ? 'bg-blue-100 text-blue-700'
                    : req.status === 'rejected' ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.status === 'completed' ? '✓ مكتمل' : req.status === 'approved' ? 'موافق عليه' : req.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                  </span>
                  <div className="text-right font-bold text-gray-800">
                    {(CROP_EMOJIS as any)[req.cropType]} {(CROP_LABELS as any)[req.cropType]}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-400 text-xs">{new Date(req.requestedAt || Date.now()).toLocaleDateString('ar-DZ')}</span>
                  <button
                    onClick={() => navigate(`/profile/${req.buyerId}`)}
                    className="text-blue-600 font-black underline underline-offset-2">
                    {req.buyerName}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {req.buyerPhone ? (
                      <>
                        <a href={`tel:${req.buyerPhone}`}
                          className="flex items-center gap-1 bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                          <Phone size={12} /> اتصال
                        </a>
                        <a href={`https://wa.me/213${req.buyerPhone.replace(/^0/, '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                          واتساب
                        </a>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`/profile/${req.buyerId}`)}
                        className="flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                        👤 عرض الملف الشخصي
                      </button>
                    )}
                  </div>
                  {req.buyerPhone && (
                    <span className="text-xs text-gray-400 font-mono" dir="ltr">{req.buyerPhone}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-4" />

      {/* Profile Menu Drawer */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMenu(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md shadow-2xl animate-fadeIn">
            {/* Header */}
            <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
              <button onClick={() => setShowMenu(false)}>
                <X size={22} className="text-gray-500" />
              </button>
              <div className="text-right">
                <div className="font-black text-gray-800">{farmerRecord.name}</div>
                <div className="text-xs text-gray-400">{farmerRecord.wilaya}</div>
              </div>
              <div className="w-10 h-10 bg-harvest-100 rounded-2xl flex items-center justify-center text-2xl">
                👨‍🌾
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                    item.danger ? 'border-t border-gray-100 mt-1' : ''
                  }`}
                >
                  <ChevronLeft size={16} className="text-gray-300" />
                  <div className="flex items-center gap-3">
                    {item.badge && (
                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                    <span className={`font-bold ${item.danger ? 'text-red-500' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    <div>{item.icon}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pb-6" />
          </div>
        </div>
      )}

      {/* FAB - Add crop */}
      <button
        onClick={() => navigate('/farmer/add-crop')}
        className="fixed bottom-20 left-4 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-xl transition-all duration-200 active:scale-95"
      >
        <Plus size={22} />
        <span className="font-bold text-base">إضافة محصول</span>
      </button>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir="rtl">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAbout(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center">
            <button onClick={() => setShowAbout(false)} className="absolute top-4 left-4">
              <X size={20} className="text-gray-400" />
            </button>
            <div className="text-5xl mb-3">🌾</div>
            <h2 className="text-xl font-black text-gray-800 mb-1">منتوج بلادي</h2>
            <p className="text-xs text-gray-400 mb-4">الإصدار 1.0.0</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              منصة جزائرية تربط الفلاحين بالمشترين مباشرة — بدون وسطاء غير ضروريين. نهدف إلى تحسين الشفافية وتعزيز الثقة في السوق الفلاحي.
            </p>
            <div className="bg-sage-50 rounded-2xl p-3 text-sm text-gray-500">
              <p>📧 support@mantoudjbladi.dz</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowNotifications(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md shadow-2xl">
            <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
              <button onClick={() => setShowNotifications(false)}>
                <X size={22} className="text-gray-500" />
              </button>
              <h2 className="font-black text-gray-800 text-lg">الإشعارات</h2>
              <Bell size={20} className="text-blue-500" />
            </div>
            <div className="py-3 px-4 max-h-96 overflow-y-auto">
              {myPreOrders.filter(p => p.status === 'pending').map(p => {
                const crop = myCrops.find((c: any) => c.type === p.cropType)
                const isIndependent = crop && crop.agentId === currentUser?.id
                return (
                  <div key={p.id} className="py-3 border-b border-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📦</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">عرض شراء جديد على {(CROP_LABELS as any)[p.cropType]}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{p.buyerName} — {(p.quantityKg / 1000).toFixed(1)} طن × {p.pricePerKg} دج</p>
                        {isIndependent && (p as any).buyerPhone ? (
                          <div className="flex gap-2 mt-2">
                            <a href={`tel:${(p as any).buyerPhone}`} className="flex items-center gap-1 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                              <Phone size={11} /> اتصال
                            </a>
                            <a href={`https://wa.me/213${(p as any).buyerPhone.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                              واتساب
                            </a>
                          </div>
                        ) : (
                          <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-2 py-1 mt-2">
                            📞 للتأكيد تواصل مع وسيطك — المنصة غير مسؤولة عن الإجراءات اللاحقة
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {myInspections.filter(r => r.status === 'pending').map(r => {
                const crop = myCrops.find((c: any) => c.type === r.cropType)
                const isIndependent = crop && crop.agentId === currentUser?.id
                return (
                  <div key={r.id} className="py-3 border-b border-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🔍</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">طلب معاينة على {(CROP_LABELS as any)[r.cropType]}</p>
                        <p className="text-xs text-gray-500 mt-0.5">من: {r.buyerName}</p>
                        {isIndependent && r.buyerPhone ? (
                          <div className="flex gap-2 mt-2">
                            <a href={`tel:${r.buyerPhone}`} className="flex items-center gap-1 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                              <Phone size={11} /> اتصال
                            </a>
                          </div>
                        ) : (
                          <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-2 py-1 mt-2">
                            📞 للتأكيد تواصل مع وسيطك — المنصة غير مسؤولة عن الإجراءات اللاحقة
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {myPreOrders.filter(p => p.status === 'pending').length === 0 && myInspections.filter(r => r.status === 'pending').length === 0 && (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-gray-400 font-bold">لا توجد إشعارات جديدة</p>
                </div>
              )}
            </div>
            <div className="pb-6" />
          </div>
        </div>
      )}
    </div>
  )
}
