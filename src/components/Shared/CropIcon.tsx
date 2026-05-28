import React from 'react'
import { CropType, CROP_LABELS } from '../../types'
import { CROP_SVG_ICONS } from './CropSVGIcons'

interface CropIconProps {
  type: CropType
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  selected?: boolean
  onClick?: () => void
}

const SIZE_PX = { sm: 40, md: 56, lg: 80 }

export const CropIcon: React.FC<CropIconProps> = ({
  type,
  size = 'md',
  showLabel = false,
  selected = false,
  onClick,
}) => {
  const icon = CROP_SVG_ICONS[type]
  const px = SIZE_PX[size]
  const IconComponent = icon?.component

  return (
    <button
      onClick={onClick}
      style={{
        width: px,
        height: px,
        borderRadius: 14,
        background: selected ? '#2D6A4F' : (icon?.bg || '#f0fdf4'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: selected ? '2.5px solid #1B4332' : '2px solid transparent',
        boxShadow: selected ? '0 0 0 3px rgba(45,106,79,0.25), 0 4px 12px rgba(0,0,0,0.12)' : '0 2px 6px rgba(0,0,0,0.06)',
        transform: selected ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.18s ease',
        cursor: onClick ? 'pointer' : 'default',
        padding: 4,
        flexShrink: 0,
      }}
    >
      {IconComponent && (
        <div style={{ width: px - 12, height: px - 12 }}>
          <IconComponent />
        </div>
      )}
      {showLabel && (
        <span style={{
          fontSize: 10,
          marginTop: 2,
          fontWeight: 800,
          color: selected ? 'white' : '#276749',
          direction: 'rtl',
        }}>
          {CROP_LABELS[type]}
        </span>
      )}
    </button>
  )
}
