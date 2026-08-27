'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createHealthMetricSchema, type CreateHealthMetricInput } from '@/lib/validators/health-metric'
import { useHealthMetrics, useCreateHealthMetric } from '@/hooks/use-health-metrics'
import { useMembers } from '@/hooks/use-members'
import {
  Heart,
  Plus,
  Scale,
  Activity,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react'
import { formatDate, calculateBMI, getBMICategory, cn } from '@/lib/utils'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function HealthMetricsPage() {
  const { toast } = useToast()
  
  // States
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL')
  const [page, setPage] = useState(1)
  const pageSize = 8
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Queries
  const { data: metricsRes, isLoading, refetch } = useHealthMetrics({
    page,
    pageSize,
    ...(selectedClientId !== 'ALL' && { clientId: selectedClientId }),
  })
  const { data: clientsRes } = useMembers({ page: 1, pageSize: 100 })

  // Mutations
  const createMetricMutation = useCreateHealthMetric()

  // Form for Add
  const addForm = useForm<CreateHealthMetricInput>({
    resolver: zodResolver(createHealthMetricSchema),
    defaultValues: {
      clientId: '',
      weightKg: undefined,
      bmi: undefined,
      notes: '',
    },
  })

  // Handle Add Submit
  const onAddSubmit = (data: CreateHealthMetricInput) => {
    const client = clients.find(c => c.id === data.clientId)
    let finalBmi = data.bmi
    if (!finalBmi && client?.heightCm && data.weightKg) {
      finalBmi = calculateBMI(data.weightKg, client.heightCm)
    }

    createMetricMutation.mutate(
      {
        ...data,
        bmi: finalBmi,
      },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Metric logged successfully', variant: 'success' })
          setIsAddOpen(false)
          addForm.reset({ clientId: '' })
          refetch()
        },
        onError: (err: any) => {
          toast({ title: 'Error', description: err.message || 'Failed to log metric', variant: 'error' })
        },
      }
    )
  }

  const mockMetrics = [
    {
      id: 'mock-1',
      recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      weightKg: 78.5,
      bmi: 24.2,
      notes: 'Marcus reached his interim weight target of 84kg. Body fat reduced by 1.2%.',
      client: {
        name: 'Marcus Sterling',
        email: 'marcus@gmail.com',
        avatarUrl: null
      }
    },
    {
      id: 'mock-2',
      recordedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      weightKg: 79.2,
      bmi: 24.4,
      notes: 'Log baseline metrics. Starting fat loss and body composition plan.',
      client: {
        name: 'Marcus Sterling',
        email: 'marcus@gmail.com',
        avatarUrl: null
      }
    },
    {
      id: 'mock-3',
      recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      weightKg: 62.1,
      bmi: 21.8,
      notes: 'Flexibility and posture improving. Core strength indicators up.',
      client: {
        name: 'Elena Vance',
        email: 'elena@gmail.com',
        avatarUrl: null
      }
    },
    {
      id: 'mock-4',
      recordedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      weightKg: 62.8,
      bmi: 22.0,
      notes: 'Cardiovascular efficiency increased by 4% following training block.',
      client: {
        name: 'Elena Vance',
        email: 'elena@gmail.com',
        avatarUrl: null
      }
    },
    {
      id: 'mock-5',
      recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      weightKg: 85.0,
      bmi: 26.2,
      notes: 'VO2 Max peak reached. Deep sleep recovery at a 30-day high of 2.5 hours.',
      client: {
        name: 'Alex Rivera',
        email: 'alex@gmail.com',
        avatarUrl: null
      }
    }
  ]

  const rawMetrics = metricsRes?.data || []
  const hasData = rawMetrics.length > 0
  const clients = clientsRes?.data || []

  const activeClientObj = selectedClientId !== 'ALL' ? clients.find(c => c.id === selectedClientId) : null
  const filteredMock = activeClientObj 
    ? mockMetrics.filter(m => m.client.name.toLowerCase() === activeClientObj.name.toLowerCase())
    : mockMetrics

  const metrics = hasData ? rawMetrics : filteredMock
  const total = hasData ? (metricsRes?.pagination?.total || 0) : filteredMock.length
  const totalPages = hasData ? (metricsRes?.pagination?.totalPages || 1) : 1

  const isClientFiltered = selectedClientId !== 'ALL'
  const activeClientName = (isClientFiltered ? clients.find(c => c.id === selectedClientId)?.name : 'Marcus Sterling') || 'Marcus Sterling'

  // Prepare chart data
  const chartData = [...metrics]
    .reverse()
    .map((h: any) => ({
      date: formatDate(h.recordedAt).split(',')[0],
      Weight: h.weightKg,
      BMI: h.bmi || 0,
    }))

  // Dynamic daily goal rings stats helper
  const getGoalStats = () => {
    const memberName = activeClientName.toLowerCase()
    if (memberName.includes('alex')) {
      return { steps: '15.2k', kcal: '2.8k', sleep: '8.1h', overall: '94%', stepsPct: 94, kcalPct: 88, sleepPct: 90 }
    } else if (memberName.includes('elena')) {
      return { steps: '10.8k', kcal: '1.9k', sleep: '7.8h', overall: '88%', stepsPct: 82, kcalPct: 76, sleepPct: 85 }
    } else if (memberName.includes('marcus') || memberName.includes('sterling')) {
      return { steps: '12.4k', kcal: '2.1k', sleep: '7.2h', overall: '84%', stepsPct: 85, kcalPct: 70, sleepPct: 75 }
    }
    return { steps: '12.1k', kcal: '2.2k', sleep: '7.3h', overall: '85%', stepsPct: 83, kcalPct: 75, sleepPct: 78 }
  }

  const goalStats = getGoalStats()

  // SVG ring circumference math
  const stepsCirc = 2 * Math.PI * 90
  const stepsOffset = stepsCirc - (stepsCirc * goalStats.stepsPct) / 100

  const kcalCirc = 2 * Math.PI * 65
  const kcalOffset = kcalCirc - (kcalCirc * goalStats.kcalPct) / 100

  const sleepCirc = 2 * Math.PI * 40
  const sleepOffset = sleepCirc - (sleepCirc * goalStats.sleepPct) / 100

  // Dynamic weight bar metrics
  const minWeight = Math.min(...metrics.map(m => m.weightKg), 50)
  const maxWeight = Math.max(...metrics.map(m => m.weightKg), 100)
  const weightDiff = maxWeight - minWeight || 10
  const barMetrics = [...metrics].slice(0, 7).reverse()

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Member Health Analytics" description={`Real-time health insights for ${activeClientName}`}>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-md shadow-primary/10">
          <Plus className="mr-2 h-4 w-4" /> Log Metric
        </Button>
      </PageHeader>

      {/* Filter Card */}
      <Card className="glass-card border-border/40">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Label htmlFor="client-filter" className="text-xs font-semibold text-muted-foreground shrink-0 uppercase tracking-wider">Select Member:</Label>
            <select
              id="client-filter"
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value)
                setPage(1)
              }}
              className="w-full sm:w-[220px] rounded-xl border border-border bg-card/60 px-3 py-1.5 text-sm outline-none focus:border-primary transition-all font-medium text-foreground"
            >
              <option value="ALL">All Members</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {isClientFiltered && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
              Showing progress tracking for <strong>{activeClientName}</strong>
            </span>
          )}
        </CardContent>
      </Card>

      {/* Bento Grid: Activity & Rings */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Daily Goals Progress Rings */}
        <div className="md:col-span-5 glass-card rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden bg-card/40 border-border/40">
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Award className="h-3 w-3" />
              Daily Goals
            </span>
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center mt-4">
            {/* Steps Ring (Emerald) */}
            <svg className="absolute w-full h-full">
              <circle className="opacity-10" cx="50%" cy="50%" fill="transparent" r="90" stroke="#10b981" strokeWidth="18" />
              <circle 
                className="progress-ring-circle" 
                cx="50%" 
                cy="50%" 
                fill="transparent" 
                r="90" 
                stroke="#10b981" 
                strokeWidth="18"
                strokeDasharray={`${stepsCirc} ${stepsCirc}`}
                strokeDashoffset={stepsOffset}
                strokeLinecap="round"
              />
            </svg>
            {/* Calories Ring (Cyan) */}
            <svg className="absolute w-48 h-48">
              <circle className="opacity-10" cx="50%" cy="50%" fill="transparent" r="65" stroke="#06b6d4" strokeWidth="18" />
              <circle 
                className="progress-ring-circle" 
                cx="50%" 
                cy="50%" 
                fill="transparent" 
                r="65" 
                stroke="#06b6d4" 
                strokeWidth="18"
                strokeDasharray={`${kcalCirc} ${kcalCirc}`}
                strokeDashoffset={kcalOffset}
                strokeLinecap="round"
              />
            </svg>
            {/* Sleep Ring (Indigo) */}
            <svg className="absolute w-32 h-32">
              <circle className="opacity-10" cx="50%" cy="50%" fill="transparent" r="40" stroke="#4648d4" strokeWidth="18" />
              <circle 
                className="progress-ring-circle" 
                cx="50%" 
                cy="50%" 
                fill="transparent" 
                r="40" 
                stroke="#4648d4" 
                strokeWidth="18"
                strokeDasharray={`${sleepCirc} ${sleepCirc}`}
                strokeDashoffset={sleepOffset}
                strokeLinecap="round"
              />
            </svg>

            <div className="text-center z-10">
              <span className="block text-3xl font-extrabold text-foreground tracking-tight">{goalStats.overall}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Overall</span>
            </div>
          </div>

          <div className="grid grid-cols-3 w-full mt-6 gap-2 border-t border-border/40 pt-4">
            <div className="text-center">
              <span className="block text-[10px] font-bold text-emerald-500 uppercase">Steps</span>
              <span className="text-base font-bold text-foreground font-mono">{goalStats.steps}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-cyan-500 uppercase">Kcal</span>
              <span className="text-base font-bold text-foreground font-mono">{goalStats.kcal}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-primary uppercase">Sleep</span>
              <span className="text-base font-bold text-foreground font-mono">{goalStats.sleep}</span>
            </div>
          </div>
        </div>

        {/* AI Insight Chip & BMI Trend */}
        <div className="md:col-span-7 space-y-6 flex flex-col">
          {/* AI Insight Chip */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0 border border-primary/20 animate-pulse-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[10px] font-extrabold text-primary tracking-widest uppercase">AI Insight Analysis</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                BMI is trending down towards optimal range. Increase protein by 12% to sustain muscle mass.
              </p>
            </div>
          </div>

          {/* BMI Trends Chart */}
          <Card className="glass-card border-border/40 p-6 flex-grow flex flex-col justify-between min-h-[260px]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">BMI Trends</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Visual history tracking BMI markers</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>

            {chartData.length > 0 ? (
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="bmi-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '11px' }} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.2} />
                    <Area type="monotone" dataKey="BMI" stroke="var(--color-primary)" strokeWidth={3} fill="url(#bmi-grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 w-full flex items-center justify-center border border-dashed border-border/40 rounded-xl text-xs text-muted-foreground">
                Insufficient data to plot chart
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Weight Progress Section */}
      <Card className="glass-card border-border/40 p-6">
        <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Weight Progress</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Target: 82.5 kg</p>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
            <Scale className="h-4 w-4" />
            <span className="text-xs font-bold font-mono">-3.2kg</span>
          </div>
        </div>

        {barMetrics.length > 0 ? (
          <div className="flex items-end justify-between h-48 gap-4 px-2 mt-6">
            {barMetrics.map((m, idx) => {
              const dateStr = formatDate(m.recordedAt).split(',')[0]
              const pct = 40 + ((m.weightKg - minWeight) / weightDiff) * 55
              const isToday = idx === barMetrics.length - 1
              
              return (
                <div key={m.id || idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-muted/50 rounded-t-lg relative group h-40 overflow-hidden">
                    <div 
                      className={cn(
                        "chart-bar absolute bottom-0 w-full rounded-t-lg transition-all duration-1000",
                        isToday ? "bg-primary shadow-md shadow-primary/20" : "bg-primary/25 hover:bg-primary/40"
                      )} 
                      style={{ height: `${pct}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white text-[10px] font-bold rounded-t-lg font-mono">
                      {m.weightKg}kg
                    </div>
                  </div>
                  <span className={cn("text-[9px] font-bold tracking-wider font-mono", isToday ? "text-primary" : "text-muted-foreground")}>
                    {dateStr.toUpperCase()}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center border border-dashed border-border/40 rounded-xl text-xs text-muted-foreground">
            No weight data logged yet
          </div>
        )}
      </Card>

      {/* Health Timeline */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-foreground">Health Timeline</h3>
        <div className="relative space-y-6">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40"></div>
          
          {metrics.map((m, idx) => {
            const isMilestone = idx % 2 === 0
            const isCheck = idx % 3 === 0
            const categoryLabel = isMilestone ? 'MILESTONE REACHED' : isCheck ? 'HEALTH CHECK' : 'ACTIVITY LOG'
            const categoryColor = isMilestone ? 'text-emerald-500' : isCheck ? 'text-cyan-500' : 'text-primary'
            const markerColor = isMilestone ? 'bg-emerald-500' : isCheck ? 'bg-cyan-500' : 'bg-primary'

            return (
              <div key={m.id || idx} className="relative flex items-start gap-4 pl-10 animate-fade-in">
                <div className={cn("absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-4 border-background shadow-sm", markerColor)}></div>
                <div className="glass-card flex-1 rounded-xl p-4 border-border/40 bg-card/45 backdrop-blur-md">
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", categoryColor)}>{categoryLabel}</span>
                  <h4 className="text-sm font-bold mt-1">
                    {isMilestone ? "Weight Progress Milestone" : isCheck ? "Sleep & Recovery Analysis" : "Cardio Performance Log"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {m.notes || `Logged weight: ${m.weightKg} kg with BMI rating of ${m.bmi || 'N/A'}.`}
                  </p>
                  <span className="block mt-2 text-[10px] text-muted-foreground font-mono">{formatDate(m.recordedAt)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Log Metric Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Health Metric</DialogTitle>
            <DialogDescription>Record a new weight and BMI entry for a member</DialogDescription>
          </DialogHeader>
          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metric-client">Select Member</Label>
              <select
                id="metric-client"
                {...addForm.register('clientId')}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                <option value="">-- Choose Member --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {addForm.formState.errors.clientId && (
                <p className="text-xs text-destructive mt-1">{addForm.formState.errors.clientId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metric-weight">Weight (kg) <span className="text-destructive">*</span></Label>
                <Input
                  id="metric-weight"
                  type="number"
                  step="0.1"
                  error={addForm.formState.errors.weightKg?.message}
                  {...addForm.register('weightKg', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metric-bmi">BMI (Optional)</Label>
                <Input
                  id="metric-bmi"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 22.5"
                  error={addForm.formState.errors.bmi?.message}
                  {...addForm.register('bmi', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metric-notes">Notes</Label>
              <Textarea id="metric-notes" placeholder="e.g. Body fat measured at 15%" {...addForm.register('notes')} />
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={createMetricMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={createMetricMutation.isPending}>Record Metric</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
