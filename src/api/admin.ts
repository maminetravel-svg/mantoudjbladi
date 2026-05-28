import { api } from './client'

export function apiGetPublicConfig(type: string) {
  return api.get<any[]>(`/api/config/${type}`)
}

export function apiAdminStats() {
  return api.get<any>('/api/admin/stats')
}

export function apiAdminUsers(params?: { search?: string; role?: string; blocked?: string; page?: number }) {
  const q = new URLSearchParams()
  if (params?.search) q.set('search', params.search)
  if (params?.role) q.set('role', params.role)
  if (params?.blocked !== undefined) q.set('blocked', params.blocked)
  if (params?.page) q.set('page', String(params.page))
  return api.get<any>(`/api/admin/users?${q}`)
}

export function apiAdminBlockUser(id: string) {
  return api.put<any>(`/api/admin/users/${id}/block`, {})
}

export function apiAdminDeleteUser(id: string) {
  return api.delete<any>(`/api/admin/users/${id}`)
}

export function apiAdminCrops(params?: { search?: string; stage?: string; wilaya?: string; status?: string; page?: number }) {
  const q = new URLSearchParams()
  if (params?.search) q.set('search', params.search)
  if (params?.stage) q.set('stage', params.stage)
  if (params?.wilaya) q.set('wilaya', params.wilaya)
  if (params?.status) q.set('status', params.status)
  if (params?.page) q.set('page', String(params.page))
  return api.get<any>(`/api/admin/crops?${q}`)
}

export function apiAdminDeleteCrop(id: string) {
  return api.delete<any>(`/api/admin/crops/${id}`)
}

export function apiAdminCropStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
  return api.put<any>(`/api/admin/crops/${id}/status`, { status })
}

export function apiAdminEquipment(params?: { search?: string; wilaya?: string; status?: string; page?: number }) {
  const q = new URLSearchParams()
  if (params?.search) q.set('search', params.search)
  if (params?.wilaya) q.set('wilaya', params.wilaya)
  if (params?.status) q.set('status', params.status)
  if (params?.page) q.set('page', String(params.page))
  return api.get<any>(`/api/admin/equipment?${q}`)
}

export function apiAdminEquipmentStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
  return api.put<any>(`/api/admin/equipment/${id}/status`, { status })
}

export function apiAdminDeleteEquipment(id: string) {
  return api.delete<any>(`/api/admin/equipment/${id}`)
}

export function apiAdminLands(params?: { search?: string; wilaya?: string; goal?: string; status?: string; page?: number }) {
  const q = new URLSearchParams()
  if (params?.search) q.set('search', params.search)
  if (params?.wilaya) q.set('wilaya', params.wilaya)
  if (params?.goal) q.set('goal', params.goal)
  if (params?.status) q.set('status', params.status)
  if (params?.page) q.set('page', String(params.page))
  return api.get<any>(`/api/admin/lands?${q}`)
}

export function apiAdminLandStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
  return api.put<any>(`/api/admin/lands/${id}/status`, { status })
}

export function apiAdminDeleteLand(id: string) {
  return api.delete<any>(`/api/admin/lands/${id}`)
}

export function apiAdminGetAutoApprove() {
  return api.get<{ crops: boolean; equipment: boolean; lands: boolean }>('/api/admin/settings/autoApprove')
}

export function apiAdminSetAutoApprove(category: 'crops' | 'equipment' | 'lands', value: boolean) {
  return api.put<{ crops: boolean; equipment: boolean; lands: boolean }>('/api/admin/settings/autoApprove', { category, value })
}

export function apiAdminFarmers(params?: { search?: string; page?: number }) {
  const q = new URLSearchParams()
  if (params?.search) q.set('search', params.search)
  if (params?.page) q.set('page', String(params.page))
  return api.get<any>(`/api/admin/farmers?${q}`)
}

export function apiAdminDeleteFarmer(id: string) {
  return api.delete<any>(`/api/admin/farmers/${id}`)
}

export function apiAdminGetConfig(type: string) {
  return api.get<any[]>(`/api/admin/config/${type}`)
}

export function apiAdminAddConfigItem(type: string, item: { key: string; labelAr: string; emoji: string }) {
  return api.post<any[]>(`/api/admin/config/${type}/items`, item)
}

export function apiAdminUpdateConfigItem(type: string, key: string, updates: any) {
  return api.put<any[]>(`/api/admin/config/${type}/items/${key}`, updates)
}

export function apiAdminDeleteConfigItem(type: string, key: string) {
  return api.delete<any[]>(`/api/admin/config/${type}/items/${key}`)
}

export function apiAdminInitDefaults(type: string) {
  return api.post<any[]>(`/api/admin/config/${type}/init-defaults`, {})
}

export function apiAdminGetCropDurations() {
  return api.get<{ key: string; labelAr: string; emoji: string; days: number }[]>('/api/admin/config/cropDurations')
}

export function apiAdminUpdateCropDuration(key: string, days: number) {
  return api.put<any>(`/api/admin/config/cropDurations/items/${key}`, { days })
}

export function apiAdminInitCropDurations() {
  return api.post<any[]>('/api/admin/config/cropDurations/init-defaults', {})
}

export function apiAdminUpdateUser(id: string, data: { name?: string; phone?: string; wilaya?: string; role?: string }) {
  return api.put<any>(`/api/admin/users/${id}`, data)
}

export function apiAdminGetGeminiKey() {
  return api.get<{ hasKey: boolean; keyPreview: string | null }>('/api/admin/settings/gemini')
}

export function apiAdminSetGeminiKey(apiKey: string) {
  return api.put<{ success: boolean; keyPreview: string }>('/api/admin/settings/gemini', { apiKey })
}

export const apiAdminGetUserBadges = (userId: string) =>
  api.get<any>(`/api/admin/users/${userId}/badges`).then(r => r.data)

export const apiAdminSetUserBadges = (userId: string, badges: string[]) =>
  api.put<any>(`/api/admin/users/${userId}/badges`, { badges }).then(r => r.data)

// ─── Content creation from admin ──────────────────────────────────────────────
export function apiAdminCreateUser(data: { name: string; phone: string; password: string; wilaya: string; commune?: string; role: string; email?: string; profileImage?: string }) {
  return api.post<any>('/api/admin/create-user', data)
}
export function apiAdminCreateCrop(data: any) {
  return api.post<any>('/api/admin/create-crop', data)
}
export function apiAdminCreateEquipment(data: any) {
  return api.post<any>('/api/admin/create-equipment', data)
}
export function apiAdminCreateLand(data: any) {
  return api.post<any>('/api/admin/create-land', data)
}
export function apiAdminGetUsersList() {
  return api.get<any[]>('/api/admin/users-list')
}
export function apiAdminGetFarmersList() {
  return api.get<any[]>('/api/admin/farmers-list')
}

// ─── Super admin ──────────────────────────────────────────────────────────────
export function apiSuperGetAdmins() {
  return api.get<any[]>('/api/admin/super/admins')
}
export function apiSuperSetAdmin(id: string, data: { isAdmin?: boolean; isSuperAdmin?: boolean }) {
  return api.put<any>(`/api/admin/super/set-admin/${id}`, data)
}
export function apiSuperDeleteAdmin(id: string) {
  return api.delete<any>(`/api/admin/super/delete-admin/${id}`)
}
export function apiSetUserAiLevel(id: string, aiLevel: 1 | 2 | 3) {
  return api.put<any>(`/api/admin/super/users/${id}/ai-level`, { aiLevel })
}

export function apiAdminGetKnowledge() {
  return api.get<any[]>('/api/knowledge')
}
export function apiAdminVerifyKnowledge(id: string) {
  return api.put<any>(`/api/knowledge/${id}/verify`, {})
}
export function apiAdminDeleteKnowledge(id: string) {
  return api.delete<any>(`/api/knowledge/${id}`)
}

export function apiLoginAsUser(id: string) {
  return api.post<{ token: string; user: any }>(`/api/admin/super/users/${id}/login-as`, {})
}
