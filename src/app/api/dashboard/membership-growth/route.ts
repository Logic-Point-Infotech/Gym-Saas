import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const today = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(today.getMonth() - 5)
    sixMonthsAgo.setDate(1) // Start of month

    // Fetch clients created in the last 6 months
    const clients = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        isDeleted: false,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
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
    clients.forEach((c) => {
      const monthName = months[c.createdAt.getMonth()]
      if (dataMap[monthName] !== undefined) {
        dataMap[monthName] += 1
      }
    })

    // Format for charts
    const chartData = Object.entries(dataMap).map(([name, value]) => ({
      name,
      value,
    }))

    return successResponse(chartData)
  } catch (error) {
    console.error('GET /api/dashboard/membership-growth error:', error)
    return errorResponse('Failed to fetch membership growth data', 500)
  }
}
