import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Farmer, Crop, Equipment, Land, InspectionRequest, PreOrder, UserRole, FarmerReview, CROP_LABELS, CROP_EMOJIS, EQUIPMENT_CATEGORIES } from '../types'
import { setToken, clearToken, getToken } from '../api/client'
import { apiLogin, apiRegister, apiGetMe, apiUpdateProfile } from '../api/auth'
import { apiGetFarmers, apiAddFarmer, apiAddFarmerReview } from '../api/farmers'
import { apiGetCrops, apiGetMyCrops, apiAddCrop, apiUpdateCrop, apiRequestInspection, apiCreatePreOrder, apiUpdateInspectionStatus, apiUpdatePreOrderStatus } from '../api/crops'
import { apiGetEquipment, apiAddEquipment, apiUpdateEquipmentImages, apiDeleteEquipment, apiUpdateEquipment } from '../api/equipment'
import { apiGetLands, apiAddLand, apiDeleteLand, apiUpdateLand } from '../api/lands'
import { apiGetPublicConfig } from '../api/admin'

export interface ContactAnalytics {
  phone: number
  whatsapp: number
  telegram: number
  messenger: number
  tiktok: number
  inspection: number
}

interface AppState {
  currentUser: User | null
  farmers: Farmer[]
  crops: Crop[]
  equipment: Equipment[]
  lands: Land[]
  isOnline: boolean
  isSyncing: boolean
  isLoading: boolean
  pendingSyncCount: number
  contactAnalytics: ContactAnalytics
  geminiApiKey: string
  setGeminiApiKey: (key: string) => void
  cropTypeImages: Record<string, string>
  availableCropTypes: string[]
  cropTypesMeta: Record<string, { subcategory?: string; hidePlantingDate?: boolean }>
  equipmentTypeImages: Record<string, string>
  loadCropTypeImages: () => Promise<void>
  loadEquipmentTypes: () => Promise<void>
  syncData: () => Promise<void>

  // Auth
  loginByPhone: (phone: string, password: string) => Promise<'ok' | 'wrong_password' | 'not_found' | 'error'>
  register: (name: string, phone: string, password: string, wilaya: string, role: UserRole, commune: string | undefined, otp: string) => Promise<User | 'phone_taken' | 'error'>
  resetPassword: (phone: string, otp: string, newPassword: string) => Promise<'ok' | 'not_found' | 'error'>
  logout: () => void
  updateUser: (updates: Partial<Pick<User, 'name' | 'firstName' | 'lastName' | 'phone' | 'wilaya' | 'commune' | 'gpsLat' | 'gpsLng' | 'facebookUrl' | 'tiktokUrl'>>) => Promise<'ok' | 'phone_taken' | 'error'>
  rehydrateUser: () => Promise<void>
  addFarmerReview: (farmerId: string, rating: number, comment: string) => Promise<void>

  // Data actions
  fetchAll: () => Promise<void>
  addFarmer: (farmer: Omit<Farmer, 'id' | 'agentId'>) => Promise<void>
  addCrop: (crop: Omit<Crop, 'id' | 'agentId' | 'inspectionRequests' | 'preOrders' | 'isOfflinePending'>) => Promise<void>
  updateCrop: (cropId: string, updates: Partial<Pick<Crop, 'stage' | 'images' | 'videos' | 'coverMediaType' | 'description' | 'pricePerKg' | 'estimatedQuantityKg'>>) => Promise<void>
  addEquipment: (eq: Omit<Equipment, 'id' | 'createdAt'>) => Promise<void>
  updateEquipmentImages: (eqId: string, images: string[]) => Promise<void>
  updateEquipment: (eqId: string, updates: Partial<Equipment>) => Promise<void>
  addLand: (land: Omit<Land, 'id' | 'createdAt'>) => Promise<void>
  updateLand: (landId: string, updates: Partial<Land>) => Promise<void>
  deleteEquipment: (id: string) => Promise<void>
  deleteLand: (id: string) => Promise<void>
  requestInspection: (cropId: string) => Promise<void>
  requestInspectionWithDetails: (cropId: string, buyerName: string, buyerPhone: string) => Promise<void>
  createPreOrder: (cropId: string, quantityKg: number, pricePerKg: number) => Promise<void>
  updateInspectionStatus: (cropId: string, inspectionId: string, status: 'pending' | 'approved' | 'completed' | 'rejected') => Promise<void>
  updatePreOrderStatus: (cropId: string, preorderId: string, status: 'pending' | 'accepted' | 'rejected' | 'completed') => Promise<void>
  setOnline: (status: boolean) => void
  trackContact: (channel: keyof ContactAnalytics) => void
  farmerMenuOpen: boolean
  setFarmerMenuOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      farmers: [],
      crops: [],
      equipment: [],
      lands: [],
      isOnline: navigator.onLine,
      isSyncing: false,
      isLoading: false,
      pendingSyncCount: 0,
      geminiApiKey: '',
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      cropTypeImages: {},
      availableCropTypes: [],
      cropTypesMeta: {},
      equipmentTypeImages: {},
      loadCropTypeImages: async () => {
        try {
          const items = await apiGetPublicConfig('cropTypes')
          const map: Record<string, string> = {}
          const keys: string[] = []
          const meta: Record<string, { subcategory?: string; hidePlantingDate?: boolean }> = {}
          items.forEach((item: any) => {
            if (!item.isActive && item.isActive !== undefined) return
            keys.push(item.key)
            if (item.image) map[item.key] = item.image
            // Update static label/emoji maps in-place so all components pick up admin changes
            if (item.labelAr) (CROP_LABELS as Record<string, string>)[item.key] = item.labelAr
            if (item.emoji) (CROP_EMOJIS as Record<string, string>)[item.key] = item.emoji
            meta[item.key] = { subcategory: item.subcategory, hidePlantingDate: item.hidePlantingDate }
          })
          set({ cropTypeImages: map, availableCropTypes: keys, cropTypesMeta: meta })
        } catch {}
      },
      loadEquipmentTypes: async () => {
        try {
          const items = await apiGetPublicConfig('equipmentTypes')
          const labels: string[] = []
          const imgMap: Record<string, string> = {}
          items.forEach((item: any) => {
            if (!item.isActive && item.isActive !== undefined) return
            if (item.labelAr) {
              labels.push(item.labelAr)
              if (item.image) imgMap[item.labelAr] = item.image
            }
          })
          if (labels.length > 0) {
            EQUIPMENT_CATEGORIES.splice(0, EQUIPMENT_CATEGORIES.length, ...labels as any)
          }
          set({ equipmentTypeImages: imgMap })
        } catch {}
      },
      contactAnalytics: { phone: 0, whatsapp: 0, telegram: 0, messenger: 0, tiktok: 0, inspection: 0 },
      _analyticsMonth: new Date().getMonth(),

      // ── Auth ────────────────────────────────────────────────────────────

      loginByPhone: async (phone, password) => {
        try {
          const { user, token } = await apiLogin(phone, password)
          setToken(token)
          set({ currentUser: user })
          get().fetchAll() // fire and forget — don't block navigation
          return 'ok'
        } catch (e: any) {
          const msg = e.message || 'error'
          if (msg.includes('غير مسجل')) return 'not_found'
          if (msg.includes('غير صحيحة')) return 'wrong_password'
          return msg
        }
      },

      register: async (name, phone, password, wilaya, role, commune, otp) => {
        try {
          const { user, token } = await apiRegister(name, phone, password, wilaya, role, commune, otp)
          setToken(token)
          set({ currentUser: user })
          get().fetchAll() // fire and forget
          return user
        } catch (e: any) {
          const msg = e.message || 'error'
          if (msg.includes('مستخدم مسبقاً')) return 'phone_taken'
          return msg
        }
      },

      resetPassword: async (phone, otp, newPassword) => {
        const { apiResetPassword } = await import('../api/auth')
        try {
          await apiResetPassword(phone, otp, newPassword)
          return 'ok'
        } catch (e: any) {
          const msg = e.message || ''
          if (msg.includes('غير مسجل')) return 'not_found'
          return 'error'
        }
      },

      logout: () => {
        clearToken()
        set({ currentUser: null, farmers: [], crops: [], equipment: [], lands: [] })
      },

      updateUser: async (updates) => {
        try {
          const user = await apiUpdateProfile(updates)
          set({ currentUser: user })
          return 'ok'
        } catch (e: any) {
          const msg = e.message || ''
          if (msg.includes('مستخدم مسبقاً')) return 'phone_taken'
          return 'error'
        }
      },

      rehydrateUser: async () => {
        const token = getToken()
        if (!token) return
        try {
          const user = await apiGetMe()
          set({ currentUser: user })
          await get().fetchAll()
        } catch {
          clearToken()
          set({ currentUser: null })
        }
      },

      addFarmerReview: async (farmerId, rating, comment) => {
        await apiAddFarmerReview(farmerId, rating, comment)
        // Refresh farmers list to show new review
        const farmers = await apiGetFarmers()
        set({ farmers })
      },

      // ── Data ─────────────────────────────────────────────────────────────

      fetchAll: async () => {
        set({ isLoading: true })
        try {
          const user = get().currentUser
          const isAgentOrFarmer = user?.role === 'agent' || user?.role === 'farmer'

          const results = await Promise.allSettled([
            apiGetFarmers(),
            apiGetCrops(),
            isAgentOrFarmer ? apiGetMyCrops() : Promise.resolve([]),
            apiGetEquipment(),
            apiGetLands(),
          ])

          const get_ = <T>(r: PromiseSettledResult<T>, fallback: T): T =>
            r.status === 'fulfilled' ? r.value : fallback

          const farmers  = get_(results[0], []) as Farmer[]
          const allCrops = get_(results[1], []) as Crop[]
          const myCrops  = get_(results[2], []) as Crop[]
          const equipment = get_(results[3], []) as Equipment[]
          const lands    = get_(results[4], []) as Land[]

          // Merge: all approved crops + user's own crops (even if pending)
          const mergedCropsMap = new Map<string, Crop>()
          allCrops.forEach(c => mergedCropsMap.set(c.id, c))
          myCrops.forEach(c => mergedCropsMap.set(c.id, c))

          set({ farmers, crops: Array.from(mergedCropsMap.values()), equipment, lands })
        } catch (err) {
          console.error('fetchAll error:', err)
        } finally {
          set({ isLoading: false })
        }
      },

      addFarmer: async (farmerData) => {
        const newFarmer = await apiAddFarmer(farmerData as any)
        set(state => ({ farmers: [...state.farmers, newFarmer] }))
      },

      addCrop: async (cropData) => {
        const newCrop = await apiAddCrop(cropData as any)
        set(state => ({ crops: [...state.crops, newCrop] }))
      },

      updateCrop: async (cropId, updates) => {
        const updated = await apiUpdateCrop(cropId, updates)
        set(state => ({
          crops: state.crops.map(c => c.id === cropId ? { ...c, ...updated } : c)
        }))
      },

      addEquipment: async (eqData) => {
        const newEq = await apiAddEquipment(eqData as any)
        set(state => ({ equipment: [...state.equipment, newEq] }))
      },

      updateEquipmentImages: async (eqId, images) => {
        await apiUpdateEquipmentImages(eqId, images)
        set(state => ({
          equipment: state.equipment.map(e => e.id === eqId ? { ...e, images } : e)
        }))
      },

      updateEquipment: async (eqId, updates) => {
        const updated = await apiUpdateEquipment(eqId, updates)
        set(state => ({
          equipment: state.equipment.map(e => e.id === eqId ? { ...e, ...updated } : e)
        }))
      },

      addLand: async (landData) => {
        const newLand = await apiAddLand(landData as any)
        set(state => ({ lands: [...state.lands, newLand] }))
      },

      updateLand: async (landId, updates) => {
        const updated = await apiUpdateLand(landId, updates)
        set(state => ({
          lands: state.lands.map(l => l.id === landId ? { ...l, ...updated } : l)
        }))
      },

      deleteEquipment: async (id) => {
        await apiDeleteEquipment(id)
        set(state => ({ equipment: state.equipment.filter(e => e.id !== id) }))
      },

      deleteLand: async (id) => {
        await apiDeleteLand(id)
        set(state => ({ lands: state.lands.filter(l => l.id !== id) }))
      },

      requestInspection: async (cropId) => {
        const user = get().currentUser
        if (!user) return
        await apiRequestInspection(cropId)
        await get().fetchAll()
      },

      requestInspectionWithDetails: async (cropId, buyerName, buyerPhone) => {
        await apiRequestInspection(cropId, buyerName, buyerPhone)
        set(state => ({
          contactAnalytics: {
            ...state.contactAnalytics,
            inspection: state.contactAnalytics.inspection + 1,
          },
        }))
        await get().fetchAll()
      },

      createPreOrder: async (cropId, quantityKg, pricePerKg) => {
        await apiCreatePreOrder(cropId, quantityKg, pricePerKg)
        await get().fetchAll()
      },

      updateInspectionStatus: async (cropId, inspectionId, status) => {
        await apiUpdateInspectionStatus(cropId, inspectionId, status)
        await get().fetchAll()
      },

      updatePreOrderStatus: async (cropId, preorderId, status) => {
        await apiUpdatePreOrderStatus(cropId, preorderId, status)
        await get().fetchAll()
      },

      farmerMenuOpen: false,
      setFarmerMenuOpen: (open) => set({ farmerMenuOpen: open }),

      trackContact: (channel) => {
        const currentMonth = new Date().getMonth()
        set(state => {
          const reset = (state as any)._analyticsMonth !== currentMonth
          return {
            _analyticsMonth: currentMonth,
            contactAnalytics: reset
              ? { phone: 0, whatsapp: 0, telegram: 0, messenger: 0, tiktok: 0, inspection: 0, [channel]: 1 }
              : { ...state.contactAnalytics, [channel]: state.contactAnalytics[channel] + 1 },
          }
        })
      },

      syncData: async () => {
        const state = get()
        if (!state.isOnline) return
        set({ isSyncing: true })
        try {
          await state.fetchAll()
          set({ pendingSyncCount: 0 })
        } finally {
          set({ isSyncing: false })
        }
      },

      setOnline: (status) => {
        set({ isOnline: status })
        if (status) get().fetchAll()
      },
    }),
    {
      name: 'mantoudj-bladi-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        contactAnalytics: state.contactAnalytics,
        _analyticsMonth: (state as any)._analyticsMonth,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
)

// Listen for online/offline
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useAppStore.getState().setOnline(true))
  window.addEventListener('offline', () => useAppStore.getState().setOnline(false))
}
