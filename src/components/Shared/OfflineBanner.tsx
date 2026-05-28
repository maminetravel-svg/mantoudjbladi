import React from 'react'
import { useAppStore } from '../../store/appStore'
import { WifiOff } from 'lucide-react'

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useAppStore()

  if (isOnline) return null

  return (
    <div className="bg-yellow-400 text-yellow-900 px-4 py-2 flex items-center gap-2 justify-center text-sm font-bold animate-pulse">
      <WifiOff size={16} />
      <span>أنت غير متصل بالإنترنت - ستتم المزامنة تلقائياً عند الاتصال</span>
    </div>
  )
}
