import { api } from './client'
import { Crop } from '../types'

export function apiGetMyCrops() {
  return api.get<Crop[]>('/api/crops/my-crops')
}

export function apiGetCrops(filters?: { wilaya?: string; type?: string; stage?: string; farmerId?: string }) {
  const params = new URLSearchParams()
  if (filters?.wilaya) params.set('wilaya', filters.wilaya)
  if (filters?.type) params.set('type', filters.type)
  if (filters?.stage) params.set('stage', filters.stage)
  if (filters?.farmerId) params.set('farmerId', filters.farmerId)
  const q = params.toString() ? `?${params}` : ''
  return api.get<Crop[]>(`/api/crops${q}`)
}

export function apiGetCrop(id: string) {
  return api.get<Crop>(`/api/crops/${id}`)
}

export function apiAddCrop(data: Omit<Crop, 'id' | 'agentId' | 'inspectionRequests' | 'preOrders' | 'isOfflinePending'>) {
  return api.post<Crop>('/api/crops', data)
}

export function apiUpdateCrop(id: string, updates: Partial<Pick<Crop, 'stage' | 'images' | 'videos' | 'coverMediaType' | 'description' | 'pricePerKg' | 'estimatedQuantityKg'>>) {
  return api.put<Crop>(`/api/crops/${id}`, updates)
}

export function apiRequestInspection(cropId: string, buyerName?: string, buyerPhone?: string) {
  return api.post(`/api/crops/${cropId}/inspection`, { buyerName, buyerPhone })
}

export function apiCreatePreOrder(cropId: string, quantityKg: number, pricePerKg: number) {
  return api.post(`/api/crops/${cropId}/preorder`, { quantityKg, pricePerKg })
}

export function apiUpdateInspectionStatus(cropId: string, inspectionId: string, status: 'pending' | 'approved' | 'completed' | 'rejected') {
  return api.put(`/api/crops/${cropId}/inspection/${inspectionId}`, { status })
}

export function apiUpdatePreOrderStatus(cropId: string, preorderId: string, status: 'pending' | 'accepted' | 'rejected' | 'completed') {
  return api.put(`/api/crops/${cropId}/preorder/${preorderId}`, { status })
}

export function apiDeleteInspection(cropId: string, inspectionId: string) {
  return api.delete(`/api/crops/${cropId}/inspection/${inspectionId}`)
}

export function apiDeletePreOrder(cropId: string, preorderId: string) {
  return api.delete(`/api/crops/${cropId}/preorder/${preorderId}`)
}
