import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

function mockFetchOnce(data: unknown, status = 200) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  }))
}

afterEach(() => vi.unstubAllGlobals())

describe('apiGetCrops', () => {
  it('يرسل طلب GET بدون فلاتر', async () => {
    mockFetchOnce([])
    const { apiGetCrops } = await import('../../api/crops')
    const result = await apiGetCrops()
    expect(Array.isArray(result)).toBe(true)
    const [url] = (fetch as any).mock.calls[0]
    expect(url).toContain('/api/crops')
    expect(url).not.toContain('?')
  })

  it('يضيف query params عند تمرير فلاتر', async () => {
    mockFetchOnce([])
    const { apiGetCrops } = await import('../../api/crops')
    await apiGetCrops({ wilaya: 'الجزائر', type: 'tomato' })
    const [url] = (fetch as any).mock.calls[0]
    expect(url).toContain('wilaya=%D8%A7%D9%84%D8%AC%D8%B2%D8%A7%D8%A6%D8%B1')
    expect(url).toContain('type=tomato')
  })
})

describe('apiAddCrop', () => {
  it('يرسل POST مع البيانات الصحيحة', async () => {
    const mockCrop = { id: '1', type: 'tomato' }
    mockFetchOnce(mockCrop, 201)
    const { apiAddCrop } = await import('../../api/crops')
    const cropData: any = {
      farmerId: 'f1', type: 'tomato', plantingDate: '2026-01-01',
      estimatedQuantityKg: 500, wilaya: 'الجزائر', stage: 'seeds',
      images: [], isOfflinePending: false, gpsLat: 0, gpsLng: 0,
      inspectionRequests: [], preOrders: [],
    }
    const result = await apiAddCrop(cropData)
    expect(result).toEqual(mockCrop)
  })
})

describe('apiRequestInspection', () => {
  it('يرسل POST مع buyerName و buyerPhone', async () => {
    mockFetchOnce({ message: 'تم الإرسال' }, 201)
    const { apiRequestInspection } = await import('../../api/crops')
    await apiRequestInspection('crop1', 'أحمد', '0551234567')
    const [url, opts] = (fetch as any).mock.calls[0]
    expect(url).toContain('/api/crops/crop1/inspection')
    const body = JSON.parse(opts.body)
    expect(body.buyerName).toBe('أحمد')
    expect(body.buyerPhone).toBe('0551234567')
  })
})

describe('apiCreatePreOrder', () => {
  it('يرسل POST مع الكمية والسعر', async () => {
    mockFetchOnce({ message: 'تم' }, 201)
    const { apiCreatePreOrder } = await import('../../api/crops')
    await apiCreatePreOrder('crop1', 200, 75)
    const [url, opts] = (fetch as any).mock.calls[0]
    expect(url).toContain('/api/crops/crop1/preorder')
    const body = JSON.parse(opts.body)
    expect(body.quantityKg).toBe(200)
    expect(body.pricePerKg).toBe(75)
  })
})

describe('apiUpdateInspectionStatus', () => {
  it('يرسل PUT مع الحالة الصحيحة', async () => {
    mockFetchOnce({ status: 'approved' })
    const { apiUpdateInspectionStatus } = await import('../../api/crops')
    await apiUpdateInspectionStatus('crop1', 'insp1', 'approved')
    const [url, opts] = (fetch as any).mock.calls[0]
    expect(url).toContain('/api/crops/crop1/inspection/insp1')
    expect(opts.method).toBe('PUT')
    const body = JSON.parse(opts.body)
    expect(body.status).toBe('approved')
  })
})

describe('apiUpdatePreOrderStatus', () => {
  it('يقبل الحالات: pending, accepted, rejected, completed', async () => {
    for (const status of ['pending', 'accepted', 'rejected', 'completed'] as const) {
      mockFetchOnce({ status })
      const { apiUpdatePreOrderStatus } = await import('../../api/crops')
      await apiUpdatePreOrderStatus('crop1', 'order1', status)
      const [, opts] = (fetch as any).mock.calls[0]
      const body = JSON.parse(opts.body)
      expect(body.status).toBe(status)
      vi.unstubAllGlobals()
    }
  })
})
