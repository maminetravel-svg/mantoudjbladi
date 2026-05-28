import { api } from './client'
import { Farmer } from '../types'

export function apiGetFarmers(wilaya?: string) {
  const q = wilaya ? `?wilaya=${encodeURIComponent(wilaya)}` : ''
  return api.get<Farmer[]>(`/api/farmers${q}`)
}

export function apiGetFarmer(id: string) {
  return api.get<Farmer>(`/api/farmers/${id}`)
}

export function apiAddFarmer(data: Omit<Farmer, 'id' | 'agentId' | 'reviews'>) {
  return api.post<Farmer>('/api/farmers', data)
}

export function apiAddFarmerReview(farmerId: string, rating: number, comment: string) {
  return api.post(`/api/farmers/${farmerId}/reviews`, { rating, comment })
}
