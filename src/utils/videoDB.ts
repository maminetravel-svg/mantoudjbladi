// IndexedDB storage for large video data
// Videos are stored separately from Zustand/localStorage to avoid size limits

const DB_NAME = 'mantoudj-videos'
const STORE_NAME = 'videos'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveVideo(key: string, base64: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(base64, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function loadVideo(key: string): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(key)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function deleteVideo(key: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function saveVideos(cropId: string, videos: string[]): Promise<string[]> {
  // Save each video to IndexedDB, return array of keys (not base64)
  const keys: string[] = []
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i]
    if (v.startsWith('idb:')) {
      // Already stored in IndexedDB
      keys.push(v)
    } else if (v.startsWith('data:')) {
      // New base64 video — save to IndexedDB
      const key = `idb:${cropId}-${Date.now()}-${i}`
      await saveVideo(key, v)
      keys.push(key)
    } else {
      // blob: or other invalid — skip
    }
  }
  return keys
}

export async function resolveVideos(keys: string[]): Promise<string[]> {
  // Convert idb: keys back to base64 data URLs for playback
  const resolved: string[] = []
  for (const key of keys) {
    if (key.startsWith('idb:')) {
      const data = await loadVideo(key)
      if (data) resolved.push(data)
    } else if (key.startsWith('data:')) {
      resolved.push(key)
    }
    // Skip blob: or invalid keys
  }
  return resolved
}
