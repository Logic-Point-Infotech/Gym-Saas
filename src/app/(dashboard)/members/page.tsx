'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
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
  createMemberSchema,
  updateMemberSchema,
} from '@/lib/validators/member'
import {
  useMembers,
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
} from '@/hooks/use-members'
import {
  Users,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Download,
} from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

export default function MembersPage() {
  const { toast } = useToast()
  
  // Search, Filters & Pagination state
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('ALL')
  const [page, setPage] = useState(1)
  const pageSize = 8

  // Queries
  const { data: membersRes, isLoading, refetch } = useMembers({
    page,
    pageSize,
    search: search || undefined,
    status: status !== 'ALL' ? status : undefined,
  })

  // Mutations
  const createMemberMutation = useCreateMember()
  const updateMemberMutation = useUpdateMember()
  const deleteMemberMutation = useDeleteMember()

  // Selected member for Edit/Delete
  const [selectedMember, setSelectedMember] = useState<any>(null)
  
  // Modal visibility states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // React Hook Form for Add
  const addForm = useForm<any>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      gender: 'MALE',
      dateOfBirth: '',
      address: '',
      heightCm: undefined,
      weightKg: undefined,
    },
  })

  // React Hook Form for Edit
  const editForm = useForm<any>({
    resolver: zodResolver(updateMemberSchema),
  })

  // Handle Add Member Submit
  const onAddSubmit = (data: any) => {
    createMemberMutation.mutate(data as any, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Member created successfully', variant: 'success' })
        setIsAddOpen(false)
        addForm.reset()
        refetch()
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to create member', variant: 'error' })
      },
    })
  }

  // Handle Edit Member Submit
  const onEditSubmit = (data: any) => {
    if (!selectedMember) return
    updateMemberMutation.mutate(
      { id: selectedMember.id, data: data as any },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Member updated successfully', variant: 'success' })
          setIsEditOpen(false)
          refetch()
        },
        onError: (err: any) => {
          toast({ title: 'Error', description: err.message || 'Failed to update member', variant: 'error' })
        },
      }
    )
  }

  // Handle Delete Member Confirm
  const onDeleteConfirm = () => {
    if (!selectedMember) return
    deleteMemberMutation.mutate(selectedMember.id, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Member deleted successfully', variant: 'success' })
        refetch()
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to delete member', variant: 'error' })
      },
    })
  }

  const handleEditClick = (member: any) => {
    setSelectedMember(member)
    editForm.reset({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      gender: member.gender || 'MALE',
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
      address: member.address || '',
      heightCm: member.heightCm || undefined,
      weightKg: member.weightKg || undefined,
      status: member.status,
    })
    setIsEditOpen(true)
  }

  const handleDeleteClick = (member: any) => {
    setSelectedMember(member)
    setIsDeleteOpen(true)
  }

  const exportCsv = () => {
    if (!membersRes?.data) return
    const headers = ['Name', 'Email', 'Phone', 'Gender', 'Status', 'Joined Date']
    const rows = membersRes.data.map(m => [
      m.name,
      m.email,
      m.phone || '',
      m.gender || '',
      m.status,
      formatDate(m.createdAt),
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `gym_members_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const members = membersRes?.data || []
  const total = membersRes?.pagination?.total || 0
  const totalPages = membersRes?.pagination?.totalPages || 1

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      <PageHeader title="Members" description="Manage gym member profiles and subscriptions">
        <Button variant="outline" onClick={exportCsv} disabled={members.length === 0}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all" />
          <Input
            placeholder="Search by Member ID (e.g. vyayam_0410, vyayam_2102), Name, Phone, or Email..."
            className="pl-12 pr-4 py-3 h-12 bg-card/60 backdrop-blur-md border-border/45 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
          {[
            { value: 'ALL', label: 'All Members' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' },
            { value: 'SUSPENDED', label: 'Suspended' },
          ].map((chip) => {
            const isActive = status === chip.value
            return (
              <button
                key={chip.value}
                onClick={() => {
                  setStatus(chip.value)
                  setPage(1)
                }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10 font-bold"
                    : "bg-card/60 border border-border/40 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {chip.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Member Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glass-card p-6 space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </Card>
          ))}
        </div>
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member: any) => {
            const activeMembership = member.memberships?.[0]
            const planName = activeMembership ? activeMembership.planName : 'No Plan'
            const displayMemberId = member.memberId || `GYM-2026-${String(member.id).slice(-5).toUpperCase()}`
            
            // Map custom health score based on user details
            let healthScore = 85
            if (member.name === 'Marcus Sterling') healthScore = 68
            else if (member.name === 'Alex Rivera') healthScore = 92
            else if (member.name === 'Elena Vance') healthScore = 84
            else if (member.name === 'Jordan Thorne') healthScore = 42
            else {
              const charCodeSum = member.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
              healthScore = 50 + (charCodeSum % 46)
            }

            const healthColor = healthScore >= 80 ? 'bg-primary' : healthScore >= 60 ? 'bg-secondary' : 'bg-destructive'
            const healthTextColor = healthScore >= 80 ? 'text-primary' : healthScore >= 60 ? 'text-secondary' : 'text-destructive'

            return (
              <div key={member.id} className="glass-card rounded-xl p-6 flex flex-col gap-4 animate-fade-in relative hover:border-primary/40 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <Avatar fallback={member.name} size="md" src={member.avatarUrl} className="ring-2 ring-primary/10" />
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-tight">{member.name}</h3>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          planName === 'Premium' && "bg-primary/10 text-primary",
                          planName === 'Standard' && "bg-secondary/10 text-secondary",
                          planName === 'Basic' && "bg-muted text-muted-foreground",
                          planName === 'No Plan' && "bg-muted/50 text-muted-foreground"
                        )}>
                          {planName}
                        </span>
                        <span className="text-[11px] text-primary font-bold font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          {displayMemberId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(member)} title="Edit" className="h-8 w-8 rounded-full hover:bg-primary/10">
                      <Edit2 className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(member)} title="Delete" className="h-8 w-8 rounded-full hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/40">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Health Index</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full", healthColor)} style={{ width: `${healthScore}%` }}></div>
                      </div>
                      <span className={cn("text-xs font-bold font-mono", healthTextColor)}>{healthScore}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone</p>
                    <p className="text-xs font-medium text-foreground mt-1.5">{member.phone || 'N/A'}</p>
                  </div>
                </div>

                <a
                  href={`/members/${member.id}`}
                  className="mt-2 text-center py-2 px-4 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-semibold text-xs rounded-lg transition-all border border-primary/20 flex items-center justify-center gap-2"
                >
                  View Member 360° Profile →
                </a>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No members found"
          description="Try adjusting your filters or search criteria."
          actionLabel="Add Member"
          onAction={() => setIsAddOpen(true)}
        />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border border-border/40 bg-card/40 backdrop-blur-md rounded-xl">
          <span className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} members
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

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-primary/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer border-none"
        title="Add New Member"
      >
        <UserPlus className="h-6 w-6" />
      </button>

      {/* Add Member Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>Create a profile for a new gym member</DialogDescription>
          </DialogHeader>
          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name</Label>
                <Input id="add-name" error={addForm.formState.errors.name?.message as any} {...addForm.register('name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-email">Email Address</Label>
                <Input id="add-email" type="email" error={addForm.formState.errors.email?.message as any} {...addForm.register('email')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-password">Password</Label>
                <Input id="add-password" type="password" error={addForm.formState.errors.password?.message as any} {...addForm.register('password')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone Number</Label>
                <Input id="add-phone" error={addForm.formState.errors.phone?.message as any} {...addForm.register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-gender">Gender</Label>
                <select
                  id="add-gender"
                  {...addForm.register('gender')}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-dob">Date of Birth</Label>
                <Input id="add-dob" type="date" error={addForm.formState.errors.dateOfBirth?.message as any} {...addForm.register('dateOfBirth')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-height">Height (cm)</Label>
                <Input
                  id="add-height"
                  type="number"
                  error={addForm.formState.errors.heightCm?.message as any}
                  {...addForm.register('heightCm', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-weight">Weight (kg)</Label>
                <Input
                  id="add-weight"
                  type="number"
                  error={addForm.formState.errors.weightKg?.message as any}
                  {...addForm.register('weightKg', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-address">Home Address</Label>
              <Textarea id="add-address" error={addForm.formState.errors.address?.message as any} {...addForm.register('address')} />
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={createMemberMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={createMemberMutation.isPending}>Create Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>Update member profile details</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" error={editForm.formState.errors.name?.message as any} {...editForm.register('name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input id="edit-email" type="email" error={editForm.formState.errors.email?.message as any} {...editForm.register('email')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input id="edit-phone" error={editForm.formState.errors.phone?.message as any} {...editForm.register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <select
                  id="edit-gender"
                  {...editForm.register('gender')}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dob">Date of Birth</Label>
                <Input id="edit-dob" type="date" error={editForm.formState.errors.dateOfBirth?.message as any} {...editForm.register('dateOfBirth')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  {...editForm.register('status')}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-height">Height (cm)</Label>
                <Input
                  id="edit-height"
                  type="number"
                  error={editForm.formState.errors.heightCm?.message as any}
                  {...editForm.register('heightCm', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-weight">Weight (kg)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  error={editForm.formState.errors.weightKg?.message as any}
                  {...editForm.register('weightKg', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Home Address</Label>
              <Textarea id="edit-address" error={editForm.formState.errors.address?.message as any} {...editForm.register('address')} />
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={updateMemberMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={updateMemberMutation.isPending}>Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={onDeleteConfirm}
        title={`Delete member ${selectedMember?.name}?`}
        description="Are you sure you want to delete this member? All their data, including memberships and health records, will be archived or deleted permanently. This action cannot be undone."
        isLoading={deleteMemberMutation.isPending}
      />
    </div>
  )
}
