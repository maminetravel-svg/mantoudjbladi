import React, { useState } from 'react'
import { CropType, CROP_LABELS, CROP_EMOJIS } from '../../types'
import { useAppStore } from '../../store/appStore'

interface CropImageProps {
  type: CropType
  images?: string[]
  className?: string
  emojiSize?: string
}

export function CropImage({ type, images, className = "w-full h-32", emojiSize = "text-5xl" }: CropImageProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const cropTypeImages = useAppStore(s => s.cropTypeImages)

  // Determine what image source to attempt loading
  const targetSrc = (images && images.length > 0)
    ? images[0]
    : cropTypeImages[type] || `/images/crops/${type}.jpg`

  return (
    <div className={`relative ${className} overflow-hidden bg-white`}>
      {/* 1. Emoji Fallback (Always exists underneath) */}
      <div 
        className="absolute inset-0 flex items-center justify-center w-full h-full" 
        style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' }}
      >
        <span className={emojiSize}>{CROP_EMOJIS[type] || '🌱'}</span>
      </div>

      {/* 2. Target Image (covers emoji if successful) */}
      {!imgFailed && (
        <img
          src={targetSrc}
          alt={CROP_LABELS[type] || ''}
          className="absolute inset-0 w-full h-full object-cover z-10 bg-white"
          onError={() => setImgFailed(true)}
        />
      )}
    </div>
  )
}
