import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppStore()

  if (!currentUser) return <Navigate to="/app-admin/login" replace />
  if (!(currentUser as any).isAdmin) return <Navigate to="/app-admin/login" replace />

  return <>{children}</>
}
