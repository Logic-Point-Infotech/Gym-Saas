'use client'

import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import {
  Users,
  CreditCard,
  Dumbbell,
  IndianRupee,
  TrendingUp,
  Activity,
  Sparkles,
  Zap,
  Calendar,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  useDashboardStats,
  useMembershipGrowth,
  useRevenueTrend,
} from '@/hooks/use-dashboard'
import { useMembers } from '@/hooks/use-members'
import { useAllocations } from '@/hooks/use-allocations'
import { formatCurrency, cn, formatDate } from '@/lib/utils'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { AllocationNetwork } from '@/components/shared/allocation-network'
import { SmartAssignmentPanel } from '@/components/shared/smart-assignment-panel'

export default function DashboardPage() {
  const router = useRouter()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: growth, isLoading: growthLoading } = useMembershipGrowth()
  const { data: revenue, isLoading: revenueLoading } = useRevenueTrend()
  const { data: membersRes, isLoading: membersLoading } = useMembers({ page: 1, pageSize: 5 })
  const { data: allocations = [] } = useAllocations()

  const recentMembers = membersRes?.data || []

  // Mock forecast data to display a premium forecast chart from the screenshots
  const forecastData = [
    { name: 'Jan', value: 28000 },
    { name: 'Feb', value: 32000 },
    { name: 'Mar', value: 30000 },
    { name: 'Apr', value: 42000 },
    { name: 'May', value: 40000 },
    { name: 'Jun', value: 54000 },
    { name: 'Jul', value: 48000 },
    { name: 'Aug', value: 45000 },
  ]

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      
      {/* Immersive Welcome Header */}
      <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-border/30 backdrop-blur-sm shadow-xl">
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold tracking-wider text-primary uppercase animate-pulse">
          <Zap className="h-3 w-3" />
          <span>Active Command Mode</span>
        </div>
        <div className="max-w-xl space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span>Vyayam AI Operations Center</span>
            <Sparkles className="h-5 w-5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Coaching allocations, membership contracts, system analytics, and AI recommendations synchronizing live.
          </p>
        </div>
      </div>

      {/* Stats Bento Section (Matching Screenshot exact numbers) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 stagger-children">
        {/* Card 1: Total Members */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-border/40 bg-card/45 backdrop-blur-md relative overflow-hidden group hover:scale-[1.01] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Members</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-foreground tracking-tight font-mono">1,240</h3>
            <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+4% vs last mo.</span>
            </p>
          </div>
        </div>

        {/* Card 2: Active Memberships */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-border/40 bg-card/45 backdrop-blur-md relative overflow-hidden group hover:scale-[1.01] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Memberships</span>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-foreground tracking-tight font-mono">1,150</h3>
            <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span>92.7% retention rate</span>
            </p>
          </div>
        </div>

        {/* Card 3: Revenue */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-border/40 bg-card/45 backdrop-blur-md relative overflow-hidden group hover:scale-[1.01] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-foreground tracking-tight font-mono">₹42.5k</h3>
            <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+8% from targets</span>
            </p>
          </div>
        </div>

        {/* Card 4: Monthly Growth */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-border/40 bg-card/45 backdrop-blur-md relative overflow-hidden group hover:scale-[1.01] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Monthly Growth</span>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-foreground tracking-tight font-mono">+12%</h3>
            <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
              <Plus className="h-3 w-3" />
              <span>+148 new signups</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex gap-4 items-center">
        <Button onClick={() => router.push('/members')} className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-md shadow-primary/10 rounded-xl px-5 h-11 border-none cursor-pointer">
          <UserPlus className="h-4 w-4 mr-2" /> Add Member
        </Button>
        <Button onClick={() => router.push('/allocations')} variant="outline" className="border-border/45 bg-card/40 hover:bg-muted/50 rounded-xl px-5 h-11 text-foreground cursor-pointer">
          <Calendar className="h-4 w-4 mr-2" /> Schedule Trainer
        </Button>
      </div>

      {/* Main Charts & Activity Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Forecast Chart */}
        <Card className="glass-card border-border/40 lg:col-span-2 p-6 flex flex-col justify-between min-h-[360px]">
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">Revenue Forecast</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">Estimated projections and targets</CardDescription>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">AI Insights Active</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '11px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.2} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Daily Activity Timeline */}
        <Card className="glass-card border-border/40 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">Daily Activity</CardTitle>
            <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View full log</span>
          </div>

          <div className="space-y-5 flex-grow mt-2">
            {/* Log item 1 */}
            <div className="flex gap-4 items-start relative">
              <div className="absolute left-4.5 top-8 bottom-0 w-px bg-border/40" />
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">Morning Rush Handled</h4>
                <p className="text-[10px] text-muted-foreground">08:45 AM • Capacity reached 85%</p>
              </div>
            </div>

            {/* Log item 2 */}
            <div className="flex gap-4 items-start relative">
              <div className="absolute left-4.5 top-8 bottom-0 w-px bg-border/40" />
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                <Dumbbell className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">Personal Trainer Session</h4>
                <p className="text-[10px] text-muted-foreground">10:15 AM • 12 sessions in progress</p>
              </div>
            </div>

            {/* Log item 3 */}
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 border border-orange-500/20">
                <Zap className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">Maintenance Alert</h4>
                <p className="text-[10px] text-muted-foreground">11:30 AM • Treadmill #4 serviced</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Trainer Allocation Canvas Section */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex flex-col space-y-1">
          <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Coaching Allocation Canvas</span>
            <Badge variant="outline" className="border-primary/20 text-primary text-[10px] py-0.5">Neural Network Graph</Badge>
          </h3>
          <p className="text-xs text-muted-foreground">
            Drag nodes to map relationships. Click links to delete allocations.
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="xl:col-span-2">
            <AllocationNetwork allocations={allocations} />
          </div>
          <div>
            <SmartAssignmentPanel />
          </div>
        </div>
      </div>

      {/* Upcoming Renewals Table */}
      <Card className="glass-card border-border/40 p-0">
        <div className="p-6 flex justify-between items-center border-b border-border/40">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">Upcoming Renewals</CardTitle>
          <span onClick={() => router.push('/memberships')} className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="font-semibold text-muted-foreground">Member</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Plan Type</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-right">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-border/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar fallback="JD" size="sm" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Julianne Doe</p>
                      <p className="text-[10px] text-muted-foreground">julianne@gmail.com</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-semibold text-foreground">Platinum Annual</TableCell>
                <TableCell className="text-xs font-bold font-mono text-primary text-right">Oct 15, 2023</TableCell>
              </TableRow>
              <TableRow className="border-b border-border/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar fallback="MB" size="sm" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Marcus Bennett</p>
                      <p className="text-[10px] text-muted-foreground">marcus.b@gmail.com</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-semibold text-foreground">Standard Monthly</TableCell>
                <TableCell className="text-xs font-bold font-mono text-primary text-right">Oct 18, 2023</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}
