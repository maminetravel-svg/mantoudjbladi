import '@testing-library/jest-dom'

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', { value: true, writable: true })

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Reset localStorage before each test
beforeEach(() => {
  localStorageMock.clear()
})

// Suppress console errors in tests
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  vi.restoreAllMocks()
})
