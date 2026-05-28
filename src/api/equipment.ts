import { api } from './client'
import { Equipment } from '../types'

export function apiGetEquipment(filters?: { wilaya?: string; category?: string }) {
  const params = new URLSearchParams()
  if (filters?.wilaya) params.set('wilaya', filters.wilaya)
  if (filters?.category) params.set('category', filters.category)
  const q = params.toString() ? `?${params}` : ''
  return api.get<Equipment[]>(`/api/equipment${q}`)
}

export function apiAddEquipment(data: Omit<Equipment, 'id' | 'createdAt'>) {
  return api.post<Equipment>('/api/equipment', data)
}

export function apiUpdateEquipmentImages(id: string, images: string[]) {
  return api.put(`/api/equipment/${id}/images`, { images })
}

export function apiDeleteEquipment(id: string) {
  return api.delete(`/api/equipment/${id}`)
}

export function apiUpdateEquipment(id: string, updates: Partial<Equipment>) {
  return api.put<Equipment>(`/api/equipment/${id}`, updates)
}
