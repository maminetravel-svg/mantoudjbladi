import React from 'react'
import { LayoutList, LayoutGrid } from 'lucide-react'

export type ViewMode = 'list' | 'grid'

interface ViewToggleProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <button
        onClick={() => onChange('list')}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-bold transition-colors ${
          mode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-primary-500'
        }`}
      >
        <LayoutList size={18} />
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-bold transition-colors ${
          mode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-primary-500'
        }`}
      >
        <LayoutGrid size={18} />
      </button>
    </div>
  )
}
