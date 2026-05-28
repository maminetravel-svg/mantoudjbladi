import { api } from './client'
import type { AgentFarmer, ConnectionRequest } from '../types'

// ─── قائمة الفلاحين ────────────────────────────────────────────────────────

export const getMyFarmers = () =>
  api.get<AgentFarmer[]>('/api/agent-management/farmers')

export const toggleFarmerActive = (farmerId: string) =>
  api.put<{ isActiveForAgent: boolean }>(`/api/agent-management/farmers/${farmerId}/toggle`)

export const updateFarmerInfo = (farmerId: string, data: Partial<AgentFarmer>) =>
  api.put<AgentFarmer>(`/api/agent-management/farmers/${farmerId}`, data)

export const deleteFarmer = (farmerId: string) =>
  api.delete<{ message: string }>(`/api/agent-management/farmers/${farmerId}`)

export const getFarmerProfile = (farmerId: string) =>
  api.get<{ farmer: AgentFarmer; crops: any[]; equipment: any[]; lands: any[] }>(
    `/api/agent-management/farmers/${farmerId}/profile`
  )

// ─── طلبات الربط ───────────────────────────────────────────────────────────

export const sendConnectRequest = (farmerUserId: string) =>
  api.post<ConnectionRequest>('/api/agent-management/connect-request', { farmerUserId })

export const getPendingConnections = () =>
  api.get<ConnectionRequest[]>('/api/agent-management/pending-connections')

export const acceptConnection = (requestId: string) =>
  api.put<{ message: string }>(`/api/agent-management/connections/${requestId}/accept`)

export const rejectConnection = (requestId: string) =>
  api.put<{ message: string }>(`/api/agent-management/connections/${requestId}/reject`)

export const disconnectFarmer = (farmerId: string) =>
  api.delete<{ message: string }>(`/api/agent-management/disconnect/${farmerId}`)

// ─── محاصيل الفلاح (تشمل قيد الانتظار) ────────────────────────────────────

export const getMyCrops = () =>
  api.get<any[]>('/api/crops/my-crops')
