import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getToken, setToken, clearToken, TOKEN_KEY } from '../../api/client'

// ─────────────────────────────────────────────────────────────
// Token management
// ─────────────────────────────────────────────────────────────
describe('Token management', () => {
  it('getToken يرجع null إذا لم يكن هناك token', () => {
    expect(getToken()).toBeNull()
  })

  it('setToken يحفظ الـ token في localStorage', () => {
    setToken('my_test_token')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('my_test_token')
  })

  it('getToken يرجع الـ token المحفوظ', () => {
    setToken('abc123')
    expect(getToken()).toBe('abc123')
  })

  it('clearToken يمسح الـ token من localStorage', () => {
    setToken('abc123')
    clearToken()
    expect(getToken()).toBeNull()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────
// api.get / api.post — مع fetch mocking
// ─────────────────────────────────────────────────────────────
describe('api client requests', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    mockFetch.mockReset()
  })

  function mockResponse(data: unknown, status = 200) {
    mockFetch.mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      json: async () => data,
    })
  }

  it('api.get يرسل طلب GET مع Authorization header عند وجود token', async () => {
    const { api } = await import('../../api/client')
    setToken('test_token')
    mockResponse({ data: 'hello' })

    await api.get('/api/test')

    expect(mockFetch).toHaveBeenCalledOnce()
    const [, options] = mockFetch.mock.calls[0]
    expect(options.method).toBeUndefined() // GET افتراضي
    expect(options.headers['Authorization']).toBe('Bearer test_token')
  })

  it('api.get يرسل بدون Authorization إذا لا يوجد token', async () => {
    const { api } = await import('../../api/client')
    clearToken()
    mockResponse([])

    await api.get('/api/test')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBeUndefined()
  })

  it('api.post يرسل البيانات كـ JSON', async () => {
    const { api } = await import('../../api/client')
    mockResponse({ id: '1' }, 201)

    await api.post('/api/test', { name: 'test' })

    const [, options] = mockFetch.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(options.body).toBe(JSON.stringify({ name: 'test' }))
    expect(options.headers['Content-Type']).toBe('application/json')
  })

  it('يرمي خطأ عند status غير 2xx', async () => {
    const { api } = await import('../../api/client')
    mockResponse({ error: 'غير مصرح' }, 401)

    await expect(api.get('/api/protected')).rejects.toThrow('غير مصرح')
  })

  it('api.put يرسل PUT request', async () => {
    const { api } = await import('../../api/client')
    mockResponse({ updated: true })

    await api.put('/api/items/1', { name: 'new' })

    const [, options] = mockFetch.mock.calls[0]
    expect(options.method).toBe('PUT')
  })

  it('api.delete يرسل DELETE request', async () => {
    const { api } = await import('../../api/client')
    mockResponse({ deleted: true })

    await api.delete('/api/items/1')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.method).toBe('DELETE')
  })
})
