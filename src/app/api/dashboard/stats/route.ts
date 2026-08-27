import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const nextThirtyDays = new Date()
    nextThirtyDays.setDate(today.getDate() + 30)

    // 1. Total Members (Clients)
    const totalMembers = await prisma.user.count({
      where: { role: 'CLIENT', isDeleted: false },
    })

    // 2. Total Trainers
    const totalTrainers = await prisma.user.count({
      where: { role: 'TRAINER', isDeleted: false },
    })

    // 3. Active Memberships
    const activeMemberships = await prisma.membership.count({
      where: { status: 'ACTIVE', isDeleted: false },
    })

    // 4. Expired Memberships
    const expiredMemberships = await prisma.membership.count({
      where: { status: 'EXPIRED', isDeleted: false },
    })

    // 5. Upcoming Renewals (active memberships expiring in next 30 days)
    const upcomingRenewals = await prisma.membership.count({
      where: {
        status: 'ACTIVE',
        isDeleted: false,
        endDate: {
          gte: today,
          lte: nextThirtyDays,
        },
      },
    })

    // 6. New Members This Month (clients created in last 30 days)
    const newMembersThisMonth = await prisma.user.count({
      where: {
        role: 'CLIENT',
        isDeleted: false,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // 7. Monthly Revenue (sum of amounts of memberships started in the last 30 days)
    const revenueSum = await prisma.membership.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        isDeleted: false,
        startDate: {
          gte: thirtyDaysAgo,
        },
      },
    })

    const monthlyRevenue = revenueSum._sum.amount || 0

    return successResponse({
      totalMembers,
      activeMembers: activeMemberships, // active members corresponds to active memberships in this model
      activeMemberships,
      expiredMemberships,
      upcomingRenewals,
      totalTrainers,
      monthlyRevenue,
      newMembersThisMonth,
    })
  } catch (error) {
    console.error('GET /api/dashboard/stats error:', error)
    return errorResponse('Failed to fetch dashboard stats', 500)
  }
}
