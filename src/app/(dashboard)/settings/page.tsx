'use client'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { useSettings, useUpdateSettings } from '@/hooks/use-settings'
import { Settings, Save, ShieldAlert } from 'lucide-react'
import { useEffect } from 'react'

interface SettingsFormInput {
  gymName: string
  gymAddress: string
  gymPhone: string
  notificationAlerts: boolean
  billingCurrency: string
}

export default function SettingsPage() {
  const { toast } = useToast()
  
  // Queries & Mutations
  const { data: settings, isLoading } = useSettings()
  const updateSettingsMutation = useUpdateSettings()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<SettingsFormInput>()

  // Sync data when loaded
  useEffect(() => {
    if (settings) {
      reset({
        gymName: settings.gymName,
        gymAddress: settings.gymAddress,
        gymPhone: settings.gymPhone,
        notificationAlerts: settings.notificationAlerts === 'true',
        billingCurrency: settings.billingCurrency,
      })
    }
  }, [settings, reset])

  const onSubmit = (data: SettingsFormInput) => {
    const payload = {
      ...data,
      notificationAlerts: data.notificationAlerts ? 'true' : 'false',
    }

    updateSettingsMutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Gym settings updated successfully', variant: 'success' })
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to save settings', variant: 'error' })
      },
    })
  }

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Settings" description="Configure gym information, notification preferences, and system parameters" />

      {isLoading ? (
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
          {/* Gym Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Gym Information</CardTitle>
              <CardDescription>Public details and business profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="set-name">Gym Brand Name</Label>
                  <Input id="set-name" {...register('gymName', { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-phone">Contact Number</Label>
                  <Input id="set-phone" {...register('gymPhone')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="set-address">Physical Address</Label>
                <Textarea id="set-address" {...register('gymAddress')} className="h-20" />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">System Preferences</CardTitle>
              <CardDescription>Global defaults and toggles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="set-currency">Billing Currency</Label>
                  <select
                    id="set-currency"
                    {...register('billingCurrency')}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                  >
                    <option value="INR">Indian Rupee (INR - ₹)</option>
                    <option value="USD">US Dollar (USD - $)</option>
                    <option value="EUR">Euro (EUR - €)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold">Enable Automated Reminders</h4>
                  <p className="text-xs text-muted-foreground">Automatically trigger checkup cron jobs and send membership warnings.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register('notificationAlerts')}
                  />
                  <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Security Information Info */}
          <Card className="glass-card border-warning/30 bg-warning/5">
            <CardHeader className="flex-row items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Security Settings</CardTitle>
                <CardDescription className="text-xs">Password hashing and access rules are enforced globally using bcrypt/JWT.</CardDescription>
              </div>
            </CardHeader>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={!isDirty || updateSettingsMutation.isPending}
              isLoading={updateSettingsMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
