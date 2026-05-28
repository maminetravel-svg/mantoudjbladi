import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, MapPin, ToggleLeft, ToggleRight, Edit2, Trash2, Unlink, Package, ChevronRight, UserPlus, Search, Link } from 'lucide-react'
import { getMyFarmers, toggleFarmerActive, deleteFarmer, disconnectFarmer, sendConnectRequest } from '../../api/agentManagement'
import { ContactHub } from '../../components/Shared/ContactHub'
import type { AgentFarmer } from '../../types'
import { showToast } from '../../components/Shared/Toast'

export default function AgentFarmersList() {
  const navigate = useNavigate()
  const [farmers, setFarmers] = useState<AgentFarmer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [disconnectConfirm, setDisconnectConfirm] = useState<string | null>(null)
  const [connectId, setConnectId] = useState('')
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)

  useEffect(() => {
    loadFarmers()
  }, [])

  const loadFarmers = async () => {
    try {
      setLoading(true)
      const data = await getMyFarmers()
      setFarmers(data)
    } catch {
      showToast('فشل تحميل قائمة الفلاحين', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (farmer: AgentFarmer) => {
    try {
      const res = await toggleFarmerActive(farmer.id || farmer._id)
      setFarmers(prev => prev.map(f =>
        (f.id || f._id) === (farmer.id || farmer._id)
          ? { ...f, isActiveForAgent: res.isActiveForAgent }
          : f
      ))
      showToast(res.isActiveForAgent ? 'تم تنشيط الفلاح ✅' : 'تم تثبيط الفلاح')
    } catch {
      showToast('فشل تغيير الحالة', 'error')
    }
  }

  const handleDelete = async (farmerId: string) => {
    try {
      await deleteFarmer(farmerId)
      setFarmers(prev => prev.filter(f => (f.id || f._id) !== farmerId))
      setDeleteConfirm(null)
      showToast('تم حذف الفلاح نهائياً')
    } catch {
      showToast('فشل حذف الفلاح', 'error')
    }
  }

  const handleDisconnect = async (farmerId: string) => {
    try {
      await disconnectFarmer(farmerId)
      setFarmers(prev => prev.filter(f => (f.id || f._id) !== farmerId))
      setDisconnectConfirm(null)
      showToast('تم قطع الاتصال مع الفلاح')
    } catch {
      showToast('فشل قطع الاتصال', 'error')
    }
  }

  const handleSendConnect = async () => {
    if (!connectId.trim()) return
    try {
      setConnectLoading(true)
      await sendConnectRequest(connectId.trim())
      showToast('تم إرسال طلب الربط ✅')
      setShowConnectModal(false)
      setConnectId('')
    } catch (err: any) {
      showToast(err?.message || 'فشل إرسال الطلب', 'error')
    } finally {
      setConnectLoading(false)
    }
  }

  const filtered = farmers.filter(f =>
    f.name.includes(search) || f.phone.includes(search) || f.wilaya.includes(search)
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-800 to-green-600 text-white px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronRight size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black">قائمة الفلاحين</h1>
            <p className="text-green-200 text-sm">{farmers.length} فلاح مسجّل</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو الولاية..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Add new farmer buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/agent/add-farmer')}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm"
          >
            <UserPlus size={16} />
            إضافة فلاح جديد
          </button>
          <button
            onClick={() => setShowConnectModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm"
          >
            <Link size={16} />
            ربط بفلاح موجود
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">{search ? 'لا توجد نتائج' : 'لا يوجد فلاحون بعد'}</p>
          </div>
        ) : (
          filtered.map(farmer => (
            <div
              key={farmer.id || farmer._id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${!farmer.isActiveForAgent ? 'opacity-60 border-gray-200' : 'border-green-100'}`}
            >
              {/* Status indicator */}
              <div className={`h-1 ${farmer.isActiveForAgent ? 'bg-green-500' : 'bg-gray-300'}`} />

              <div className="p-4">
                {/* Top row: name + toggle */}
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => navigate(`/agent/farmers/${farmer.id || farmer._id}`)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-lg">
                      {farmer.name[0]}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-sm">{farmer.name}</p>
                      {farmer.userId && (
                        <p className="text-xs text-green-600">مرتبط بحساب خاص</p>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => handleToggle(farmer)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${farmer.isActiveForAgent ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {farmer.isActiveForAgent
                      ? <><ToggleRight size={16} /> نشيط</>
                      : <><ToggleLeft size={16} /> مثبّط</>
                    }
                  </button>
                </div>

                {/* Info */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={12} />{farmer.wilaya}</span>
                  <span className="flex items-center gap-1"><Package size={12} />{farmer.productsCount} منتج</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => navigate(`/agent/farmers/${farmer.id || farmer._id}`)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold"
                  >
                    <ChevronRight size={14} />
                    ملف الفلاح
                  </button>
                  <ContactHub
                    phone={farmer.phone || ''}
                    agentName={farmer.name}
                    cropName="الفلاح"
                    onInspectionRequest={() => navigate(`/agent/farmers/${farmer.id || farmer._id}`)}
                  />
                  <button
                    onClick={() => navigate(`/agent/edit-farmer/${farmer.id || farmer._id}`)}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold"
                  >
                    <Edit2 size={14} />
                    تعديل
                  </button>
                  <button
                    onClick={() => setDisconnectConfirm(farmer.id || farmer._id)}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold"
                  >
                    <Unlink size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(farmer.id || farmer._id)}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white w-full max-w-md rounded-t-3xl p-6">
            <h3 className="font-black text-lg text-center mb-2">حذف الفلاح نهائياً؟</h3>
            <p className="text-gray-500 text-sm text-center mb-6">هذا الإجراء لا يمكن التراجع عنه</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600">إلغاء</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">حذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Confirm Modal */}
      {disconnectConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDisconnectConfirm(null)} />
          <div className="relative bg-white w-full max-w-md rounded-t-3xl p-6">
            <h3 className="font-black text-lg text-center mb-2">قطع الاتصال مع الفلاح؟</h3>
            <p className="text-gray-500 text-sm text-center mb-6">سيختفي الفلاح من قائمتك ولن تتمكن من إدارة منتجاته</p>
            <div className="flex gap-3">
              <button onClick={() => setDisconnectConfirm(null)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600">إلغاء</button>
              <button onClick={() => handleDisconnect(disconnectConfirm)} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">قطع الاتصال</button>
            </div>
          </div>
        </div>
      )}

      {/* Connect to existing farmer modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConnectModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-3xl p-6">
            <h3 className="font-black text-lg text-center mb-2">ربط بفلاح موجود</h3>
            <p className="text-gray-500 text-sm text-center mb-4">أدخل رقم ملف الفلاح (MB-...) أو معرّفه</p>
            <input
              value={connectId}
              onChange={e => setConnectId(e.target.value)}
              placeholder="MB-262001 أو معرّف الحساب"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-green-500"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowConnectModal(false)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600">إلغاء</button>
              <button onClick={handleSendConnect} disabled={connectLoading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50">
                {connectLoading ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
