import { uploadFile, uploadFiles } from './client'

export async function apiUploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('image', file)
  const { url } = await uploadFile('/api/uploads/image', form)
  return url
}

export async function apiUploadImages(files: File[]): Promise<string[]> {
  const form = new FormData()
  files.forEach(f => form.append('images', f))
  const { urls } = await uploadFiles('/api/uploads/images', form)
  return urls
}

export async function apiUploadVideo(file: File): Promise<string> {
  const form = new FormData()
  form.append('video', file)
  const { url } = await uploadFile('/api/uploads/video', form)
  return url
}

export async function apiUploadApk(file: File): Promise<string> {
  const form = new FormData()
  form.append('apk', file)
  const { url } = await uploadFile('/api/uploads/apk', form)
  return url
}

