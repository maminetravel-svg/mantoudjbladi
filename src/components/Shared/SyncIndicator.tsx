import React from 'react'
import { useAppStore } from '../../store/appStore'
import { CloudOff, CheckCircle, RefreshCw, Cloud } from 'lucide-react'

export const SyncIndicator: React.FC = () => {
  const { isOnline, pendingSyncCount, isSyncing, syncData } = useAppStore()

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
        <CloudOff size={14} />
        <span className="text-xs font-bold">{pendingSyncCount > 0 ? `${pendingSyncCount} معلق` : 'غير متصل'}</span>
      </div>
    )
  }

  if (isSyncing) {
    return (
      <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
        <RefreshCw size={14} className="animate-spin" />
        <span className="text-xs font-bold">مزامنة...</span>
      </div>
    )
  }

  if (pendingSyncCount > 0) {
    return (
      <button
        onClick={() => syncData()}
        className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm hover:bg-yellow-200 transition-colors"
      >
        <Cloud size={14} />
        <span className="text-xs font-bold">{pendingSyncCount} معلق - انقر للمزامنة</span>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
      <CheckCircle size={14} />
      <span className="text-xs font-bold">متزامن</span>
    </div>
  )
}
