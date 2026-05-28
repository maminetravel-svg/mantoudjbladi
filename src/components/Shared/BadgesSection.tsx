import React from 'react'
import { getRoleBadges, getEarnedBadges } from '../../types/badges'

interface Props {
  role: string
  dealsCount: number
  trustScore: number
  manualBadges?: string[]
}

export const BadgesSection: React.FC<Props> = ({ role, dealsCount, trustScore, manualBadges = [] }) => {
  const allRoleBadges = getRoleBadges(role)
  const earned = getEarnedBadges(role, dealsCount, trustScore, manualBadges)
  const earnedIds = new Set(earned.map(b => b.id))

  if (allRoleBadges.length === 0) return null

  return (
    <div className="px-4 mt-4">
      <h2 className="text-gray-800 font-black text-lg mb-2">🏅 الأوسمة</h2>
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {allRoleBadges.map(badge => {
          const isEarned = earnedIds.has(badge.id)
          return (
            <div
              key={badge.id}
              title={badge.description}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border transition-all ${
                isEarned
                  ? 'bg-white border-primary-200 shadow-sm'
                  : 'bg-gray-50 border-gray-200 opacity-40'
              }`}
            >
              <span className={`text-2xl ${isEarned ? '' : 'grayscale'}`}>{badge.icon}</span>
              <span className={`text-xs font-black whitespace-nowrap ${isEarned ? 'text-earth-600' : 'text-gray-400'}`}>
                {badge.label}
              </span>
              {!isEarned && !badge.manualOnly && (
                <span className="text-xs text-gray-400 text-center leading-tight whitespace-nowrap">
                  {badge.minDeals ? `${Math.max(0, badge.minDeals - dealsCount)} متبقي` : `${badge.minScore}+`}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
