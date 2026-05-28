import React, { useRef, useState } from 'react'
import { Volume2, VolumeX, X, Maximize2 } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  className?: string
  style?: React.CSSProperties
  autoPlay?: boolean
  loop?: boolean
  controls?: boolean
  /** Called when user taps to go fullscreen */
  onFullscreenRequest?: () => void
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  className = '',
  style = {},
  autoPlay = false,
  loop = false,
  controls = true,
  onFullscreenRequest,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(prev => !prev)
    }
  }

  return (
    <div
      style={{ position: 'relative', display: 'block', background: '#000', ...style }}
      className={className}
      onClick={onFullscreenRequest}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onClick={e => { if (controls) e.stopPropagation() }}
      />

      {/* Mute toggle button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute',
          bottom: controls ? '48px' : '10px',
          left: '10px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: muted ? 'rgba(0,0,0,0.65)' : 'rgba(34,197,94,0.85)',
          border: '2px solid rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(4px)',
          transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
        title={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
      >
        {muted
          ? <VolumeX size={16} color="white" />
          : <Volume2 size={16} color="white" />
        }
      </button>

      {/* Fullscreen hint */}
      {onFullscreenRequest && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '8px',
          padding: '4px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'none',
        }}>
          <Maximize2 size={12} color="white" />
        </div>
      )}
    </div>
  )
}

/** Full-screen video overlay (portrait 9:16) */
export const VideoFullscreen: React.FC<{ src: string; onClose: () => void }> = ({ src, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={e => { e.stopPropagation(); onClose() }}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
          background: 'rgba(0,0,0,0.6)',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <X size={20} color="white" />
      </button>

      {/* Video centered in 9:16 */}
      <video
        src={src}
        autoPlay
        controls
        playsInline
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  )
}
