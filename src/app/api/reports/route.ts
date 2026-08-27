import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { errorResponse } from '@/lib/api-response'
import ExcelJS from 'exceljs'

// GET /api/reports — Export reports as Excel or CSV
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return errorResponse('Unauthorized. Admin access only.', 401)
    }

    const { searchParams } = request.nextUrl
    const type = searchParams.get('type') // 'members' | 'memberships' | 'revenue'
    const format = searchParams.get('format') || 'csv' // 'csv' | 'excel'

    if (!type || !['members', 'memberships', 'revenue'].includes(type)) {
      return errorResponse('Invalid report type. Must be members, memberships, or revenue.', 422)
    }

    // Dispatch notification to Express Backend (Port 5000) & Python FastAPI (Port 8000)
    try {
      fetch('http://localhost:5000/api/express/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'report.generated',
          payload: { reportType: type, requestedBy: session.email }
        })
      }).catch(err => console.log('Express webhook error:', err.message))

      fetch('http://localhost:8000/api/v1/ai/member/health-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age: 30, bmi: 24.5, systolic_bp: 120, diastolic_bp: 80 })
      }).catch(err => console.log('Python AI service notification error:', err.message))
    } catch (e) {}

    // 1. Fetch relevant data based on type
    let data: any[] = []
    let filename = `report_${type}_${Date.now()}`

    if (type === 'members') {
      data = await prisma.user.findMany({
        where: { role: 'CLIENT', isDeleted: false },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          gender: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    } else if (type === 'memberships') {
      data = await prisma.membership.findMany({
        where: { isDeleted: false },
        include: { client: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      })
    } else if (type === 'revenue') {
      data = await prisma.membership.findMany({
        where: { isDeleted: false },
        select: {
          id: true,
          planName: true,
          amount: true,
          startDate: true,
          endDate: true,
          status: true,
        },
        orderBy: { startDate: 'desc' },
      })
    }

    // 2. Generate CSV format
    if (format === 'csv') {
      let csvContent = ''
      if (type === 'members') {
        csvContent += 'ID,Name,Email,Phone,Gender,Status,Joined Date\n'
        data.forEach((m) => {
          csvContent += `"${m.id}","${m.name}","${m.email}","${m.phone || ''}","${m.gender || ''}","${m.status}","${m.createdAt.toISOString()}"\n`
        })
      } else if (type === 'memberships') {
        csvContent += 'ID,Client Name,Client Email,Plan Name,Amount,Start Date,End Date,Status\n'
        data.forEach((m) => {
          csvContent += `"${m.id}","${m.client?.name || ''}","${m.client?.email || ''}","${m.planName}",${m.amount},"${m.startDate.toISOString()}","${m.endDate.toISOString()}","${m.status}"\n`
        })
      } else if (type === 'revenue') {
        csvContent += 'ID,Plan Name,Amount,Start Date,End Date,Status\n'
        data.forEach((r) => {
          csvContent += `"${r.id}","${r.planName}",${r.amount},"${r.startDate.toISOString()}","${r.endDate.toISOString()}","${r.status}"\n`
        })
      }

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      })
    }

    // 3. Generate Excel format using exceljs
    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Report Data')

      if (type === 'members') {
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 25 },
          { header: 'Name', key: 'name', width: 25 },
          { header: 'Email', key: 'email', width: 30 },
          { header: 'Phone', key: 'phone', width: 15 },
          { header: 'Gender', key: 'gender', width: 10 },
          { header: 'Status', key: 'status', width: 12 },
          { header: 'Joined Date', key: 'joined', width: 25 },
        ]
        data.forEach((m) => {
          worksheet.addRow({
            id: m.id,
            name: m.name,
            email: m.email,
            phone: m.phone || 'N/A',
            gender: m.gender || 'N/A',
            status: m.status,
            joined: m.createdAt.toDateString(),
          })
        })
      } else if (type === 'memberships') {
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 25 },
          { header: 'Client Name', key: 'clientName', width: 25 },
          { header: 'Client Email', key: 'clientEmail', width: 30 },
          { header: 'Plan Name', key: 'plan', width: 15 },
          { header: 'Amount', key: 'amount', width: 15 },
          { header: 'Start Date', key: 'start', width: 20 },
          { header: 'End Date', key: 'end', width: 20 },
          { header: 'Status', key: 'status', width: 12 },
        ]
        data.forEach((m) => {
          worksheet.addRow({
            id: m.id,
            clientName: m.client?.name || 'N/A',
            clientEmail: m.client?.email || 'N/A',
            plan: m.planName,
            amount: m.amount,
            start: m.startDate.toDateString(),
            end: m.endDate.toDateString(),
            status: m.status,
          })
        })
      } else if (type === 'revenue') {
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 25 },
          { header: 'Plan Name', key: 'plan', width: 15 },
          { header: 'Amount (INR)', key: 'amount', width: 15 },
          { header: 'Start Date', key: 'start', width: 20 },
          { header: 'End Date', key: 'end', width: 20 },
          { header: 'Status', key: 'status', width: 12 },
        ]
        data.forEach((r) => {
          worksheet.addRow({
            id: r.id,
            plan: r.planName,
            amount: r.amount,
            start: r.startDate.toDateString(),
            end: r.endDate.toDateString(),
            status: r.status,
          })
        })
      }

      // Add styling to header row
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } }
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1E3A8A' }, // dark blue header
      }

      const buffer = await workbook.xlsx.writeBuffer()

      return new NextResponse(buffer as ArrayBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
        },
      })
    }

    return errorResponse('Invalid format requested', 400)
  } catch (error) {
    console.error('GET /api/reports error:', error)
    return errorResponse('Failed to generate report', 500)
  }
}
