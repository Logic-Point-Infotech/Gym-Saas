'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { useMembers } from '@/hooks/use-members'
import { useTrainers } from '@/hooks/use-trainers'
import {
  useAllocations,
  useCreateAllocation,
  useDeleteAllocation,
} from '@/hooks/use-allocations'
import {
  Users,
  Dumbbell,
  Link as LinkIcon,
  Trash2,
  CheckCircle,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AllocationsPage() {
  const { toast } = useToast()
  
  // Forms states
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedTrainerId, setSelectedTrainerId] = useState('')

  // Queries
  const { data: allocations, isLoading: allocationsLoading, refetch: refetchAllocations } = useAllocations()
  const { data: clientsRes, isLoading: clientsLoading } = useMembers({ page: 1, pageSize: 100 })
  const { data: trainersRes, isLoading: trainersLoading } = useTrainers({ page: 1, pageSize: 100 })

  // Mutations
  const createAllocationMutation = useCreateAllocation()
  const deleteAllocationMutation = useDeleteAllocation()

  // Handle Assign
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClientId || !selectedTrainerId) {
      toast({ title: 'Error', description: 'Please select both a client and a trainer', variant: 'error' })
      return
    }

    createAllocationMutation.mutate(
      { trainerId: selectedTrainerId, clientId: selectedClientId },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Trainer assigned successfully', variant: 'success' })
          setSelectedClientId('')
          setSelectedTrainerId('')
          refetchAllocations()
        },
        onError: (err: any) => {
          toast({ title: 'Error', description: err.message || 'Failed to assign trainer', variant: 'error' })
        },
      }
    )
  }

  // Handle Remove Allocation
  const handleRemoveAllocation = (id: string) => {
    deleteAllocationMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Allocation removed successfully', variant: 'success' })
        refetchAllocations()
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to remove allocation', variant: 'error' })
      },
    })
  }

  const clients = clientsRes?.data || []
  const trainers = trainersRes?.data || []

  // Filter out clients who already have an active allocation, so we only show unassigned or assignable clients in the selection list
  const activeAllocatedClientIds = allocations?.map((a: any) => a.clientId) || []
  const unassignedClients = clients.filter(c => !activeAllocatedClientIds.includes(c.id))

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Trainer Allocations" description="Pair gym members with personal coaches" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Allocations Matrix / List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Active Allocations</CardTitle>
              <CardDescription>Members currently paired with personal trainers</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {allocationsLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : allocations && allocations.length > 0 ? (
                <div className="divide-y divide-border">
                  {allocations.map((a: any) => (
                    <div key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Client */}
                      <div className="flex items-center gap-3">
                        <Avatar fallback={a.client?.name || '?'} size="sm" src={a.client?.avatarUrl} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{a.client?.name}</p>
                          <p className="text-xs text-muted-foreground">Member</p>
                        </div>
                      </div>

                      {/* Connection Icon */}
                      <div className="hidden sm:flex items-center text-muted-foreground">
                        <LinkIcon className="h-4 w-4" />
                      </div>

                      {/* Trainer */}
                      <div className="flex items-center gap-3">
                        <Avatar fallback={a.trainer?.name || '?'} size="sm" src={a.trainer?.avatarUrl} className="bg-primary/10 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{a.trainer?.name}</p>
                          <p className="text-xs text-muted-foreground">{a.trainer?.specialization || 'Coaching'}</p>
                        </div>
                      </div>

                      {/* Info & Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="text-xs text-muted-foreground">
                          Since {formatDate(a.allocatedAt).split(',')[0]}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAllocation(a.id)}
                          disabled={deleteAllocationMutation.isPending}
                          title="Remove pairing"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={LinkIcon}
                  title="No active pairings found"
                  description="Use the assignment form to pair members with fitness trainers."
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assign Trainer Form */}
        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Assign Trainer</CardTitle>
              <CardDescription>Create a new trainer-member connection</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alloc-client">Select Member</Label>
                  {clientsLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <select
                      id="alloc-client"
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                    >
                      <option value="">-- Choose Member --</option>
                      {/* Show unallocated clients first, then allocated ones */}
                      <optgroup label="Unassigned Members">
                        {unassignedClients.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Reassign (Already Assigned)">
                        {clients.filter(c => activeAllocatedClientIds.includes(c.id)).map((c) => (
                          <option key={c.id} value={c.id}>{c.name} (Active)</option>
                        ))}
                      </optgroup>
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alloc-trainer">Select Trainer</Label>
                  {trainersLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <select
                      id="alloc-trainer"
                      value={selectedTrainerId}
                      onChange={(e) => setSelectedTrainerId(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                    >
                      <option value="">-- Choose Trainer --</option>
                      {trainers.map((t) => (
                        <option key={t.id} value={t.id}>{t.name} ({t.specialization || 'General'})</option>
                      ))}
                    </select>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={createAllocationMutation.isPending}
                  disabled={!selectedClientId || !selectedTrainerId}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Save Assignment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
