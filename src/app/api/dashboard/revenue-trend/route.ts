import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const today = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(today.getMonth() - 5)
    sixMonthsAgo.setDate(1) // Start of month

    // Fetch memberships started in the last 6 months
    const memberships = await prisma.membership.findMany({
      where: {
        isDeleted: false,
        startDate: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        amount: true,
        startDate: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    })

    // Prepare months structure
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dataMap: Record<string, number> = {}

    // Initialize map
    for (let i = 0; i < 6; i++) {
      const d = new Date()
      d.setMonth(today.getMonth() - (5 - i))
      const monthName = months[d.getMonth()]
      dataMap[monthName] = 0
    }

    // Populate data
    memberships.forEach((m) => {
      const monthName = months[m.startDate.getMonth()]
      if (dataMap[monthName] !== undefined) {
        dataMap[monthName] += m.amount
      }
    })

    // Format for charts
    const chartData = Object.entries(dataMap).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }))

    return successResponse(chartData)
  } catch (error) {
    console.error('GET /api/dashboard/revenue-trend error:', error)
    return errorResponse('Failed to fetch revenue trend data', 500)
  }
}
