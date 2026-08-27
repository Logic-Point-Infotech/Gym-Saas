'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendNotificationSchema, type SendNotificationInput } from '@/lib/validators/notification'
import { useNotifications, useSendNotification } from '@/hooks/use-notifications'
import { useMembers } from '@/hooks/use-members'
import {
  Bell,
  Send,
  Users,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

const typeBadge = (type: string) => {
  switch (type) {
    case 'GENERAL': return <Badge variant="secondary">General</Badge>
    case 'HOLIDAY_NOTICE': return <Badge variant="warning">Holiday</Badge>
    case 'MAINTENANCE': return <Badge variant="destructive">Maintenance</Badge>
    case 'RENEWAL_REMINDER': return <Badge variant="success">Renewal</Badge>
    case 'EXPIRY_ALERT': return <Badge variant="destructive">Expiry</Badge>
    default: return <Badge variant="outline">{type}</Badge>
  }
}

export default function NotificationsPage() {
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const pageSize = 5
  
  // Selection states
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'SPECIFIC'>('ALL')

  // Queries
  const { data: notificationsRes, isLoading, refetch } = useNotifications({ page, pageSize })
  const { data: clientsRes } = useMembers({ page: 1, pageSize: 100 })

  // Mutations
  const sendNotificationMutation = useSendNotification()

  // Form for Compose
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SendNotificationInput>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'GENERAL',
      recipientIds: ['ALL'],
    },
  })

  // Watch fields
  const watchRecipientIds = watch('recipientIds')

  // Handle Send
  const onSendSubmit = (data: SendNotificationInput) => {
    sendNotificationMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Notification sent successfully', variant: 'success' })
        reset({
          title: '',
          message: '',
          type: 'GENERAL',
          recipientIds: targetAudience === 'ALL' ? ['ALL'] : [],
        })
        refetch()
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to send notification', variant: 'error' })
      },
    })
  }

  const notifications = notificationsRes?.data || []
  const total = notificationsRes?.pagination?.total || 0
  const totalPages = notificationsRes?.pagination?.totalPages || 1
  const clients = clientsRes?.data || []

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Notification Center" description="Send announcements and alert notifications to members" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Compose Form */}
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Compose Announcement</CardTitle>
              <CardDescription>Draft and broadcast gym updates</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSendSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notif-title">Title</Label>
                  <Input id="notif-title" placeholder="e.g. Gym closure notice" error={errors.title?.message} {...register('title')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notif-type">Notification Type</Label>
                  <select
                    id="notif-type"
                    {...register('type')}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                  >
                    <option value="GENERAL">General Alert</option>
                    <option value="HOLIDAY_NOTICE">Holiday Notice</option>
                    <option value="MAINTENANCE">Maintenance Alert</option>
                    <option value="RENEWAL_REMINDER">Renewal Reminder</option>
                    <option value="EXPIRY_ALERT">Membership Expiry Alert</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={targetAudience === 'ALL' ? 'default' : 'outline'}
                      onClick={() => {
                        setTargetAudience('ALL')
                        setValue('recipientIds', ['ALL'])
                      }}
                      className="text-xs"
                    >
                      <Users className="mr-1.5 h-3.5 w-3.5" /> Broadcast (All)
                    </Button>
                    <Button
                      type="button"
                      variant={targetAudience === 'SPECIFIC' ? 'default' : 'outline'}
                      onClick={() => {
                        setTargetAudience('SPECIFIC')
                        setValue('recipientIds', [])
                      }}
                      className="text-xs"
                    >
                      <Bell className="mr-1.5 h-3.5 w-3.5" /> Specific Clients
                    </Button>
                  </div>
                </div>

                {targetAudience === 'SPECIFIC' && (
                  <div className="space-y-2">
                    <Label htmlFor="notif-recipients">Select Target Clients</Label>
                    <select
                      id="notif-recipients"
                      multiple
                      className="w-full h-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                      onChange={(e) => {
                        const selectedValues = Array.from(e.target.selectedOptions, option => option.value)
                        setValue('recipientIds', selectedValues)
                      }}
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-muted-foreground">Hold Ctrl / Cmd to select multiple clients</p>
                    {errors.recipientIds && (
                      <p className="text-xs text-destructive mt-1">{errors.recipientIds.message}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notif-msg">Message Body</Label>
                  <Textarea id="notif-msg" placeholder="Write announcement details..." error={errors.message?.message} {...register('message')} className="h-28" />
                </div>

                <Button type="submit" className="w-full" isLoading={sendNotificationMutation.isPending}>
                  <Send className="mr-2 h-4 w-4" /> Send Announcement
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Broadcast Logs</CardTitle>
              <CardDescription>History of sent notifications and outreach</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map((n: any) => (
                    <div key={n.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {typeBadge(n.type)}
                          <h4 className="text-sm font-semibold text-foreground">{n.title}</h4>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-1 whitespace-pre-line">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>Sent By: <strong>{n.sentBy?.name || 'Admin'}</strong></span>
                        <div className="flex items-center gap-1.5">
                          <Info className="h-3 w-3" />
                          <span>Delivered to <strong>{n.recipients?.length || 0}</strong> recipients</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Bell}
                  title="No notification log"
                  description="Composed messages and broadcast records will appear here."
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} logs
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
        </div>
      </div>
    </div>
  )
}
