import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'
import { SpotlightCard } from './spotlight-card'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; isPositive: boolean }
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'rose' | 'cyan'
}

const colorMap = {
  blue: 'bg-primary/10 text-primary',       // Electric Lime
  green: 'bg-primary/10 text-primary',      // Electric Lime
  purple: 'bg-accent/10 text-accent',       // Lavender Mist
  amber: 'bg-primary/10 text-primary',       // Electric Lime
  rose: 'bg-accent/10 text-accent',         // Lavender Mist
  cyan: 'bg-primary/10 text-primary',       // Electric Lime
}

const spotlightColorMap = {
  blue: 'rgba(232, 232, 64, 0.12)',
  green: 'rgba(232, 232, 64, 0.12)',
  purple: 'rgba(184, 184, 216, 0.15)',
  amber: 'rgba(232, 232, 64, 0.12)',
  rose: 'rgba(184, 184, 216, 0.15)',
  cyan: 'rgba(232, 232, 64, 0.12)',
}


export function StatsCard({ label, value, icon: Icon, trend, color = 'blue' }: StatsCardProps) {
  return (
    <SpotlightCard
      className="stat-card glass-card !p-6"
      spotlightColor={spotlightColorMap[color]}
      radius={250}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl shrink-0', colorMap[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </SpotlightCard>
  )
}
