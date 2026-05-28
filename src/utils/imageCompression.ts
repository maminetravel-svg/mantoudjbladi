export interface CompressionResult {
  base64: string
  originalSizeKB: number
  compressedSizeKB: number
}

export async function compressImage(file: File): Promise<CompressionResult> {
  const originalSizeKB = Math.round(file.size / 1024)

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 600

        let width = img.width
        let height = img.height

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width)
          width = MAX_WIDTH
        }
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height)
          height = MAX_HEIGHT
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        const base64 = canvas.toDataURL('image/jpeg', 0.7)

        // Calculate compressed size
        const compressedSizeKB = Math.round((base64.length * 3) / 4 / 1024)

        resolve({
          base64,
          originalSizeKB,
          compressedSizeKB,
        })
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

export function formatSize(kb: number): string {
  if (kb >= 1024) {
    return `${(kb / 1024).toFixed(1)} MB`
  }
  return `${kb} KB`
}
