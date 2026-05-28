import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import {
  Bell, Package, Settings, MessageSquare, Star, Info, Share2, LogOut,
  ChevronLeft, Wrench, MapPin, X
} from 'lucide-react'

export const FarmerMenu: React.FC = () => {
  const { currentUser, farmerMenuOpen, setFarmerMenuOpen, logout } = useAppStore()
  const navigate = useNavigate()
  const [showAbout, setShowAbout] = useState(false)

  if (!farmerMenuOpen || !currentUser) return null

  const close = () => setFarmerMenuOpen(false)

  const handleShare = () => {
    close()
    if (navigator.share) {
      navigator.share({ title: 'منتوج بلادي', url: window.location.origin })
    } else {
      navigator.clipboard.writeText(window.location.origin)
    }
  }

  const menuItems = [
    { icon: <Bell size={20} className="text-blue-500" />, label: 'الإشعارات', action: () => { close(); navigate('/farmer') } },
    { icon: <Package size={20} className="text-primary-500" />, label: 'منتجاتي', action: () => { close(); navigate('/farmer/add-crop') } },
    { icon: <Wrench size={20} className="text-yellow-500" />, label: 'المعدات', action: () => { close(); navigate('/farmer/equipment') } },
    { icon: <MapPin size={20} className="text-green-600" />, label: 'الأراضي', action: () => { close(); navigate('/farmer/lands') } },
    { icon: <Settings size={20} className="text-gray-500" />, label: 'الإعدادات', action: () => { close(); navigate('/farmer/settings') } },
    { icon: <MessageSquare size={20} className="text-purple-500" />, label: 'تعليق', action: () => { close(); window.open('mailto:support@mantoudjbladi.dz?subject=تعليق على التطبيق', '_blank') } },
    { icon: <Star size={20} className="text-yellow-500" />, label: 'قيّمنا', action: () => { close(); window.open('https://play.google.com/store', '_blank') } },
    { icon: <Info size={20} className="text-blue-400" />, label: 'من نحن', action: () => { close(); setShowAbout(true) } },
    { icon: <Share2 size={20} className="text-green-500" />, label: 'شارك التطبيق', action: handleShare },
    { icon: <LogOut size={20} className="text-red-500" />, label: 'تسجيل الخروج', action: () => { logout(); navigate('/') }, danger: true },
  ]

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={close} />
        <div className="relative bg-white rounded-t-3xl w-full max-w-md shadow-2xl animate-fadeIn">
          {/* Header */}
          <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
            <button onClick={close}>
              <X size={22} className="text-gray-500" />
            </button>
            <div className="text-right">
              <div className="font-black text-gray-800">{currentUser.name}</div>
              <div className="text-xs text-gray-400">{currentUser.wilaya}</div>
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

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" dir="rtl">
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
    </>
  )
}
