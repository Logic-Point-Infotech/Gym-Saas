'use client'

import React, { useState } from 'react'
import { useMembers } from '@/hooks/use-members'
import { useTrainers } from '@/hooks/use-trainers'
import { useCreateAllocation } from '@/hooks/use-allocations'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { Sparkles, BrainCircuit, UserCheck } from 'lucide-react'

export function SmartAssignmentPanel() {
  const { toast } = useToast()
  
  // Queries
  const { data: clientsRes } = useMembers({ page: 1, pageSize: 100 })
  const { data: trainersRes } = useTrainers({ page: 1, pageSize: 100 })
  
  // Mutation
  const createAllocationMutation = useCreateAllocation()

  // Selected values
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedTrainerId, setSelectedTrainerId] = useState('')

  const clients = clientsRes?.data || []
  const trainers = trainersRes?.data || []

  // Mock AI matching percentages
  const aiMatches = [
    { client: 'Rahul Sharma', trainer: 'Arjun Kapoor', percent: 98, reason: 'Weight goals & Strength specialization' },
    { client: 'Priya Patel', trainer: 'Meera Joshi', percent: 94, reason: 'Cardio focus & Yoga specialization' },
    { client: 'Amit Kumar', trainer: 'Ravi Shankar', percent: 95, reason: 'CrossFit match' },
  ]

  const handleAssign = () => {
    if (!selectedClientId || !selectedTrainerId) {
      toast({ title: 'Error', description: 'Please select both a client and a trainer', variant: 'error' })
      return
    }

    createAllocationMutation.mutate(
      { trainerId: selectedTrainerId, clientId: selectedClientId },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Coaching allocation assigned successfully', variant: 'success' })
          setSelectedClientId('')
          setSelectedTrainerId('')
        },
        onError: (err: any) => {
          toast({ title: 'Error', description: err.message || 'Failed to assign trainer', variant: 'error' })
        },
      }
    )
  }

  return (
    <div className="w-full xl:w-96 rounded-2xl border border-border/40 bg-card/25 backdrop-blur-md p-6 shadow-2xl flex flex-col justify-between h-[580px]">
      <div className="space-y-5">
        {/* Title */}
        <div className="flex items-center gap-2 pb-3 border-b border-border/40">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Smart Matchmaker</h3>
        </div>

        {/* Client Selection */}
        <div className="space-y-2">
          <Label htmlFor="smart-client" className="text-xs text-muted-foreground font-semibold">Select Member</Label>
          <select
            id="smart-client"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full rounded-xl border border-border bg-[#030712]/50 px-3 py-2 text-sm outline-none text-foreground focus:ring-2 focus:ring-primary/45 transition-all"
          >
            <option value="">-- Choose Member --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.status})
              </option>
            ))}
          </select>
        </div>

        {/* Trainer Selection */}
        <div className="space-y-2">
          <Label htmlFor="smart-trainer" className="text-xs text-muted-foreground font-semibold">Select Trainer</Label>
          <select
            id="smart-trainer"
            value={selectedTrainerId}
            onChange={(e) => setSelectedTrainerId(e.target.value)}
            className="w-full rounded-xl border border-border bg-[#030712]/50 px-3 py-2 text-sm outline-none text-foreground focus:ring-2 focus:ring-primary/45 transition-all"
          >
            <option value="">-- Choose Trainer --</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.specialization || 'General'})
              </option>
            ))}
          </select>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-3 pt-3 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>AI Match Recommendations</span>
          </div>
          <div className="space-y-2.5">
            {aiMatches.map((match, idx) => (
              <div 
                key={idx} 
                className="p-2.5 rounded-xl border border-border/30 bg-[#030712]/30 text-[10px] space-y-1 hover:border-primary/40 transition-all cursor-pointer"
                onClick={() => {
                  const c = clients.find(cl => cl.name === match.client)
                  const t = trainers.find(tr => tr.name === match.trainer)
                  if (c && t) {
                    setSelectedClientId(c.id)
                    setSelectedTrainerId(t.id)
                    toast({ title: 'AI Match Loaded', description: `Loaded match recommendation`, variant: 'success' })
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground truncate">{match.client} ⇄ {match.trainer}</span>
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-md text-[8px]">{match.percent}% match</span>
                </div>
                <p className="text-muted-foreground truncate">{match.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      <div className="pt-4 border-t border-border/40">
        <Button
          onClick={handleAssign}
          disabled={createAllocationMutation.isPending}
          className="w-full bg-gradient-to-r from-primary to-[hsl(275,100%,65%)] hover:shadow-lg hover:shadow-primary/45 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse-glow"
        >
          <UserCheck className="h-4 w-4" />
          <span>Allocate Trainer</span>
        </Button>
      </div>
    </div>
  )
}
