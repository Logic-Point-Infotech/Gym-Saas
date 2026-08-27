'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import {
  FileText,
  Users,
  CreditCard,
  TrendingUp,
  Download,
  FileSpreadsheet,
} from 'lucide-react'

export default function ReportsPage() {
  const { toast } = useToast()
  
  // Selection states for each report
  const [memberFormat, setMemberFormat] = useState<'csv' | 'excel'>('csv')
  const [membershipFormat, setMembershipFormat] = useState<'csv' | 'excel'>('csv')
  const [revenueFormat, setRevenueFormat] = useState<'csv' | 'excel'>('csv')

  const handleDownload = (type: string, format: string) => {
    toast({
      title: 'Generating Report',
      description: 'Your download will start shortly...',
      variant: 'info',
    })
    
    // Trigger browser file download directly
    window.location.href = `/api/reports?type=${type}&format=${format}`
  }

  const reports = [
    {
      id: 'members',
      title: 'Member Progress Report',
      description: 'Export all registered gym members with their registration status, phone numbers, and profile details.',
      icon: Users,
      format: memberFormat,
      setFormat: setMemberFormat,
      color: 'text-primary bg-primary/10',
    },
    {
      id: 'memberships',
      title: 'Membership Report',
      description: 'List active, frozen, or expired contracts along with contract start/end dates and billing amounts.',
      icon: CreditCard,
      format: membershipFormat,
      setFormat: setMembershipFormat,
      color: 'text-accent bg-accent/10',
    },
    {
      id: 'revenue',
      title: 'Revenue Report',
      description: 'Review historical payments and revenue breakdown aggregated by active client memberships.',
      icon: TrendingUp,
      format: revenueFormat,
      setFormat: setRevenueFormat,
      color: 'text-primary bg-primary/10',
    },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Reports & Analytics" description="Export system analytics and client statistics for offline review" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="glass-card flex flex-col justify-between">
            <CardHeader>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${report.color}`}>
                <report.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-base font-semibold">{report.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2">
                <Label htmlFor={`format-${report.id}`} className="text-xs text-muted-foreground">Select Format:</Label>
                <select
                  id={`format-${report.id}`}
                  value={report.format}
                  onChange={(e) => report.setFormat(e.target.value as any)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="csv">Comma Separated Values (CSV)</option>
                  <option value="excel">Microsoft Excel (XLSX)</option>
                </select>
              </div>

              <Button className="w-full" onClick={() => handleDownload(report.id, report.format)}>
                {report.format === 'excel' ? (
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-400" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
