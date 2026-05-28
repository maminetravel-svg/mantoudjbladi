import React from 'react'
import { Star } from 'lucide-react'

interface TrustScoreProps {
  score: number
  showNumber?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const TrustScore: React.FC<TrustScoreProps> = ({
  score,
  showNumber = true,
  size = 'md',
}) => {
  const starSize = size === 'lg' ? 24 : size === 'md' ? 18 : 14
  const textClass = size === 'lg' ? 'text-xl font-bold' : size === 'md' ? 'text-base font-bold' : 'text-sm font-bold'

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = score >= star
        const halfFilled = !filled && score >= star - 0.5

        return (
          <Star
            key={star}
            size={starSize}
            className={filled ? 'text-yellow-400 fill-yellow-400' : halfFilled ? 'text-yellow-400 fill-yellow-200' : 'text-gray-300'}
          />
        )
      })}
      {showNumber && (
        <span className={`${textClass} text-green-600 mr-1`}>{score.toFixed(1)}</span>
      )}
    </div>
  )
}
