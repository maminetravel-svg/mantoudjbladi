export interface BadgeDef {
  id: string
  icon: string
  label: string
  role: 'farmer' | 'buyer' | 'agent' | 'all'
  minDeals?: number
  minScore?: number
  manualOnly?: boolean
  description: string
}

export const ALL_BADGES: BadgeDef[] = [
  // Farmer badges
  { id: 'farmer_first_deal', icon: '🤝', label: 'أول صفقة', role: 'farmer', minDeals: 1, description: 'أتمم أول صفقة بيع' },
  { id: 'farmer_5_deals',   icon: '⭐', label: '5 صفقات',  role: 'farmer', minDeals: 5, description: 'أتمم 5 صفقات بيع' },
  { id: 'farmer_10_deals',  icon: '🏆', label: '10 صفقات', role: 'farmer', minDeals: 10, description: 'أتمم 10 صفقات بيع' },
  { id: 'farmer_trusted',   icon: '✅', label: 'موثوق',    role: 'farmer', minScore: 4.0, description: 'احصل على تقييم 4.0+' },
  { id: 'farmer_elite',     icon: '💎', label: 'نخبة',     role: 'farmer', minScore: 4.5, description: 'احصل على تقييم 4.5+' },
  { id: 'farmer_organic',   icon: '🌿', label: 'طبيعي',    role: 'farmer', manualOnly: true, description: 'منتج طبيعي معتمد' },
  { id: 'farmer_verified',  icon: '🔐', label: 'موثّق',    role: 'farmer', manualOnly: true, description: 'هوية موثقة من الإدارة' },

  // Agent badges
  { id: 'agent_first_farmer', icon: '👨‍🌾', label: 'أول فلاح',    role: 'agent', minDeals: 1,  description: 'سجّل أول فلاح' },
  { id: 'agent_5_farmers',    icon: '⭐',  label: '5 فلاحين',    role: 'agent', minDeals: 5,  description: 'سجّل 5 فلاحين' },
  { id: 'agent_10_farmers',   icon: '🏆',  label: '10 فلاحين',   role: 'agent', minDeals: 10, description: 'سجّل 10 فلاحين' },
  { id: 'agent_trusted',      icon: '✅',  label: 'وسيط موثوق',  role: 'agent', minScore: 4.0, description: 'احصل على تقييم 4.0+' },
  { id: 'agent_active',       icon: '🚀',  label: 'وسيط نشط',    role: 'agent', manualOnly: true, description: 'وسيط نشط معتمد' },

  // Buyer badges
  { id: 'buyer_first_deal',  icon: '🛒', label: 'أول شراء',       role: 'buyer', minDeals: 1,  description: 'أتمم أول عملية شراء' },
  { id: 'buyer_5_deals',     icon: '⭐', label: '5 مشتريات',      role: 'buyer', minDeals: 5,  description: 'أتمم 5 عمليات شراء' },
  { id: 'buyer_trusted',     icon: '✅', label: 'مشتري موثوق',    role: 'buyer', minScore: 4.0, description: 'احصل على تقييم 4.0+' },
  { id: 'buyer_premium',     icon: '💎', label: 'مشتري مميز',     role: 'buyer', manualOnly: true, description: 'مشتري مميز معتمد' },
]

export function getEarnedBadges(role: string, dealsCount: number, trustScore: number, manualBadges: string[]): BadgeDef[] {
  return ALL_BADGES.filter(b => {
    if (b.role !== role && b.role !== 'all') return false
    if (manualBadges.includes(b.id)) return true
    if (b.manualOnly) return false
    if (b.minDeals && dealsCount >= b.minDeals) return true
    if (b.minScore && trustScore >= b.minScore) return true
    return false
  })
}

export function getRoleBadges(role: string): BadgeDef[] {
  return ALL_BADGES.filter(b => b.role === role || b.role === 'all')
}
