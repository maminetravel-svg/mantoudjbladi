import React from 'react'
import { CropStage, CropType, calcCropStage, getStageLabel, isFruitCrop } from '../../types'

interface CropProgressBarProps {
  plantingDate: string
  expectedHarvestDate: string
  cropType?: CropType
  compact?: boolean
}

const STAGE_ORDER: CropStage[] = ['seeds', 'growth', 'flowering', 'ready']

const STAGE_ICONS: Record<CropStage, string> = {
  seeds: '🌱',
  growth: '🌿',
  flowering: '🌸',
  ready: '🍅',
}

const STAGE_COLOR: Record<CropStage, string> = {
  seeds: '#74b569',
  growth: '#2D6A4F',
  flowering: '#22c55e',
  ready: '#dc2626',
}

const STAGE_BG: Record<CropStage, { bg: string; text: string }> = {
  seeds: { bg: '#dcfce7', text: '#166534' },
  growth: { bg: '#d1fae5', text: '#065f46' },
  flowering: { bg: '#ffedd5', text: '#9a3412' },
  ready: { bg: '#fee2e2', text: '#991b1b' },
}

function getDaysRemaining(expectedHarvestDate: string): number {
  const harvest = new Date(expectedHarvestDate)
  const diff = harvest.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function getProgressPercent(plantingDate: string, expectedHarvestDate: string): number {
  const start = new Date(plantingDate).getTime()
  const end = new Date(expectedHarvestDate).getTime()
  const now = Date.now()
  const total = end - start
  if (total <= 0) return 100
  return Math.min(100, Math.max(0, Math.round(((now - start) / total) * 100)))
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ar-DZ', { day: 'numeric', month: 'short' })
}

export const CropProgressBar: React.FC<CropProgressBarProps> = ({
  plantingDate,
  expectedHarvestDate,
  cropType,
  compact = false,
}) => {
  const isFruit = cropType ? isFruitCrop(cropType) : false

  // Auto-calculate stage from dates
  const effectivePlanting = isFruit
    ? new Date(new Date(expectedHarvestDate).getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : plantingDate

  const stage = calcCropStage(effectivePlanting, expectedHarvestDate)
  const stageIndex = STAGE_ORDER.indexOf(stage)
  const daysRemaining = getDaysRemaining(expectedHarvestDate)
  const progress = getProgressPercent(effectivePlanting, expectedHarvestDate)
  const color = STAGE_COLOR[stage]
  const { bg, text } = STAGE_BG[stage]

  const label = cropType ? getStageLabel(stage, cropType) : stage
  const daysLabel = daysRemaining > 0 ? `باقي ${daysRemaining} يوم` : 'جاهز للحصاد!'

  if (compact) {
    return (
      <div style={{ width: '100%' }}>
        {/* Stage dots row */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', gap: '2px' }}>
          {STAGE_ORDER.map((s, idx) => {
            const filled = idx <= stageIndex
            const stageColor = filled ? STAGE_COLOR[s] : '#d1d5db'
            return (
              <React.Fragment key={s}>
                <div
                  style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: filled ? stageColor : 'transparent',
                    border: `2px solid ${stageColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', flexShrink: 0, transition: 'all 0.3s',
                  }}
                >
                  {filled ? STAGE_ICONS[s] : ''}
                </div>
                {idx < STAGE_ORDER.length - 1 && (
                  <div style={{
                    flex: 1, height: '2px',
                    background: idx < stageIndex ? color : '#e5e7eb',
                    transition: 'background 0.3s',
                  }} />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Label + days */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: bg, color: text, fontWeight: 'bold' }}>
            {STAGE_ICONS[stage]} {label}
          </span>
          <span style={{ fontSize: '11px', color: daysRemaining <= 14 ? '#dc2626' : daysRemaining <= 30 ? '#22c55e' : '#2D6A4F', fontWeight: 'bold' }}>
            {daysLabel}
          </span>
        </div>

        {/* Progress bar with date markers */}
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '99px', height: '6px' }}>
            <div style={{
              height: '6px', borderRadius: '99px', background: color,
              width: `${progress}%`, transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            {!isFruit && (
              <span style={{ fontSize: '9px', color: '#9ca3af' }}>{fmtDate(plantingDate)}</span>
            )}
            {isFruit && <span />}
            <span style={{ fontSize: '9px', color: '#9ca3af' }}>{fmtDate(expectedHarvestDate)}</span>
          </div>
        </div>
      </div>
    )
  }

  // Full view
  return (
    <div style={{ width: '100%' }}>
      {/* Stage icons row */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        {STAGE_ORDER.map((s, idx) => {
          const filled = idx <= stageIndex
          const stageColor = filled ? STAGE_COLOR[s] : '#d1d5db'
          const sLabel = cropType ? getStageLabel(s, cropType) : s
          return (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: filled ? stageColor : 'transparent',
                  border: `2.5px solid ${stageColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px',
                  boxShadow: filled ? `0 2px 8px ${stageColor}55` : 'none',
                  transition: 'all 0.3s',
                }}>
                  {filled ? STAGE_ICONS[s] : <span style={{ fontSize: '12px', color: '#9ca3af' }}>○</span>}
                </div>
                <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: 'bold', color: filled ? text : '#9ca3af' }}>
                  {sLabel}
                </span>
              </div>
              {idx < STAGE_ORDER.length - 1 && (
                <div style={{
                  height: '2px', flex: 1,
                  background: idx < stageIndex ? color : '#e5e7eb',
                  marginBottom: '20px', transition: 'background 0.3s',
                }} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Progress bar with date markers */}
      <div style={{ position: 'relative', marginBottom: '8px' }}>
        <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '99px', height: '10px' }}>
          <div style={{
            height: '10px', borderRadius: '99px',
            background: `linear-gradient(90deg, ${STAGE_COLOR['seeds']}, ${color})`,
            width: `${progress}%`, transition: 'width 0.7s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          {!isFruit ? (
            <span style={{ fontSize: '11px', color: '#6b7280' }}>🌱 {fmtDate(plantingDate)}</span>
          ) : <span />}
          <span style={{ fontSize: '11px', color: '#6b7280' }}>🌾 {fmtDate(expectedHarvestDate)}</span>
        </div>
      </div>

      {/* Days info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {progress}%
        </span>
        <span style={{
          fontSize: '13px', fontWeight: '900',
          padding: '4px 12px', borderRadius: '20px',
          background: bg, color: text,
        }}>
          {daysRemaining > 0 ? `باقي ${daysRemaining} يوم` : '🎉 جاهز للحصاد!'}
        </span>
      </div>
    </div>
  )
}
