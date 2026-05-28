import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { Home, Map, FileText, User, Wrench, Layers, RefreshCw, ClipboardList, Bot, Settings, ShoppingBag, Menu } from 'lucide-react'
import { FarmerMenu } from './FarmerMenu'

interface NavItem {
  path: string
  icon: React.ReactNode
  label: string
}

export const BottomNav: React.FC = () => {
  const { currentUser, logout, setFarmerMenuOpen } = useAppStore()
  const navigate = useNavigate()

  const handleSwitch = () => { logout(); navigate('/') }

  if (!currentUser) return null

  const settingsPath = `/${currentUser.role}/settings`

  const agentItems: NavItem[] = [
    { path: '/agent', icon: <Home size={20} />, label: 'الرئيسية' },
    { path: '/agent/contracts', icon: <FileText size={20} />, label: 'العقود' },
    { path: '/agent/equipment', icon: <Wrench size={20} />, label: 'المعدات' },
    { path: '/agent/lands', icon: <Layers size={20} />, label: 'الأراضي' },
    { path: '/agent/map', icon: <Map size={20} />, label: 'الخريطة' },
  ]

  const buyerItems: NavItem[] = [
    { path: '/buyer', icon: <Home size={20} />, label: 'المنتجات' },
    { path: '/buyer/requests', icon: <ClipboardList size={20} />, label: 'طلباتي' },
    { path: '/buyer/equipment', icon: <Wrench size={20} />, label: 'المعدات' },
    { path: '/buyer/lands', icon: <Layers size={20} />, label: 'الأراضي' },
    { path: '/buyer/map', icon: <Map size={20} />, label: 'الخريطة' },
  ]

  const farmerItems: NavItem[] = [
    { path: '/farmer', icon: <Home size={20} />, label: 'ملفي' },
    { path: '/farmer/market', icon: <ShoppingBag size={20} />, label: 'السوق' },
    { path: '/farmer/map', icon: <Map size={20} />, label: 'الخريطة' },
    { path: '/farmer/equipment', icon: <Wrench size={20} />, label: 'المعدات' },
    { path: '/farmer/lands', icon: <Layers size={20} />, label: 'الأراضي' },
  ]

  const items =
    currentUser.role === 'agent' ? agentItems
    : currentUser.role === 'buyer' ? buyerItems
    : farmerItems

  return (
    <>
    <FarmerMenu />
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length <= 2}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-200 ${
                isActive ? 'text-primary-500' : 'text-gray-400 hover:text-primary-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={isActive ? 'text-primary-500' : 'text-gray-400'}>{item.icon}</div>
                <span className="text-xs font-bold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Menu button for all roles */}
        <button
          onClick={() => setFarmerMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl text-gray-400 hover:text-primary-400 transition-all duration-200"
        >
          <Menu size={20} />
          <span className="text-xs font-bold">القائمة</span>
        </button>
      </div>
    </div>
    </>
  )
}
