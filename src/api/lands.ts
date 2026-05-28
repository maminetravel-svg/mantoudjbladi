import { api } from './client'
import { Land } from '../types'

export function apiGetLands(filters?: { wilaya?: string; goal?: string }) {
  const params = new URLSearchParams()
  if (filters?.wilaya) params.set('wilaya', filters.wilaya)
  if (filters?.goal) params.set('goal', filters.goal)
  const q = params.toString() ? `?${params}` : ''
  return api.get<Land[]>(`/api/lands${q}`)
}

export function apiAddLand(data: Omit<Land, 'id' | 'createdAt'>) {
  return api.post<Land>('/api/lands', data)
}

export function apiDeleteLand(id: string) {
  return api.delete(`/api/lands/${id}`)
}

export function apiUpdateLand(id: string, updates: Partial<Land>) {
  return api.put<Land>(`/api/lands/${id}`, updates)
}
