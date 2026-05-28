import { api } from './client'
import { User, UserRole } from '../types'

export interface AuthResponse {
  user: User
  token: string
}

export function apiLogin(phone: string, password: string) {
  return api.post<AuthResponse>('/api/auth/login', { phone, password })
}

export function apiSendRegisterOtp(phone: string) {
  return api.post<{ message: string }>('/api/auth/send-register-otp', { phone })
}

export function apiRegister(name: string, phone: string, password: string, wilaya: string, role: UserRole, commune: string | undefined, otp: string) {
  return api.post<AuthResponse>('/api/auth/register', { name, phone, password, wilaya, role, commune, otp })
}

export function apiForgotPassword(phone: string) {
  return api.post<{ message: string }>('/api/auth/forgot-password', { phone })
}

export function apiResetPassword(phone: string, otp: string, newPassword: string) {
  return api.post<{ message: string }>('/api/auth/reset-password', { phone, otp, newPassword })
}

export function apiGetMe() {
  return api.get<User>('/api/auth/me')
}

export function apiUpdateProfile(updates: Partial<Pick<User, 'name' | 'firstName' | 'lastName' | 'phone' | 'wilaya' | 'commune' | 'gpsLat' | 'gpsLng'>>) {
  return api.put<User>('/api/users/me', updates)
}

export function apiGetUserProfile(id: string) {
  return api.get<any>(`/api/users/${id}`)
}

export function apiAddUserReview(userId: string, rating: number, comment: string) {
  return api.post(`/api/users/${userId}/reviews`, { rating, comment })
}

export function apiAddFarmerRecordReview(farmerId: string, rating: number, comment: string) {
  return api.post(`/api/farmers/${farmerId}/reviews`, { rating, comment })
}
