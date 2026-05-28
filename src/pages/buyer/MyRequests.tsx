import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CROP_LABELS, CROP_EMOJIS } from '../../types'
import { ArrowRight, Eye, Package, Search, RefreshCw, Trash2 } from 'lucide-react'
import { apiGetCrops, apiDeleteInspection, apiDeletePreOrder } from '../../api/crops'
import { showToast } from '../../components/Shared/Toast'

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'completed'

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'pending', label: 'قيد الانتظار' },
  { key: 'approved', label: 'مقبول' },
  { key: 'rejected', label: 'مرفوض' },
  { key: 'completed', label: 'مكتمل' },
]

export default function MyRequests() {
  const navigate = useNavigate()
  const { crops, currentUser } = useAppStore()
  const [tab, setTab] = useState<'inspection' | 'orders'>('inspection')
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (!currentUser) return null

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const fresh = await apiGetCrops({})
      useAppStore.setState({ crops: fresh })
      showToast('تم التحديث ✅', 'success')
    } catch {
      showToast('فشل التحديث', 'error')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    handleRefresh()
  }, [])

  // All my inspection requests across all crops
  const myInspections = crops.flatMap((crop: any) =>
    (crop.inspectionRequests || [])
      .filter((r: any) => r.buyerId === currentUser.id)
      .map((r: any) => ({ ...r, crop }))
  )

  // All my pre-orders across all crops
  const myOrders = crops.flatMap((crop: any) =>
    (crop.preOrders || [])
      .filter((o: any) => o.buyerId === currentUser.id)
      .map((o: any) => ({ ...o, crop }))
  )

  const filteredInspections = statusFilter === 'all'
    ? myInspections
    : myInspections.filter((r: any) => {
        if (statusFilter === 'approved') return r.status === 'approved' || r.status === 'accepted'
        return r.status === statusFilter
      })

  const filteredOrders = statusFilter === 'all'
    ? myOrders
    : myOrders.filter((o: any) => {
        if (statusFilter === 'approved') return o.status === 'approved' || o.status === 'accepted'
        return o.status === statusFilter
      })

  const statusColor = (status: string) => {
    if (status === 'approved' || status === 'accepted') return { bg: '#dcfce7', text: '#16a34a' }
    if (status === 'rejected') return { bg: '#fee2e2', text: '#dc2626' }
    if (status === 'completed') return { bg: '#dbeafe', text: '#2563eb' }
    return { bg: '#fef9c3', text: '#ca8a04' }
  }

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: 'قيد الانتظار',
      approved: 'مقبول',
      rejected: 'مرفوض',
      completed: 'مكتمل',
      accepted: 'مقبول',
    }
    return map[status] || status
  }

  const handleDeleteInspection = async (req: any) => {
    const cropId = req.crop.id || req.crop._id
    const inspectionId = req._id || req.id
    if (!cropId || !inspectionId) return
    setDeletingId(inspectionId)
    try {
      await apiDeleteInspection(cropId, inspectionId)
      const fresh = await apiGetCrops({})
      useAppStore.setState({ crops: fresh })
      showToast('تم إلغاء طلب المعاينة ✅', 'success')
    } catch {
      showToast('فشل الإلغاء', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteOrder = async (order: any) => {
    const cropId = order.crop.id || order.crop._id
    const orderId = order._id || order.id
    if (!cropId || !orderId) return
    setDeletingId(orderId)
    try {
      await apiDeletePreOrder(cropId, orderId)
      const fresh = await apiGetCrops({})
      useAppStore.setState({ crops: fresh })
      showToast('تم إلغاء الحجز ✅', 'success')
    } catch {
      showToast('فشل الإلغاء', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const ContactBlock = ({ item, color }: { item: any; color: 'green' | 'amber' }) => {
    const isAgent = !!(item.crop as any).agentInfo
    const contactPhone = (item.crop as any).agentInfo?.phone || (item.crop as any).farmerInfo?.phone
    const contactName = (item.crop as any).agentInfo?.name || (item.crop as any).farmerInfo?.name
    if (!contactPhone) return null
    const bg = color === 'green' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
    const txt = color === 'green' ? 'text-green-700' : 'text-amber-700'
    return (
      <div className={`${bg} border rounded-xl p-3 mb-3`}>
        <div className={`text-xs ${txt} font-bold mb-2`}>
          📞 للتأكيد تواصل مع {contactName} مباشرة
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href={`tel:${contactPhone}`}
            className="flex items-center gap-1 bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
            📞 اتصال
          </a>
          <a href={`https://wa.me/213${contactPhone.replace(/^0/, '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
            💬 واتساب
          </a>
        </div>
        {!isAgent && (
          <div className="text-xs text-gray-400 mt-2">
            ⚠️ المنصة غير مسؤولة عن الإجراءات اللاحقة بعد التواصل المباشر
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sage-50" dir="rtl">
      {/* Header */}
      <div className="px-4 pt-10 pb-5" style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)' }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={handleRefresh} disabled={refreshing} className="text-white flex items-center gap-1">
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => navigate('/buyer')} className="text-white flex items-center gap-1">
            <ArrowRight size={20} />
            <span className="text-sm font-bold">رجوع</span>
          </button>
        </div>
        <h1 className="text-white text-2xl font-black">📋 طلباتي</h1>
        <p className="text-green-200 text-sm mt-1">متابعة طلبات المعاينة والحجز</p>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="bg-white bg-opacity-15 rounded-xl px-3 py-2 text-center">
            <div className="text-white font-black text-xl">{myInspections.length}</div>
            <div className="text-green-200 text-xs">طلبات معاينة</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-xl px-3 py-2 text-center">
            <div className="text-white font-black text-xl">{myOrders.length}</div>
            <div className="text-green-200 text-xs">حجوزات مبكرة</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-1 shadow-sm flex gap-1">
        <button
          onClick={() => setTab('inspection')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${
            tab === 'inspection' ? 'bg-primary-500 text-white shadow' : 'text-gray-500'
          }`}
        >
          <Search size={15} />
          معاينات ({myInspections.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${
            tab === 'orders' ? 'bg-amber-500 text-white shadow' : 'text-gray-500'
          }`}
        >
          <Package size={15} />
          حجوزات ({myOrders.length})
        </button>
      </div>

      {/* Status Filter */}
      <div className="px-4 mt-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                statusFilter === f.key
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3 pb-24 space-y-3">

        {/* Inspection requests tab */}
        {tab === 'inspection' && (
          <>
            {refreshing && myInspections.length === 0 ? (
              <div className="text-center py-16 text-gray-400">جاري التحميل...</div>
            ) : filteredInspections.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-3">🔍</div>
                <p className="text-gray-500 font-bold">
                  {statusFilter === 'all' ? 'لا توجد طلبات معاينة بعد' : 'لا توجد طلبات بهذه الحالة'}
                </p>
                {statusFilter === 'all' && (
                  <button
                    onClick={() => navigate('/buyer')}
                    className="mt-3 text-primary-500 font-bold text-sm underline"
                  >
                    تصفح المحاصيل
                  </button>
                )}
              </div>
            ) : (
              filteredInspections.map((req: any) => {
                const sc = statusColor(req.status)
                const isPending = req.status === 'pending'
                const reqId = req._id || req.id
                return (
                  <div key={reqId} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    {req.crop.images && req.crop.images.length > 0 ? (
                      <img src={req.crop.images[0]} className="w-full h-28 object-cover" />
                    ) : (
                      <div className="h-20 bg-gradient-to-r from-sage-100 to-primary-50 flex items-center justify-center text-5xl">
                        {CROP_EMOJIS[req.crop.type as keyof typeof CROP_EMOJIS]}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-black px-3 py-1 rounded-full"
                            style={{ background: sc.bg, color: sc.text }}
                          >
                            {statusLabel(req.status)}
                          </span>
                          {isPending && (
                            <button
                              onClick={() => handleDeleteInspection(req)}
                              disabled={deletingId === reqId}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-black text-gray-800 text-base">
                            {CROP_EMOJIS[req.crop.type as keyof typeof CROP_EMOJIS]} {CROP_LABELS[req.crop.type as keyof typeof CROP_LABELS]}
                          </div>
                          <div className="text-xs text-gray-500">{req.crop.wilaya}</div>
                        </div>
                      </div>
                      {req.requestedAt && (
                        <div className="text-xs text-gray-400 mb-3">📅 {formatDate(req.requestedAt)}</div>
                      )}
                      <ContactBlock item={req} color="green" />
                      <button
                        onClick={() => navigate(`/buyer/crop/${req.crop.id || req.crop._id}`)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-700 rounded-xl font-bold text-sm border border-primary-200"
                      >
                        <Eye size={15} />
                        عرض المحصول
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </>
        )}

        {/* Pre-orders tab */}
        {tab === 'orders' && (
          <>
            {refreshing && myOrders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">جاري التحميل...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-3">📦</div>
                <p className="text-gray-500 font-bold">
                  {statusFilter === 'all' ? 'لا توجد حجوزات بعد' : 'لا توجد حجوزات بهذه الحالة'}
                </p>
                {statusFilter === 'all' && (
                  <button
                    onClick={() => navigate('/buyer')}
                    className="mt-3 text-primary-500 font-bold text-sm underline"
                  >
                    تصفح المحاصيل
                  </button>
                )}
              </div>
            ) : (
              filteredOrders.map((order: any) => {
                const sc = statusColor(order.status)
                const isPending = order.status === 'pending'
                const orderId = order._id || order.id
                return (
                  <div key={orderId} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    {order.crop.images && order.crop.images.length > 0 ? (
                      <img src={order.crop.images[0]} className="w-full h-28 object-cover" />
                    ) : (
                      <div className="h-20 bg-gradient-to-r from-amber-50 to-yellow-50 flex items-center justify-center text-5xl">
                        {CROP_EMOJIS[order.crop.type as keyof typeof CROP_EMOJIS]}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-black px-3 py-1 rounded-full"
                            style={{ background: sc.bg, color: sc.text }}
                          >
                            {statusLabel(order.status)}
                          </span>
                          {isPending && (
                            <button
                              onClick={() => handleDeleteOrder(order)}
                              disabled={deletingId === orderId}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-black text-gray-800 text-base">
                            {CROP_EMOJIS[order.crop.type as keyof typeof CROP_EMOJIS]} {CROP_LABELS[order.crop.type as keyof typeof CROP_LABELS]}
                          </div>
                          <div className="text-xs text-gray-500">{order.crop.wilaya}</div>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-xl px-3 py-2 mb-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-black text-gray-800">{order.quantityKg.toLocaleString()} كغ</span>
                          <span className="text-gray-500">الكمية المحجوزة</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-black text-amber-700">
                            {order.pricePerKg > 0 ? `${order.pricePerKg} دج/كغ` : 'حسب السوق'}
                          </span>
                          <span className="text-gray-500">السعر</span>
                        </div>
                        {order.pricePerKg > 0 && (
                          <div className="flex justify-between text-sm border-t border-amber-200 pt-1">
                            <span className="font-black text-primary-700">
                              {(order.quantityKg * order.pricePerKg).toLocaleString()} دج
                            </span>
                            <span className="text-gray-500">الإجمالي التقديري</span>
                          </div>
                        )}
                      </div>
                      {order.createdAt && (
                        <div className="text-xs text-gray-400 mb-3">📅 {formatDate(order.createdAt)}</div>
                      )}
                      <ContactBlock item={order} color="amber" />
                      <button
                        onClick={() => navigate(`/buyer/crop/${order.crop.id || order.crop._id}`)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-bold text-sm border border-amber-200"
                      >
                        <Eye size={15} />
                        عرض المحصول
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </>
        )}
      </div>
    </div>
  )
}
