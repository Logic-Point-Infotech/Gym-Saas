'use client'

import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string
  radius?: number
}

export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  ({ className, children, spotlightColor = 'rgba(139, 92, 246, 0.15)', radius = 300, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement | null>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return

      const card = cardRef.current
      const rect = card.getBoundingClientRect()

      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseEnter = () => {
      setOpacity(1)
    }

    const handleMouseLeave = () => {
      setOpacity(0)
    }

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        cardRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    return (
      <div
        ref={setRefs}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300',
          className
        )}
        {...props}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)
SpotlightCard.displayName = 'SpotlightCard'
