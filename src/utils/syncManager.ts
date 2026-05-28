import { useAppStore } from '../store/appStore'

class SyncManager {
  private syncInterval: ReturnType<typeof setInterval> | null = null

  start() {
    // Check every 30 seconds if there are pending items to sync
    this.syncInterval = setInterval(() => {
      const store = useAppStore.getState()
      if (store.isOnline && store.pendingSyncCount > 0) {
        store.syncData()
      }
    }, 30000)
  }

  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  async syncNow(): Promise<void> {
    const store = useAppStore.getState()
    if (!store.isOnline) {
      throw new Error('لا يوجد اتصال بالإنترنت')
    }
    await store.syncData()
  }
}

export const syncManager = new SyncManager()
