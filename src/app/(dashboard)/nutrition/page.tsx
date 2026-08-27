'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { Badge } from '@/components/ui/badge'
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
import { createNutritionLogSchema, type CreateNutritionLogInput } from '@/lib/validators/nutrition'
import { useNutritionLogs, useCreateNutritionLog } from '@/hooks/use-nutrition'
import { useMembers } from '@/hooks/use-members'
import {
  Apple,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'

export default function NutritionPage() {
  const { toast } = useToast()
  
  // States
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL')
  const [page, setPage] = useState(1)
  const pageSize = 8
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Queries
  const { data: logsRes, isLoading, refetch } = useNutritionLogs({
    page,
    pageSize,
    ...(selectedClientId !== 'ALL' && { clientId: selectedClientId }),
  })
  const { data: clientsRes } = useMembers({ page: 1, pageSize: 100 })

  // Mutations
  const createLogMutation = useCreateNutritionLog()

  // Form for Add
  const addForm = useForm<CreateNutritionLogInput>({
    resolver: zodResolver(createNutritionLogSchema),
    defaultValues: {
      clientId: '',
      detectedFood: '',
      calories: undefined,
      protein: undefined,
      carbs: undefined,
      fats: undefined,
      mealType: 'LUNCH',
      imageUrl: '',
    },
  })

  // Handle Add Submit
  const onAddSubmit = (data: CreateNutritionLogInput) => {
    createLogMutation.mutate(data as any, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Nutrition log saved successfully', variant: 'success' })
        setIsAddOpen(false)
        addForm.reset({ clientId: '' })
        refetch()
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to log nutrition', variant: 'error' })
      },
    })
  }

  const mockNutritionLogs = [
    {
      id: 'mock-nut-1',
      loggedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      detectedFood: 'Paneer Tikka with Roti',
      calories: 550,
      protein: 24,
      carbs: 45,
      fats: 18,
      mealType: 'LUNCH',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=400',
      client: {
        name: 'Rahul Sharma',
        email: 'rahul@gmail.com',
        avatarUrl: null
      }
    },
    {
      id: 'mock-nut-2',
      loggedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      detectedFood: 'Oatmeal with Almonds & Banana',
      calories: 380,
      protein: 12,
      carbs: 58,
      fats: 9,
      mealType: 'BREAKFAST',
      imageUrl: 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?q=80&w=400',
      client: {
        name: 'Rahul Sharma',
        email: 'rahul@gmail.com',
        avatarUrl: null
      }
    },
    {
      id: 'mock-nut-3',
      loggedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      detectedFood: 'Quinoa Salad with Roasted Chickpeas',
      calories: 420,
      protein: 15,
      carbs: 62,
      fats: 11,
      mealType: 'LUNCH',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400',
      client: {
        name: 'Priya Patel',
        email: 'priya@gmail.com',
        avatarUrl: null
      }
    },
    {
      id: 'mock-nut-4',
      loggedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      detectedFood: 'Protein Shake & Fruit Bowl',
      calories: 290,
      protein: 26,
      carbs: 30,
      fats: 4,
      mealType: 'SNACK',
      imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=400',
      client: {
        name: 'Priya Patel',
        email: 'priya@gmail.com',
        avatarUrl: null
      }
    },
    {
      id: 'mock-nut-5',
      loggedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      detectedFood: 'Grilled Chicken Breast with Steamed Broccoli',
      calories: 480,
      protein: 42,
      carbs: 12,
      fats: 14,
      mealType: 'DINNER',
      imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=400',
      client: {
        name: 'Amit Kumar',
        email: 'amit@gmail.com',
        avatarUrl: null
      }
    }
  ]

  const rawLogs = logsRes?.data || []
  const hasData = rawLogs.length > 0
  const clients = clientsRes?.data || []

  const activeClientObj = selectedClientId !== 'ALL' ? clients.find(c => c.id === selectedClientId) : null
  const filteredMock = activeClientObj 
    ? mockNutritionLogs.filter(l => l.client.name.toLowerCase() === activeClientObj.name.toLowerCase())
    : mockNutritionLogs

  const logs = hasData ? rawLogs : filteredMock
  const total = hasData ? (logsRes?.pagination?.total || 0) : filteredMock.length
  const totalPages = hasData ? (logsRes?.pagination?.totalPages || 1) : 1


  const isClientFiltered = selectedClientId !== 'ALL'

  // Prepare chart data (using filtered client logs or all logs)
  const chartData = [...logs]
    .reverse()
    .map((l: any) => ({
      date: formatDate(l.loggedAt).split(',')[0],
      Calories: l.calories,
      Protein: l.protein,
    }))



  const activeClientName = isClientFiltered ? clients.find(c => c.id === selectedClientId)?.name : ''

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Nutrition Logs" description="Track macronutrient ingestion and dietary habits">
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Log Meal
        </Button>
      </PageHeader>

      {/* Filter Card */}
      <Card className="glass-card">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Label htmlFor="nutrition-filter" className="text-sm text-muted-foreground shrink-0">Select Member:</Label>
            <select
              id="nutrition-filter"
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value)
                setPage(1)
              }}
              className="w-full sm:w-[220px] rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none"
            >
              <option value="ALL">All Members</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {isClientFiltered && (
            <span className="text-xs text-muted-foreground">
              Showing nutrition history for <strong>{activeClientName}</strong>
            </span>
          )}
        </CardContent>
      </Card>

      {/* Progress Chart */}
      {chartData.length > 0 && (

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Calories & Protein Intake</CardTitle>
            <CardDescription>Daily nutritional stats breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#eab308" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} kcal`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}g`} />
                  <Tooltip contentStyle={{ background: 'rgba(17, 24, 39, 0.95)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                  <Legend />
                  <Bar yAxisId="left" dataKey="Calories" fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar yAxisId="right" dataKey="Protein" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : logs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Meal Type</TableHead>
                    <TableHead>Food Item</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Protein</TableHead>
                    <TableHead>Carbs / Fats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar fallback={l.client?.name || '?'} size="sm" src={l.client?.avatarUrl} />
                          <div>
                            <p className="text-sm font-medium">{l.client?.name}</p>
                            <p className="text-xs text-muted-foreground">{l.client?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground font-medium">{formatDate(l.loggedAt)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{l.mealType.toLowerCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-semibold text-sm">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          <span>{l.detectedFood || 'Logged Meal'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-amber-400">{l.calories} kcal</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-emerald-400">{l.protein}g</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{l.carbs}g / {l.fats}g</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={Apple}
              title="No nutrition records found"
              description="No logs have been submitted yet. Log a meal to get started."
              actionLabel="Log Meal"
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

      {/* Log Meal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Meal Ingestion</DialogTitle>
            <DialogDescription>Record a new meal description for a member</DialogDescription>
          </DialogHeader>
          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nut-client">Select Member</Label>
              <select
                id="nut-client"
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
                <Label htmlFor="nut-food">Food Name</Label>
                <Input id="nut-food" placeholder="e.g. Oatmeal with fruits" error={addForm.formState.errors.detectedFood?.message} {...addForm.register('detectedFood')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nut-mealtype">Meal Type</Label>
                <select
                  id="nut-mealtype"
                  {...addForm.register('mealType')}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                  <option value="SNACK">Snack</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nut-calories">Calories (kcal) <span className="text-destructive">*</span></Label>
                <Input
                  id="nut-calories"
                  type="number"
                  error={addForm.formState.errors.calories?.message}
                  {...addForm.register('calories', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nut-protein">Protein (g) <span className="text-destructive">*</span></Label>
                <Input
                  id="nut-protein"
                  type="number"
                  error={addForm.formState.errors.protein?.message}
                  {...addForm.register('protein', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nut-carbs">Carbs (g)</Label>
                <Input
                  id="nut-carbs"
                  type="number"
                  error={addForm.formState.errors.carbs?.message}
                  {...addForm.register('carbs', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nut-fats">Fats (g)</Label>
                <Input
                  id="nut-fats"
                  type="number"
                  error={addForm.formState.errors.fats?.message}
                  {...addForm.register('fats', { valueAsNumber: true })}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" type="button" disabled={createLogMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={createLogMutation.isPending}>Save Log</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
