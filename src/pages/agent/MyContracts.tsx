import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CropProgressBar } from '../../components/Shared/CropProgressBar'
import { SyncIndicator } from '../../components/Shared/SyncIndicator'
import { CROP_LABELS, CROP_EMOJIS } from '../../types'
import { ArrowRight, Filter, Check, X } from 'lucide-react'
import { showToast } from '../../components/Shared/Toast'

type Tab = 'all' | 'pending' | 'ready'

export default function MyContracts() {
  const navigate = useNavigate()
  const { currentUser, crops, farmers } = useAppStore()
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { updatePreOrderStatus } = useAppStore()

  const handlePreOrder = async (cropId: string, orderId: string, status: 'accepted' | 'rejected') => {
    setActionLoading(orderId)
    try {
      await updatePreOrderStatus(cropId, orderId, status)
      showToast(status === 'accepted' ? '✅ تم قبول طلب الحجز' : '❌ تم رفض الطلب', status === 'accepted' ? 'success' : 'error')
    } catch {
      showToast('حدث خطأ، حاول مجدداً', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const myCrops = crops.filter(c => c.agentId === currentUser?.id)

  const filteredCrops = myCrops.filter(crop => {
    if (activeTab === 'pending') return crop.isOfflinePending
    if (activeTab === 'ready') return crop.stage === 'ready'
    return true
  })

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: 'الكل', count: myCrops.length },
    { id: 'pending', label: 'معلق', count: myCrops.filter(c => c.isOfflinePending).length },
    { id: 'ready', label: 'جاهز', count: myCrops.filter(c => c.stage === 'ready').length },
  ]

  return (
    <div className="min-h-screen bg-sage-50" dir="rtl">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <SyncIndicator />
          <button onClick={() => navigate('/agent')} className="text-white flex items-center gap-1">
            <ArrowRight size={20} />
            <span className="text-sm font-bold">رجوع</span>
          </button>
        </div>
        <h1 className="text-white text-2xl font-black">📋 جميع المحاصيل</h1>
        <p className="text-sage-300 text-sm mt-1">إدارة كل محاصيلك وعقودك</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 bg-white rounded-2xl p-1 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-500 hover:text-primary-500'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`mr-1 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white text-primary-500' : 'bg-gray-100'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Crops list */}
      <div className="px-4 mt-4 space-y-4 pb-6">
        {filteredCrops.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌾</div>
            <p className="text-gray-500 text-lg font-bold">لا توجد نتائج</p>
          </div>
        ) : (
          filteredCrops.map(crop => {
            const farmer = farmers.find(f => f.id === crop.farmerId)
            const totalQuantity = crop.preOrders.reduce((sum, p) => sum + p.quantityKg, 0)
            const percentBooked = crop.estimatedQuantityKg > 0
              ? Math.round((totalQuantity / crop.estimatedQuantityKg) * 100)
              : 0

            return (
              <div key={crop.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                {/* Crop header */}
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2 flex-wrap">
                      {crop.isOfflinePending && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                          ⚠ معلق
                        </span>
                      )}
                      {crop.inspectionRequests.some(r => r.status === 'pending') && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                          🔍 طلب معاينة
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-gray-800">
                        {CROP_EMOJIS[crop.type]} {CROP_LABELS[crop.type]}
                      </div>
                      <div className="text-sm text-gray-500">{farmer?.name} • {crop.wilaya}</div>
                    </div>
                  </div>

                  <CropProgressBar
                    plantingDate={crop.plantingDate}
                    expectedHarvestDate={crop.expectedHarvestDate}
                    cropType={crop.type}
                  />
                </div>

                {/* Stats */}
                <div className="px-4 pb-3 mt-2 grid grid-cols-3 gap-2">
                  <div className="bg-sage-50 rounded-xl p-2 text-center">
                    <div className="font-black text-primary-600 text-base">
                      {(crop.estimatedQuantityKg / 1000).toFixed(1)} طن
                    </div>
                    <div className="text-xs text-gray-500">الكمية</div>
                  </div>
                  <div className="bg-harvest-100 rounded-xl p-2 text-center">
                    <div className="font-black text-harvest-600 text-base">
                      {crop.pricePerKg ? `${crop.pricePerKg} دج` : 'غ.م'}
                    </div>
                    <div className="text-xs text-gray-500">السعر/كغ</div>
                  </div>
                  <div className="bg-primary-50 rounded-xl p-2 text-center">
                    <div className="font-black text-primary-600 text-base">{percentBooked}%</div>
                    <div className="text-xs text-gray-500">محجوز</div>
                  </div>
                </div>

                {/* Pre-orders */}
                {crop.preOrders.length > 0 && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <p className="text-xs font-black text-gray-600 mb-2">طلبات الحجز:</p>
                    <div className="space-y-2">
                      {crop.preOrders.map(order => (
                        <div key={order.id} className="bg-orange-50 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                              order.status === 'accepted' ? 'bg-green-100 text-green-700'
                              : order.status === 'rejected' ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status === 'accepted' ? 'مقبول' : order.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                            </span>
                            <span className="font-bold text-gray-800 text-xs">{order.buyerName}</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {(order.quantityKg / 1000).toFixed(1)} طن × {order.pricePerKg} دج
                          </div>
                          {order.buyerPhone && (
                            <div className="flex gap-2">
                              <a
                                href={`tel:${order.buyerPhone}`}
                                className="flex items-center gap-1 bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                              >
                                📞 اتصال
                              </a>
                              <a
                                href={`https://wa.me/213${order.buyerPhone.replace(/^0/, '')}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                              >
                                💬 واتساب
                              </a>
                              <span className="text-xs text-gray-400 font-mono self-center" dir="ltr">
                                {order.buyerPhone}
                              </span>
                            </div>
                          )}
                          {/* Accept/Reject buttons for pre-orders */}
                          {order.status === 'pending' && (
                            <div className="flex gap-2 mt-3 border-t border-orange-200 pt-3">
                              <button
                                onClick={() => handlePreOrder(crop.id, order.id, 'accepted')}
                                disabled={actionLoading === order.id}
                                className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50"
                              >
                                <Check size={14} /> قبول الحجز
                              </button>
                              <button
                                onClick={() => handlePreOrder(crop.id, order.id, 'rejected')}
                                disabled={actionLoading === order.id}
                                className="flex-1 flex items-center justify-center gap-1 bg-white text-red-600 border border-red-200 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50"
                              >
                                <X size={14} /> رفض
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
