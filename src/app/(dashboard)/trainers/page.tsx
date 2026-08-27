'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  createTrainerSchema,
  updateTrainerSchema,
  type CreateTrainerInput,
  type UpdateTrainerInput,
} from '@/lib/validators/trainer'
import {
  useTrainers,
  useCreateTrainer,
  useUpdateTrainer,
  useDeleteTrainer,
} from '@/hooks/use-trainers'
import {
  Dumbbell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Award,
  BookOpen,
} from 'lucide-react'

const statusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return <Badge variant="success">Active</Badge>
    case 'INACTIVE': return <Badge variant="secondary">Inactive</Badge>
    case 'SUSPENDED': return <Badge variant="destructive">Suspended</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

export default function TrainersPage() {
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const pageSize = 8

  // Queries
  const { data: trainersRes, isLoading, refetch } = useTrainers({ page, pageSize })

  // Mutations
  const createTrainerMutation = useCreateTrainer()
  const updateTrainerMutation = useUpdateTrainer()
  const deleteTrainerMutation = useDeleteTrainer()

  // Selected trainer for Edit/Delete
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null)
  
  // Modal visibility states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // React Hook Form for Add
  const addForm = useForm<any>({
    resolver: zodResolver(createTrainerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      specialization: '',
      experience: undefined,
    },
  })

  // React Hook Form for Edit
  const editForm = useForm<any>({
    resolver: zodResolver(updateTrainerSchema),
  })

  // Handle Add Submit
  const onAddSubmit = (data: any) => {
    createTrainerMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Trainer created successfully', variant: 'success' })
        setIsAddOpen(false)
        addForm.reset()
        refetch()
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to create trainer', variant: 'error' })
      },
    })
  }

  // Handle Edit Submit
  const onEditSubmit = (data: any) => {
    if (!selectedTrainer) return
    updateTrainerMutation.mutate(
      { id: selectedTrainer.id, data: data as any },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Trainer updated successfully', variant: 'success' })
          setIsEditOpen(false)
          refetch()
        },
        onError: (err: any) => {
          toast({ title: 'Error', description: err.message || 'Failed to update trainer', variant: 'error' })
        },
      }
    )
  }

  // Handle Delete Confirm
  const onDeleteConfirm = () => {
    if (!selectedTrainer) return
    deleteTrainerMutation.mutate(selectedTrainer.id, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Trainer deleted successfully', variant: 'success' })
        refetch()
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to delete trainer', variant: 'error' })
      },
    })
  }

  const handleEditClick = (trainer: any) => {
    setSelectedTrainer(trainer)
    editForm.reset({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone || '',
      specialization: trainer.specialization || '',
      experience: trainer.experience || undefined,
      status: trainer.status,
    })
    setIsEditOpen(true)
  }

  const handleDeleteClick = (trainer: any) => {
    setSelectedTrainer(trainer)
    setIsDeleteOpen(true)
  }

  const trainers = trainersRes?.data || []
  const total = trainersRes?.pagination?.total || 0
  const totalPages = trainersRes?.pagination?.totalPages || 1

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Trainers" description="Manage trainers, coaching staff, and assignments">
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Trainer
        </Button>
      </PageHeader>

      {/* Trainers Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : trainers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Active Clients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar fallback={t.name} size="sm" src={t.avatarUrl} />
                          <div>
                            <p className="text-sm font-medium">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{t.phone || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <BookOpen className="h-3.5 w-3.5 text-primary" />
                          <span>{t.specialization || 'General'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Award className="h-3.5 w-3.5 text-amber-400" />
                          <span>{t.experience ? `${t.experience} Years` : 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-foreground">
                          {(t as any)._count?.trainerAllocations || 0} Clients
                        </span>
                      </TableCell>
                      <TableCell>{statusBadge(t.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(t)} title="Edit">
                            <Edit2 className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(t)} title="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={Dumbbell}
              title="No trainers found"
              description="Register new fitness instructors to assign to gym members."
              actionLabel="Add Trainer"
              onAction={() => setIsAddOpen(true)}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} trainers
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

      {/* Add Trainer Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Trainer</DialogTitle>
            <DialogDescription>Create a profile for a gym coach/instructor</DialogDescription>
          </DialogHeader>
          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trainer-name">Full Name</Label>
              <Input id="trainer-name" error={addForm.formState.errors.name?.message as any} {...addForm.register('name')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-email">Email Address</Label>
              <Input id="trainer-email" type="email" error={addForm.formState.errors.email?.message as any} {...addForm.register('email')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-password">Password</Label>
              <Input id="trainer-password" type="password" error={addForm.formState.errors.password?.message as any} {...addForm.register('password')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-phone">Phone Number</Label>
              <Input id="trainer-phone" error={addForm.formState.errors.phone?.message as any} {...addForm.register('phone')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainer-spec">Specialization</Label>
                <Input id="trainer-spec" placeholder="e.g. CrossFit" error={addForm.formState.errors.specialization?.message as any} {...addForm.register('specialization')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainer-exp">Experience (Years)</Label>
                <Input
                  id="trainer-exp"
                  type="number"
                  error={addForm.formState.errors.experience?.message as any}
                  {...addForm.register('experience', { valueAsNumber: true })}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={createTrainerMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={createTrainerMutation.isPending}>Create Trainer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Trainer Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Trainer Details</DialogTitle>
            <DialogDescription>Update info and status of the instructor</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-spec">Specialization</Label>
                <Input id="edit-spec" error={editForm.formState.errors.specialization?.message as any} {...editForm.register('specialization')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-exp">Experience (Years)</Label>
                <Input
                  id="edit-exp"
                  type="number"
                  error={editForm.formState.errors.experience?.message as any}
                  {...editForm.register('experience', { valueAsNumber: true })}
                />
              </div>
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

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={updateTrainerMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={updateTrainerMutation.isPending}>Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={onDeleteConfirm}
        title={`Delete trainer ${selectedTrainer?.name}?`}
        description="Are you sure you want to delete this trainer? Clients allocated to this trainer will need reassignment."
        isLoading={deleteTrainerMutation.isPending}
      />
    </div>
  )
}
