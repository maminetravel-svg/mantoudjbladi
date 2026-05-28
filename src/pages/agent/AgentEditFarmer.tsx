import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Save } from 'lucide-react'
import { getFarmerProfile, updateFarmerInfo } from '../../api/agentManagement'
import { WILAYAS } from '../../types'
import { showToast } from '../../components/Shared/Toast'

export default function AgentEditFarmer() {
  const { farmerId } = useParams<{ farmerId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [commune, setCommune] = useState('')
  const [specialization, setSpecialization] = useState('')

  useEffect(() => {
    if (!farmerId) return
    getFarmerProfile(farmerId)
      .then(data => {
        const f = data.farmer
        setName(f.name || '')
        setPhone(f.phone || '')
        setWilaya(f.wilaya || '')
        setCommune((f as any).commune || '')
        setSpecialization((f as any).specialization || '')
      })
      .catch(() => showToast('فشل تحميل بيانات الفلاح', 'error'))
      .finally(() => setLoading(false))
  }, [farmerId])

  const handleSave = async () => {
    if (!name.trim() || !phone.trim() || !wilaya) {
      showToast('الاسم والهاتف والولاية مطلوبة', 'error')
      return
    }
    try {
      setSaving(true)
      await updateFarmerInfo(farmerId!, { name, phone, wilaya, commune, specialization } as any)
      showToast('تم تحديث بيانات الفلاح ✅')
      navigate(-1)
    } catch {
      showToast('فشل تحديث البيانات', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">جاري التحميل...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      <div className="bg-gradient-to-br from-green-800 to-green-600 text-white px-4 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronRight size={20} />
          </button>
          <h1 className="text-xl font-black">تعديل بيانات الفلاح</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
            placeholder="اسم الفلاح"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
            placeholder="05XXXXXXXX"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">الولاية</label>
          <select
            value={wilaya}
            onChange={e => setWilaya(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-white"
          >
            <option value="">اختر الولاية</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">البلدية (اختياري)</label>
          <input
            value={commune}
            onChange={e => setCommune(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
            placeholder="اسم البلدية"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">التخصص (اختياري)</label>
          <input
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
            placeholder="مثال: خضروات، فواكه..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-2xl font-black text-base disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </button>
      </div>
    </div>
  )
}
