'use client'

import * as React from 'react'
import { cn, getInitials } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null
  alt?: string
  fallback?: string
}

function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false)
  const initials = fallback ? getInitials(fallback) : '?'

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || fallback || 'Avatar'}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary/20 text-primary font-semibold">
          {initials}
        </div>
      )}
    </div>
  )
}

export { Avatar }
