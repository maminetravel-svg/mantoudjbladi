import React, { useEffect } from 'react'
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/appStore'
import { AppShell } from './components/Layout/AppShell'
import { syncManager } from './utils/syncManager'
import { ToastContainer } from './components/Shared/Toast'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import AgentDashboard from './pages/agent/AgentDashboard'
import AddFarmer from './pages/agent/AddFarmer'
import AddCrop from './pages/agent/AddCrop'
import MyContracts from './pages/agent/MyContracts'
import AgentFarmersList from './pages/agent/AgentFarmersList'
import AgentMarketplace from './pages/agent/AgentMarketplace'
import AgentFarmerProfile from './pages/agent/AgentFarmerProfile'
import AgentEditFarmer from './pages/agent/AgentEditFarmer'
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import CropMap from './pages/buyer/CropMap'
import CropDetail from './pages/buyer/CropDetail'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import FarmerAI from './pages/farmer/FarmerAI'
import Settings from './pages/shared/Settings'
import UserProfile from './pages/shared/UserProfile'
import MyRequests from './pages/buyer/MyRequests'

// Shared pages
import EquipmentList from './pages/shared/EquipmentList'
import AddEquipment from './pages/shared/AddEquipment'
import EditEquipment from './pages/shared/EditEquipment'
import LandList from './pages/shared/LandList'
import AddLand from './pages/shared/AddLand'
import EditLand from './pages/shared/EditLand'
import EquipmentDetail from './pages/shared/EquipmentDetail'
import LandDetail from './pages/shared/LandDetail'
import EditCrop from './pages/shared/EditCrop'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminGuard from './pages/admin/AdminGuard'
import AdminLogin from './pages/admin/AdminLogin'
import { AdminReturnBar } from './components/Shared/AdminReturnBar'

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { currentUser } = useAppStore()

  if (!currentUser) return <Navigate to="/" replace />
  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect to their own dashboard
    if (currentUser.role === 'agent') return <Navigate to="/agent" replace />
    if (currentUser.role === 'buyer') return <Navigate to="/buyer" replace />
    if (currentUser.role === 'farmer') return <Navigate to="/farmer" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { currentUser, rehydrateUser, loadCropTypeImages, loadEquipmentTypes } = useAppStore()

  useEffect(() => {
    rehydrateUser()
    loadCropTypeImages()
    loadEquipmentTypes()
    syncManager.start()
    return () => syncManager.stop()
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate
              to={currentUser.role === 'agent' ? '/agent' : currentUser.role === 'buyer' ? '/buyer' : '/farmer'}
              replace
            />
          ) : (
            <Login />
          )
        }
      />
      <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <Register />} />

      {/* Agent routes */}
      <Route element={<ProtectedRoute requiredRole="agent"><AppShell /></ProtectedRoute>}>
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/agent/add-farmer" element={<AddFarmer />} />
        <Route path="/agent/add-crop" element={<AddCrop />} />
        <Route path="/agent/edit-crop/:id" element={<EditCrop />} />
        <Route path="/agent/crop/:id" element={<CropDetail />} />
        <Route path="/agent/contracts" element={<MyContracts />} />
        <Route path="/agent/farmers" element={<AgentFarmersList />} />
        <Route path="/agent/farmers/:farmerId" element={<AgentFarmerProfile />} />
        <Route path="/agent/edit-farmer/:farmerId" element={<AgentEditFarmer />} />
        <Route path="/agent/marketplace" element={<AgentMarketplace />} />
        <Route path="/agent/equipment" element={<EquipmentList />} />
        <Route path="/agent/equipment/:id" element={<EquipmentDetail />} />
        <Route path="/agent/equipment/add" element={<AddEquipment />} />
        <Route path="/agent/add-equipment" element={<AddEquipment />} />
        <Route path="/agent/edit-equipment/:id" element={<EditEquipment />} />
        <Route path="/agent/lands" element={<LandList />} />
        <Route path="/agent/lands/:id" element={<LandDetail />} />
        <Route path="/agent/lands/add" element={<AddLand />} />
        <Route path="/agent/add-land" element={<AddLand />} />
        <Route path="/agent/edit-land/:id" element={<EditLand />} />
        <Route path="/agent/map" element={<CropMap />} />
        <Route path="/agent/ai" element={<FarmerAI />} />
      </Route>

      {/* Buyer routes */}
      <Route element={<ProtectedRoute requiredRole="buyer"><AppShell /></ProtectedRoute>}>
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/buyer/map" element={<CropMap />} />
        <Route path="/buyer/crop/:id" element={<CropDetail />} />
        <Route path="/buyer/equipment" element={<EquipmentList />} />
        <Route path="/buyer/equipment/:id" element={<EquipmentDetail />} />
        <Route path="/buyer/add-equipment" element={<AddEquipment />} />
        <Route path="/buyer/edit-equipment/:id" element={<EditEquipment />} />
        <Route path="/buyer/lands" element={<LandList />} />
        <Route path="/buyer/lands/:id" element={<LandDetail />} />
        <Route path="/buyer/add-land" element={<AddLand />} />
        <Route path="/buyer/edit-land/:id" element={<EditLand />} />
        <Route path="/buyer/requests" element={<MyRequests />} />
        <Route path="/buyer/ai" element={<FarmerAI />} />
      </Route>

      {/* Farmer routes */}
      <Route element={<ProtectedRoute requiredRole="farmer"><AppShell /></ProtectedRoute>}>
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/farmer/add-crop" element={<AddCrop />} />
        <Route path="/farmer/edit-crop/:id" element={<EditCrop />} />
        <Route path="/farmer/crop/:id" element={<CropDetail />} />
        <Route path="/farmer/map" element={<CropMap />} />
        <Route path="/farmer/equipment" element={<EquipmentList />} />
        <Route path="/farmer/equipment/:id" element={<EquipmentDetail />} />
        <Route path="/farmer/add-equipment" element={<AddEquipment />} />
        <Route path="/farmer/edit-equipment/:id" element={<EditEquipment />} />
        <Route path="/farmer/lands" element={<LandList />} />
        <Route path="/farmer/lands/:id" element={<LandDetail />} />
        <Route path="/farmer/add-land" element={<AddLand />} />
        <Route path="/farmer/edit-land/:id" element={<EditLand />} />
        <Route path="/farmer/ai" element={<FarmerAI />} />
        <Route path="/farmer/market" element={<BuyerDashboard />} />
        <Route path="/farmer/market/:id" element={<CropDetail />} />
        <Route path="/farmer/settings" element={<Settings />} />
      </Route>

      {/* Buyer settings */}
      <Route element={<ProtectedRoute requiredRole="buyer"><AppShell /></ProtectedRoute>}>
        <Route path="/buyer/settings" element={<Settings />} />
      </Route>

      {/* Agent settings */}
      <Route element={<ProtectedRoute requiredRole="agent"><AppShell /></ProtectedRoute>}>
        <Route path="/agent/settings" element={<Settings />} />
      </Route>

      {/* Farmer public profile - accessible to all logged-in users */}
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Route>

      {/* Admin - no AppShell (web layout) */}
      <Route path="/app-admin/login" element={<AdminLogin />} />
      <Route path="/app-admin" element={<ProtectedRoute><AdminGuard><AdminDashboard /></AdminGuard></ProtectedRoute>} />
      <Route path="/app-admin/edit-equipment/:id" element={<ProtectedRoute><AdminGuard><EditEquipment /></AdminGuard></ProtectedRoute>} />
      <Route path="/app-admin/edit-land/:id" element={<ProtectedRoute><AdminGuard><EditLand /></AdminGuard></ProtectedRoute>} />
      <Route path="/app-admin/edit-crop/:id" element={<ProtectedRoute><AdminGuard><EditCrop /></AdminGuard></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const isCapacitor = import.meta.env.VITE_CAPACITOR === 'true'
const Router = isCapacitor ? HashRouter : BrowserRouter

export default function App() {
  return (
    <Router>
      <AppRoutes />
      <ToastContainer />
      <AdminReturnBar />
    </Router>
  )
}
