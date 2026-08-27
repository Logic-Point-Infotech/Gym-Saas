'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { useMember } from '@/hooks/use-members'
import { useCreateHealthMetric } from '@/hooks/use-health-metrics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createHealthMetricSchema, type CreateHealthMetricInput } from '@/lib/validators/health-metric'
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  User,
  Scale,
  Activity,
  Dumbbell,
  Clock,
  Heart,
  Plus,
  Apple,
  CreditCard,
  Building2,
  UserCheck,
  FileText,
  TrendingUp,
  Copy,
  Check,
  Award,
  ShieldCheck,
  Download,
} from 'lucide-react'
import { formatDate, calculateBMI, getBMICategory } from '@/lib/utils'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const statusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return <Badge variant="success">Active</Badge>
    case 'EXPIRED': return <Badge variant="destructive">Expired</Badge>
    case 'FROZEN': return <Badge variant="warning">Frozen</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

export default function MemberDetailsPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false)
  const [isAddGymOpen, setIsAddGymOpen] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [isAddingGym, setIsAddingGym] = useState(false)

  // Gym history form state
  const [newGymName, setNewGymName] = useState('')
  const [newGymStart, setNewGymStart] = useState('')
  const [newGymEnd, setNewGymEnd] = useState('')
  const [newGymMonths, setNewGymMonths] = useState('')

  // Fetch Member 360° Data
  const { data: memberRes, isLoading, refetch } = useMember(id)
  const member = memberRes?.data as any

  // Metric Log Mutation
  const createMetricMutation = useCreateHealthMetric()

  // Form for new metric
  const metricForm = useForm<CreateHealthMetricInput>({
    resolver: zodResolver(createHealthMetricSchema),
    defaultValues: {
      clientId: id,
      weightKg: undefined,
      bmi: undefined,
      notes: '',
    },
  })

  const onSubmitMetric = (data: CreateHealthMetricInput) => {
    const height = member?.heightCm
    let calculatedBmi = data.bmi
    if (!calculatedBmi && height && data.weightKg) {
      calculatedBmi = calculateBMI(data.weightKg, height)
    }

    createMetricMutation.mutate(
      {
        ...data,
        bmi: calculatedBmi,
      },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Health metric logged successfully', variant: 'success' })
          setIsAddMetricOpen(false)
          metricForm.reset({ clientId: id })
          refetch()
        },
        onError: (err: any) => {
          toast({ title: 'Error', description: err.message || 'Failed to save health metric', variant: 'error' })
        },
      }
    )
  }

  const handleAddGymHistory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGymName || !newGymStart) {
      toast({ title: 'Error', description: 'Gym name and start date are required', variant: 'error' })
      return
    }

    setIsAddingGym(true)
    try {
      const res = await fetch(`/api/members/${member.id}/gym-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gymName: newGymName,
          startDate: newGymStart,
          endDate: newGymEnd || null,
          durationMonths: newGymMonths ? Number(newGymMonths) : null,
          isCurrent: !newGymEnd,
        }),
      })

      if (!res.ok) throw new Error('Failed to add gym history')
      toast({ title: 'Success', description: 'Previous gym record added successfully', variant: 'success' })
      setIsAddGymOpen(false)
      setNewGymName('')
      setNewGymStart('')
      setNewGymEnd('')
      setNewGymMonths('')
      refetch()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Could not add gym history', variant: 'error' })
    } finally {
      setIsAddingGym(false)
    }
  }

  const copyMemberId = (memberIdStr: string) => {
    navigator.clipboard.writeText(memberIdStr)
    setCopiedId(true)
    toast({ title: 'Copied!', description: `Member ID ${memberIdStr} copied to clipboard`, variant: 'success' })
    setTimeout(() => setCopiedId(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] lg:col-span-2 w-full" />
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h3 className="text-xl font-bold">Member not found</h3>
        <Button onClick={() => router.push('/members')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
        </Button>
      </div>
    )
  }

  const getAge = (dobString?: string | null) => {
    if (!dobString) return 'N/A'
    const birthDate = new Date(dobString)
    const difference = Date.now() - birthDate.getTime()
    return Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25))
  }

  const memberId = member.memberId || `GYM-2026-${String(member.id).slice(-5).toUpperCase()}`
  const activeMembership = member.memberships?.[0]
  const activeAllocation = member.clientAllocations?.find((a: any) => a.isActive) || member.clientAllocations?.[0]

  // Calculate total previous gym experience in months
  const totalGymMonths = (member.gymHistories || []).reduce((acc: number, gh: any) => {
    if (gh.durationMonths) return acc + gh.durationMonths
    if (gh.startDate && gh.endDate) {
      const diffMs = new Date(gh.endDate).getTime() - new Date(gh.startDate).getTime()
      return acc + Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.4375))
    }
    return acc
  }, 0)

  const chartData = member.healthMetrics
    ? [...member.healthMetrics]
        .reverse()
        .map((h: any) => ({
          date: formatDate(h.recordedAt).split(',')[0],
          Weight: h.weightKg,
          BMI: h.bmi || 0,
        }))
    : []

  const latestMetric = member.healthMetrics?.[0]

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/members')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
              <span
                onClick={() => copyMemberId(memberId)}
                className="bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-bold px-3 py-1 rounded-full cursor-pointer hover:bg-primary/20 transition-all flex items-center gap-1.5"
                title="Click to Copy Unique Member ID"
              >
                {memberId}
                {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-primary" />}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Member 360° Comprehensive Profile & History</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={member.status === 'ACTIVE' ? 'success' : member.status === 'INACTIVE' ? 'secondary' : 'destructive'} className="text-xs px-3 py-1">
            {member.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-1.5" /> Print / Export 360° Summary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card */}
        <Card className="glass-card">
          <CardContent className="p-6 flex flex-col items-center space-y-6">
            <Avatar fallback={member.name} size="lg" src={member.avatarUrl} className="h-24 w-24 ring-4 ring-primary/20 shadow-lg" />
            <div className="text-center">
              <h2 className="text-xl font-bold">{member.name}</h2>
              <p className="text-xs text-muted-foreground font-mono">{member.email}</p>
              
              <div className="mt-3 inline-flex items-center gap-2 bg-muted/60 border border-border/50 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold">
                <span className="text-muted-foreground">Unique ID:</span>
                <span className="text-primary font-bold">{memberId}</span>
              </div>
            </div>

            <div className="w-full border-t border-border/60 pt-6 space-y-3.5 text-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" /> Phone:
                </span>
                <span className="font-semibold">{member.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Age & Gender:
                </span>
                <span className="font-semibold">{getAge(member.dateOfBirth)} yrs ({member.gender || 'N/A'})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-primary" /> Height / Weight:
                </span>
                <span className="font-semibold">{member.heightCm ? `${member.heightCm} cm` : 'N/A'} / {member.weightKg ? `${member.weightKg} kg` : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-primary" /> Current Plan:
                </span>
                <span className="font-bold text-primary">{activeMembership ? activeMembership.planName : 'None'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Dumbbell className="h-3.5 w-3.5 text-primary" /> Assigned Trainer:
                </span>
                <span className="font-semibold">{activeAllocation?.trainer?.name || 'Unassigned'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> Gym Experience:
                </span>
                <span className="font-bold text-emerald-400">{totalGymMonths} Months</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8 Detail Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 bg-muted/60 p-1 rounded-xl text-xs gap-1">
              <TabsTrigger value="overview" className="text-[11px] py-1.5">Personal</TabsTrigger>
              <TabsTrigger value="memberships" className="text-[11px] py-1.5">Memberships</TabsTrigger>
              <TabsTrigger value="gym-history" className="text-[11px] py-1.5">Gym History</TabsTrigger>
              <TabsTrigger value="trainers" className="text-[11px] py-1.5">Trainers</TabsTrigger>
              <TabsTrigger value="metrics" className="text-[11px] py-1.5">Health</TabsTrigger>
              <TabsTrigger value="nutrition" className="text-[11px] py-1.5">Nutrition</TabsTrigger>
              <TabsTrigger value="documents" className="text-[11px] py-1.5">Documents</TabsTrigger>
              <TabsTrigger value="progress" className="text-[11px] py-1.5">Progress</TabsTrigger>
            </TabsList>

            {/* 1. Personal Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="glass-card">
                  <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground">Current Weight</CardTitle>
                    <Scale className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">{latestMetric?.weightKg || member.weightKg || 'N/A'} <span className="text-xs font-normal">kg</span></p>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground">Body Mass Index (BMI)</CardTitle>
                    <Activity className="h-4 w-4 text-emerald-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">{latestMetric?.bmi || 'N/A'}</p>
                    {latestMetric?.bmi && (
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Category: {getBMICategory(latestMetric.bmi)}
                      </span>
                    )}
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground">Total Fitness Experience</CardTitle>
                    <Building2 className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold text-amber-400">{totalGymMonths} <span className="text-xs font-normal text-muted-foreground">months</span></p>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Permanent Member Identification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="p-4 rounded-xl bg-card/60 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Unique Permanent Member ID</p>
                      <p className="text-xl font-bold font-mono text-primary mt-0.5">{memberId}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => copyMemberId(memberId)}>
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Member ID
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This Member ID is permanent and will never change during plan renewals, trainer reassignments, or gym branch transfers.
                  </p>
                </CardContent>
              </Card>

              {/* Chart */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Weight & BMI Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ background: 'rgba(17, 24, 39, 0.95)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                          <Line type="monotone" dataKey="Weight" stroke="var(--color-primary)" strokeWidth={2.5} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="BMI" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No health metrics recorded yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 2. Membership History Tab */}
            <TabsContent value="memberships" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Membership Plans History</CardTitle>
                  <CardDescription>Log of all current, active, and expired memberships for ID: <strong className="font-mono text-primary">{memberId}</strong></CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {member.memberships?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plan</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {member.memberships.map((m: any) => (
                          <TableRow key={m.id}>
                            <TableCell className="text-sm font-medium">{m.planName}</TableCell>
                            <TableCell className="text-sm font-semibold text-emerald-400">₹{m.amount.toLocaleString('en-IN')}</TableCell>
                            <TableCell className="text-sm">{formatDate(m.startDate).split(',')[0]}</TableCell>
                            <TableCell className="text-sm">{formatDate(m.endDate).split(',')[0]}</TableCell>
                            <TableCell className="text-xs">{statusBadge(m.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">No membership record found</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 3. Previous Gym History Tab */}
            <TabsContent value="gym-history" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" /> Previous Gym & Training History
                    </CardTitle>
                    <CardDescription>Total Gym Experience: <strong className="text-emerald-400 font-bold">{totalGymMonths} Months</strong> across all fitness centers</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setIsAddGymOpen(true)}>
                    <Plus className="mr-1 h-4 w-4" /> Add Previous Gym
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {member.gymHistories?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Gym / Branch Name</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {member.gymHistories.map((gh: any) => (
                          <TableRow key={gh.id}>
                            <TableCell className="text-sm font-bold text-foreground">{gh.gymName}</TableCell>
                            <TableCell className="text-sm">{formatDate(gh.startDate).split(',')[0]}</TableCell>
                            <TableCell className="text-sm">{gh.endDate ? formatDate(gh.endDate).split(',')[0] : 'Present'}</TableCell>
                            <TableCell className="text-sm font-semibold text-amber-400">{gh.durationMonths ? `${gh.durationMonths} months` : 'N/A'}</TableCell>
                            <TableCell className="text-xs">
                              {gh.isCurrent ? <Badge variant="success">Current Gym</Badge> : <Badge variant="secondary">Previous</Badge>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">No previous gym history recorded yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4. Trainer History Tab */}
            <TabsContent value="trainers" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" /> Trainer Allocations & Coach History
                  </CardTitle>
                  <CardDescription>Historical log of personal trainers assigned to this member</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {member.clientAllocations?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trainer</TableHead>
                          <TableHead>Specialization</TableHead>
                          <TableHead>Allocated Date</TableHead>
                          <TableHead>Contact Phone</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {member.clientAllocations.map((ta: any) => (
                          <TableRow key={ta.id}>
                            <TableCell className="text-sm font-bold text-foreground">{ta.trainer?.name || 'N/A'}</TableCell>
                            <TableCell className="text-sm">{ta.trainer?.specialization || 'General Fitness'}</TableCell>
                            <TableCell className="text-sm">{formatDate(ta.allocatedAt).split(',')[0]}</TableCell>
                            <TableCell className="text-sm font-mono text-muted-foreground">{ta.trainer?.phone || 'N/A'}</TableCell>
                            <TableCell className="text-xs">
                              {ta.isActive ? <Badge variant="success">Active Coach</Badge> : <Badge variant="outline">Past Coach</Badge>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">No trainer allocations recorded</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 5. Health Metrics Tab */}
            <TabsContent value="metrics" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-sm font-semibold">Weight & BMI History</CardTitle>
                    <CardDescription>Chronological health measurement logs</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setIsAddMetricOpen(true)}>
                    <Plus className="mr-1 h-4 w-4" /> Add Entry
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {member.healthMetrics?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>BMI</TableHead>
                          <TableHead>Body Fat</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {member.healthMetrics.map((h: any) => (
                          <TableRow key={h.id}>
                            <TableCell className="text-sm font-medium">{formatDate(h.recordedAt).split(',')[0]}</TableCell>
                            <TableCell className="text-sm font-bold">{h.weightKg} kg</TableCell>
                            <TableCell className="text-sm">{h.bmi || 'N/A'}</TableCell>
                            <TableCell className="text-sm">{h.bodyFatPercent ? `${h.bodyFatPercent}%` : 'N/A'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{h.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">No health records logged</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 6. Nutrition Tab */}
            <TabsContent value="nutrition" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Daily Meal Logs & Macronutrients</CardTitle>
                  <CardDescription>Historical food log records scanned by Vyayam AI</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {member.nutritionLogs?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Meal Type</TableHead>
                          <TableHead>Food</TableHead>
                          <TableHead>Calories</TableHead>
                          <TableHead>Protein</TableHead>
                          <TableHead>Macros (C/F)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {member.nutritionLogs.map((n: any) => (
                          <TableRow key={n.id}>
                            <TableCell className="text-sm font-medium">{formatDate(n.loggedAt).split(',')[0]}</TableCell>
                            <TableCell className="text-sm capitalize"><Badge variant="outline">{n.mealType.toLowerCase()}</Badge></TableCell>
                            <TableCell className="text-sm font-medium">{n.detectedFood || 'Logged Meal'}</TableCell>
                            <TableCell className="text-sm text-amber-400 font-semibold">{n.calories} kcal</TableCell>
                            <TableCell className="text-sm text-emerald-400 font-semibold">{n.protein}g</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{n.carbs}g / {n.fats}g</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">No nutrition logs submitted by client</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 7. Documents Tab */}
            <TabsContent value="documents" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Member Documents & Certificates
                  </CardTitle>
                  <CardDescription>KYC ID Proofs, Blood test reports, Medical waivers</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {member.documents?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Uploaded On</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {member.documents.map((doc: any) => (
                          <TableRow key={doc.id}>
                            <TableCell className="text-sm font-bold text-foreground">{doc.title}</TableCell>
                            <TableCell className="text-xs"><Badge variant="secondary">{doc.fileType || 'PDF'}</Badge></TableCell>
                            <TableCell className="text-sm">{formatDate(doc.uploadedAt).split(',')[0]}</TableCell>
                            <TableCell className="text-xs">
                              <Button size="sm" variant="outline" onClick={() => toast({ title: 'Viewing Document', description: doc.title, variant: 'info' })}>
                                Download / View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">No documents uploaded</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 8. Progress Tab */}
            <TabsContent value="progress" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" /> Fitness Goal & Progress Milestones
                  </CardTitle>
                  <CardDescription>Overall progression rating based on attendance and body composition changes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-card/60 border border-border/50">
                      <p className="text-xs text-muted-foreground">Target Fitness Goal</p>
                      <p className="text-lg font-bold text-primary mt-1">Muscle Gain & Weight Loss</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card/60 border border-border/50">
                      <p className="text-xs text-muted-foreground">Member Status</p>
                      <p className="text-lg font-bold text-emerald-400 mt-1">Consistent Attendance (92%)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Health Metric Dialog */}
      <Dialog open={isAddMetricOpen} onOpenChange={setIsAddMetricOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Health Metric</DialogTitle>
            <DialogDescription>Record weight, BMI, and notes for member {memberId}</DialogDescription>
          </DialogHeader>
          <form onSubmit={metricForm.handleSubmit(onSubmitMetric)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metric-weight">Weight (kg) <span className="text-destructive">*</span></Label>
              <Input
                id="metric-weight"
                type="number"
                step="0.1"
                error={metricForm.formState.errors.weightKg?.message}
                {...metricForm.register('weightKg', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metric-bmi">BMI (Optional - auto calculated if height exists)</Label>
              <Input
                id="metric-bmi"
                type="number"
                step="0.1"
                error={metricForm.formState.errors.bmi?.message}
                {...metricForm.register('bmi', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metric-notes">Notes</Label>
              <Textarea id="metric-notes" placeholder="e.g. Measured in morning" {...metricForm.register('notes')} />
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={createMetricMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={createMetricMutation.isPending}>Save Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Gym History Dialog */}
      <Dialog open={isAddGymOpen} onOpenChange={setIsAddGymOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Previous Gym Record</DialogTitle>
            <DialogDescription>Record previous fitness center history for member {memberId}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGymHistory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gym-name">Gym / Branch Name <span className="text-destructive">*</span></Label>
              <Input
                id="gym-name"
                placeholder="e.g. Gold's Gym / Cult Fit"
                value={newGymName}
                onChange={(e) => setNewGymName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gym-start">Start Date <span className="text-destructive">*</span></Label>
                <Input
                  id="gym-start"
                  type="date"
                  value={newGymStart}
                  onChange={(e) => setNewGymStart(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gym-end">End Date (Leave blank if current)</Label>
                <Input
                  id="gym-end"
                  type="date"
                  value={newGymEnd}
                  onChange={(e) => setNewGymEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gym-months">Duration in Months</Label>
              <Input
                id="gym-months"
                type="number"
                placeholder="e.g. 12"
                value={newGymMonths}
                onChange={(e) => setNewGymMonths(e.target.value)}
              />
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={isAddingGym}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={isAddingGym}>Save History</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
