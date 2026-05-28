import React from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { OfflineBanner } from '../Shared/OfflineBanner'

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-sage-50 max-w-md mx-auto relative shadow-xl">
      <OfflineBanner />
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
