'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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
import {
  createMembershipSchema,
  updateMembershipSchema,
  type CreateMembershipInput,
  type UpdateMembershipInput,
} from '@/lib/validators/membership'
import {
  useMemberships,
  useCreateMembership,
  useUpdateMembership,
} from '@/hooks/use-memberships'
import { useMembers } from '@/hooks/use-members'
import { useDashboardStats } from '@/hooks/use-dashboard'
import {
  CreditCard,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Calendar,
  AlertTriangle,
  ArrowRightLeft,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

const statusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return <Badge variant="success">Active</Badge>
    case 'EXPIRED': return <Badge variant="destructive">Expired</Badge>
    case 'FROZEN': return <Badge variant="warning">Frozen</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

export default function MembershipsPage() {
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const pageSize = 8

  // Queries
  const { data: stats } = useDashboardStats()
  const { data: membershipsRes, isLoading, refetch } = useMemberships({ page, pageSize })
  const { data: clientsRes } = useMembers({ page: 1, pageSize: 100 }) // Load clients for dropdown

  // Mutations
  const createMembershipMutation = useCreateMembership()
  const updateMembershipMutation = useUpdateMembership()

  // Selected membership for Status update
  const [selectedMembership, setSelectedMembership] = useState<any>(null)
  
  // Modal visibility states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  // React Hook Form for Add
  const addForm = useForm<CreateMembershipInput>({
    resolver: zodResolver(createMembershipSchema),
    defaultValues: {
      clientId: '',
      planName: 'Basic',
      amount: 999,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    },
  })

  // React Hook Form for Update Status
  const updateForm = useForm<UpdateMembershipInput>({
    resolver: zodResolver(updateMembershipSchema),
  })

  // Pre-fill amount based on plan selection
  const handlePlanChange = (plan: string) => {
    let amt = 999
    let days = 30
    if (plan === 'Standard') {
      amt = 1999
      days = 90
    } else if (plan === 'Premium') {
      amt = 4999
      days = 180
    } else if (plan === 'Annual') {
      amt = 8999
      days = 365
    }
    
    addForm.setValue('amount', amt)
    
    // Set end date automatically based on start date and duration
    const start = addForm.getValues('startDate')
    if (start) {
      const endDateObj = new Date(start)
      endDateObj.setDate(endDateObj.getDate() + days)
      addForm.setValue('endDate', endDateObj.toISOString().split('T')[0])
    }
  }

  // Handle Add Submit
  const onAddSubmit = (data: CreateMembershipInput) => {
    createMembershipMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Membership created successfully', variant: 'success' })
        setIsAddOpen(false)
        addForm.reset()
        refetch()
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to create membership', variant: 'error' })
      },
    })
  }

  // Handle Update Submit
  const onUpdateSubmit = (data: UpdateMembershipInput) => {
    if (!selectedMembership) return
    updateMembershipMutation.mutate(
      { id: selectedMembership.id, data: data as any },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Membership status updated successfully', variant: 'success' })
          setIsUpdateOpen(false)
          refetch()
        },
        onError: (err: any) => {
          toast({ title: 'Error', description: err.message || 'Failed to update membership', variant: 'error' })
        },
      }
    )
  }

  const handleUpdateClick = (membership: any) => {
    setSelectedMembership(membership)
    updateForm.reset({
      status: membership.status,
      endDate: membership.endDate ? new Date(membership.endDate).toISOString().split('T')[0] : '',
      notes: membership.notes || '',
    })
    setIsUpdateOpen(true)
  }

  const memberships = membershipsRes?.data || []
  const total = membershipsRes?.pagination?.total || 0
  const totalPages = membershipsRes?.pagination?.totalPages || 1
  const clients = clientsRes?.data || []

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Memberships" description="Manage memberships, plans, and renewals">
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Membership
        </Button>
      </PageHeader>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Contracts</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-400">{stats?.activeMemberships || 0}</h3>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Expired Contracts</p>
              <h3 className="text-2xl font-bold mt-1 text-rose-400">{stats?.expiredMemberships || 0}</h3>
            </div>
            <div className="h-10 w-10 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Upcoming Renewals (30d)</p>
              <h3 className="text-2xl font-bold mt-1 text-amber-400">{stats?.upcomingRenewals || 0}</h3>
            </div>
            <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Memberships Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : memberships.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberships.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar fallback={m.client?.name || '?'} size="sm" src={m.client?.avatarUrl} />
                          <div>
                            <p className="text-sm font-medium">{m.client?.name}</p>
                            <p className="text-xs text-muted-foreground">{m.client?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold">{m.planName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatCurrency(m.amount)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDate(m.startDate).split(',')[0]}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDate(m.endDate).split(',')[0]}</span>
                      </TableCell>
                      <TableCell>{statusBadge(m.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleUpdateClick(m)} title="Update Status">
                          <ArrowRightLeft className="h-4 w-4 text-primary" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={CreditCard}
              title="No memberships recorded"
              description="Deploy membership plans for gym clients."
              actionLabel="Create Membership"
              onAction={() => setIsAddOpen(true)}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} records
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Membership Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Membership</DialogTitle>
            <DialogDescription>Assign a membership plan to a registered member</DialogDescription>
          </DialogHeader>
          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="membership-client">Select Member</Label>
              <select
                id="membership-client"
                {...addForm.register('clientId')}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                <option value="">-- Choose Member --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
              {addForm.formState.errors.clientId && (
                <p className="text-xs text-destructive mt-1">{addForm.formState.errors.clientId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="membership-plan">Plan Type</Label>
                <select
                  id="membership-plan"
                  {...addForm.register('planName')}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="Basic">Basic (Monthly)</option>
                  <option value="Standard">Standard (3 Months)</option>
                  <option value="Premium">Premium (6 Months)</option>
                  <option value="Annual">Annual (1 Year)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="membership-amount">Amount (₹)</Label>
                <Input
                  id="membership-amount"
                  type="number"
                  error={addForm.formState.errors.amount?.message}
                  {...addForm.register('amount', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="membership-start">Start Date</Label>
                <Input
                  id="membership-start"
                  type="date"
                  error={addForm.formState.errors.startDate?.message}
                  {...addForm.register('startDate')}
                  onChange={(e) => {
                    const plan = addForm.getValues('planName')
                    let days = 30
                    if (plan === 'Standard') days = 90
                    else if (plan === 'Premium') days = 180
                    else if (plan === 'Annual') days = 365

                    if (e.target.value) {
                      const end = new Date(e.target.value)
                      end.setDate(end.getDate() + days)
                      addForm.setValue('endDate', end.toISOString().split('T')[0])
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="membership-end">End Date</Label>
                <Input id="membership-end" type="date" error={addForm.formState.errors.endDate?.message} {...addForm.register('endDate')} />
              </div>
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={createMembershipMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={createMembershipMutation.isPending}>Assign Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Membership Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Membership Status</DialogTitle>
            <DialogDescription>Modify status and logs for member plan</DialogDescription>
          </DialogHeader>
          <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="update-status">Membership Status</Label>
              <select
                id="update-status"
                {...updateForm.register('status')}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                <option value="ACTIVE">Active</option>
                <option value="FROZEN">Frozen (Paused)</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-end">End Date (Extension)</Label>
              <Input id="update-end" type="date" error={updateForm.formState.errors.endDate?.message} {...updateForm.register('endDate')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-notes">Notes</Label>
              <Textarea id="update-notes" placeholder="Reason for status change..." {...updateForm.register('notes')} />
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={updateMembershipMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={updateMembershipMutation.isPending}>Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
