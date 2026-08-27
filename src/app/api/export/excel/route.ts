import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'members'

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Vyayam AI Management Portal'
    workbook.created = new Date()

    if (type === 'memberships') {
      const sheet = workbook.addWorksheet('Memberships Report')
      sheet.columns = [
        { header: 'ID', key: 'id', width: 25 },
        { header: 'Member Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Plan Name', key: 'planName', width: 15 },
        { header: 'Amount (INR)', key: 'amount', width: 15 },
        { header: 'Start Date', key: 'startDate', width: 15 },
        { header: 'End Date', key: 'endDate', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
      ]

      const memberships = await prisma.membership.findMany({
        where: { isDeleted: false },
        include: { client: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      })

      memberships.forEach(m => {
        sheet.addRow({
          id: m.id,
          name: m.client.name,
          email: m.client.email,
          planName: m.planName,
          amount: m.amount,
          startDate: new Date(m.startDate).toLocaleDateString('en-IN'),
          endDate: new Date(m.endDate).toLocaleDateString('en-IN'),
          status: m.status
        })
      })
    } else {
      const sheet = workbook.addWorksheet('Members Roster')
      sheet.columns = [
        { header: 'ID', key: 'id', width: 25 },
        { header: 'Full Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 18 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Role', key: 'role', width: 12 },
        { header: 'Joined Date', key: 'createdAt', width: 15 },
      ]

      const members = await prisma.user.findMany({
        where: { role: 'CLIENT', isDeleted: false },
        orderBy: { createdAt: 'desc' }
      })

      members.forEach(u => {
        sheet.addRow({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          status: u.status,
          role: u.role,
          createdAt: new Date(u.createdAt).toLocaleDateString('en-IN')
        })
      })
    }

    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=Vyayam_AI_${type}_${Date.now()}.xlsx`
      }
    })
  } catch (error) {
    console.error('GET /api/export/excel error:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to generate Excel report' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
