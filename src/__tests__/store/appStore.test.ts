import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'

// Mock all API modules
vi.mock('../../api/auth', () => ({
  apiLogin: vi.fn(),
  apiRegister: vi.fn(),
  apiResetPassword: vi.fn(),
  apiGetMe: vi.fn(),
  apiUpdateProfile: vi.fn(),
}))

vi.mock('../../api/crops', () => ({
  apiGetCrops: vi.fn().mockResolvedValue([]),
  apiAddCrop: vi.fn(),
  apiUpdateCrop: vi.fn(),
  apiRequestInspection: vi.fn(),
  apiCreatePreOrder: vi.fn(),
  apiUpdateInspectionStatus: vi.fn(),
  apiUpdatePreOrderStatus: vi.fn(),
}))

vi.mock('../../api/equipment', () => ({
  apiGetEquipment: vi.fn().mockResolvedValue([]),
  apiAddEquipment: vi.fn(),
  apiUpdateEquipmentImages: vi.fn(),
  apiDeleteEquipment: vi.fn(),
  apiUpdateEquipment: vi.fn(),
}))

vi.mock('../../api/lands', () => ({
  apiGetLands: vi.fn().mockResolvedValue([]),
  apiAddLand: vi.fn(),
  apiDeleteLand: vi.fn(),
  apiUpdateLand: vi.fn(),
}))

vi.mock('../../api/farmers', () => ({
  apiGetFarmers: vi.fn().mockResolvedValue([]),
  apiAddFarmer: vi.fn(),
  apiAddFarmerReview: vi.fn(),
}))

vi.mock('../../api/client', () => ({
  setToken: vi.fn(),
  clearToken: vi.fn(),
  getToken: vi.fn().mockReturnValue(null),
  TOKEN_KEY: 'mb_token',
}))

// ─────────────────────────────────────────────────────────────
// Auth: login
// ─────────────────────────────────────────────────────────────
describe('loginByPhone', () => {
  beforeEach(async () => {
    // Reset store state
    const { useAppStore } = await import('../../store/appStore')
    useAppStore.setState({ currentUser: null, crops: [], equipment: [], lands: [], farmers: [] })
  })

  it('يسجّل الدخول بنجاح ويحفظ المستخدم', async () => {
    const { apiLogin } = await import('../../api/auth')
    const mockUser = { id: 'u1', name: 'أحمد', role: 'agent', wilaya: 'الجزائر', trustScore: 0, dealsCount: 0 }
    vi.mocked(apiLogin).mockResolvedValueOnce({ user: mockUser, token: 'jwt_token' })

    const { useAppStore } = await import('../../store/appStore')
    const { result } = renderHook(() => useAppStore())

    let loginResult: string
    await act(async () => {
      loginResult = await result.current.loginByPhone('0551234567', 'password')
    })

    expect(loginResult!).toBe('ok')
    expect(result.current.currentUser?.name).toBe('أحمد')
  })

  it('يرجع not_found إذا كان الهاتف غير مسجل', async () => {
    const { apiLogin } = await import('../../api/auth')
    vi.mocked(apiLogin).mockRejectedValueOnce(new Error('رقم الهاتف غير مسجل'))

    const { useAppStore } = await import('../../store/appStore')
    const { result } = renderHook(() => useAppStore())

    let loginResult: string
    await act(async () => {
      loginResult = await result.current.loginByPhone('0999999999', 'wrong')
    })
    expect(loginResult!).toBe('not_found')
  })

  it('يرجع wrong_password إذا كانت كلمة المرور خاطئة', async () => {
    const { apiLogin } = await import('../../api/auth')
    vi.mocked(apiLogin).mockRejectedValueOnce(new Error('كلمة المرور غير صحيحة'))

    const { useAppStore } = await import('../../store/appStore')
    const { result } = renderHook(() => useAppStore())

    let loginResult: string
    await act(async () => {
      loginResult = await result.current.loginByPhone('0551111111', 'wrong')
    })
    expect(loginResult!).toBe('wrong_password')
  })
})

// ─────────────────────────────────────────────────────────────
// Auth: logout
// ─────────────────────────────────────────────────────────────
describe('logout', () => {
  it('يمسح بيانات المستخدم والمحتوى من الـ store', async () => {
    const { useAppStore } = await import('../../store/appStore')
    useAppStore.setState({
      currentUser: { id: 'u1', name: 'test', role: 'agent', wilaya: 'الجزائر', trustScore: 0, dealsCount: 0 },
      crops: [{ id: 'c1' } as any],
      equipment: [{ id: 'e1' } as any],
    })

    const { result } = renderHook(() => useAppStore())
    act(() => { result.current.logout() })

    expect(result.current.currentUser).toBeNull()
    expect(result.current.crops).toHaveLength(0)
    expect(result.current.equipment).toHaveLength(0)
    expect(result.current.lands).toHaveLength(0)
  })
})

// ─────────────────────────────────────────────────────────────
// Contact Analytics: trackContact
// ─────────────────────────────────────────────────────────────
describe('trackContact', () => {
  it('يزيد عداد القناة المختارة بـ 1', async () => {
    const { useAppStore } = await import('../../store/appStore')
    useAppStore.setState({ contactAnalytics: { phone: 0, whatsapp: 0, telegram: 0, messenger: 0, tiktok: 0, inspection: 0 } })

    const { result } = renderHook(() => useAppStore())
    act(() => { result.current.trackContact('whatsapp') })
    expect(result.current.contactAnalytics.whatsapp).toBe(1)

    act(() => { result.current.trackContact('whatsapp') })
    expect(result.current.contactAnalytics.whatsapp).toBe(2)
  })

  it('لا يؤثر على القنوات الأخرى', async () => {
    const { useAppStore } = await import('../../store/appStore')
    useAppStore.setState({ contactAnalytics: { phone: 5, whatsapp: 0, telegram: 0, messenger: 0, tiktok: 0, inspection: 0 } })

    const { result } = renderHook(() => useAppStore())
    act(() => { result.current.trackContact('telegram') })
    expect(result.current.contactAnalytics.phone).toBe(5)
    expect(result.current.contactAnalytics.telegram).toBe(1)
  })
})

// ─────────────────────────────────────────────────────────────
// Data: updateCrop
// ─────────────────────────────────────────────────────────────
describe('updateCrop', () => {
  it('يحدّث المحصول في الـ store', async () => {
    const { apiUpdateCrop } = await import('../../api/crops')
    const updatedCrop = { id: 'c1', type: 'tomato', stage: 'ready', pricePerKg: 100 }
    vi.mocked(apiUpdateCrop).mockResolvedValueOnce(updatedCrop as any)

    const { useAppStore } = await import('../../store/appStore')
    useAppStore.setState({
      crops: [{ id: 'c1', type: 'tomato', stage: 'seeds', pricePerKg: 50 } as any],
    })

    const { result } = renderHook(() => useAppStore())
    await act(async () => {
      await result.current.updateCrop('c1', { stage: 'ready', pricePerKg: 100 })
    })

    const crop = result.current.crops.find(c => c.id === 'c1')
    expect(crop?.stage).toBe('ready')
    expect(crop?.pricePerKg).toBe(100)
  })
})

// ─────────────────────────────────────────────────────────────
// Data: addEquipment
// ─────────────────────────────────────────────────────────────
describe('addEquipment', () => {
  it('يضيف المعدة للـ store', async () => {
    const { apiAddEquipment } = await import('../../api/equipment')
    const newEq = { id: 'e1', name: 'جرار', category: 'جرارات' }
    vi.mocked(apiAddEquipment).mockResolvedValueOnce(newEq as any)

    const { useAppStore } = await import('../../store/appStore')
    useAppStore.setState({ equipment: [] })

    const { result } = renderHook(() => useAppStore())
    await act(async () => {
      await result.current.addEquipment(newEq as any)
    })

    expect(result.current.equipment).toHaveLength(1)
    expect(result.current.equipment[0].name).toBe('جرار')
  })
})

// ─────────────────────────────────────────────────────────────
// Data: deleteEquipment
// ─────────────────────────────────────────────────────────────
describe('deleteEquipment', () => {
  it('يحذف المعدة من الـ store', async () => {
    const { apiDeleteEquipment } = await import('../../api/equipment')
    vi.mocked(apiDeleteEquipment).mockResolvedValueOnce({} as any)

    const { useAppStore } = await import('../../store/appStore')
    useAppStore.setState({
      equipment: [
        { id: 'e1', name: 'جرار 1' } as any,
        { id: 'e2', name: 'جرار 2' } as any,
      ],
    })

    const { result } = renderHook(() => useAppStore())
    await act(async () => {
      await result.current.deleteEquipment('e1')
    })

    expect(result.current.equipment).toHaveLength(1)
    expect(result.current.equipment[0].id).toBe('e2')
  })
})

// ─────────────────────────────────────────────────────────────
// Data: deleteLand
// ─────────────────────────────────────────────────────────────
describe('deleteLand', () => {
  it('يحذف الأرض من الـ store', async () => {
    const { apiDeleteLand } = await import('../../api/lands')
    vi.mocked(apiDeleteLand).mockResolvedValueOnce({} as any)

    const { useAppStore } = await import('../../store/appStore')
    useAppStore.setState({
      lands: [
        { id: 'l1', area: 5 } as any,
        { id: 'l2', area: 10 } as any,
      ],
    })

    const { result } = renderHook(() => useAppStore())
    await act(async () => {
      await result.current.deleteLand('l1')
    })

    expect(result.current.lands).toHaveLength(1)
    expect(result.current.lands[0].id).toBe('l2')
  })
})

// ─────────────────────────────────────────────────────────────
// Gemini API Key
// ─────────────────────────────────────────────────────────────
describe('setGeminiApiKey', () => {
  it('يحفظ مفتاح Gemini في الـ store', async () => {
    const { useAppStore } = await import('../../store/appStore')
    useAppStore.setState({ geminiApiKey: '' })

    const { result } = renderHook(() => useAppStore())
    act(() => { result.current.setGeminiApiKey('my_gemini_key_123') })
    expect(result.current.geminiApiKey).toBe('my_gemini_key_123')
  })
})
