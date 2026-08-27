import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/cron — Daily data reconciliation cron job
export async function GET(request: NextRequest) {
  try {
    // Basic security token verification (optional, e.g. for Vercel Cron protection)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return errorResponse('Unauthorized trigger request', 401)
    }

    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today

    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(today.getDate() + 7)

    // 1. Reconcile Expired Memberships
    // Find all memberships with status ACTIVE that have expired (endDate < today)
    const expiredMemberships = await prisma.membership.findMany({
      where: {
        status: 'ACTIVE',
        isDeleted: false,
        endDate: {
          lt: today,
        },
      },
      select: {
        id: true,
        clientId: true,
        client: { select: { name: true } },
      },
    })

    // Update statuses to EXPIRED in database
    if (expiredMemberships.length > 0) {
      await prisma.membership.updateMany({
        where: {
          id: {
            in: expiredMemberships.map((m) => m.id),
          },
        },
        data: {
          status: 'EXPIRED',
        },
      })
      console.log(`[CRON] Expired ${expiredMemberships.length} active memberships`)
    }

    // 2. Generate Expiring Reminders
    // Find memberships that expire in the next 7 days (endDate between today and sevenDaysFromNow)
    const expiringMemberships = await prisma.membership.findMany({
      where: {
        status: 'ACTIVE',
        isDeleted: false,
        endDate: {
          gte: today,
          lte: sevenDaysFromNow,
        },
      },
      include: {
        client: { select: { id: true, name: true } },
      },
    })

    // Send notifications for expiring memberships
    let notificationsSent = 0
    if (expiringMemberships.length > 0) {
      // Find a system default admin to send notifications
      const defaultAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true },
      })
      
      if (defaultAdmin) {
        for (const m of expiringMemberships) {
          // Check if warning has already been sent to this user in the past 7 days to prevent spam
          const recentWarning = await prisma.notification.findFirst({
            where: {
              type: 'RENEWAL_REMINDER',
              sentById: defaultAdmin.id,
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
              },
              recipients: {
                some: {
                  userId: m.clientId,
                },
              },
            },
          })

          if (!recentWarning) {
            // Send expiring reminder notification
            await prisma.$transaction(async (tx) => {
              const notification = await tx.notification.create({
                data: {
                  title: 'Membership Renewal Reminder',
                  message: `Hello ${m.client.name}, your membership plan is expiring on ${m.endDate.toDateString()}. Please renew at the desk to continue workout sessions.`,
                  type: 'RENEWAL_REMINDER',
                  sentById: defaultAdmin.id,
                },
              })

              await tx.notificationRecipient.create({
                data: {
                  notificationId: notification.id,
                  userId: m.clientId,
                },
              })
            })
            notificationsSent++
          }
        }
      }
    }

    return successResponse({
      success: true,
      reconciledExpiredCount: expiredMemberships.length,
      reminderNotificationsSent: notificationsSent,
      timestamp: new Date().toISOString(),
    }, 'Data reconciliation completed successfully')
  } catch (error) {
    console.error('[CRON] Reconciliation error:', error)
    return errorResponse('Failed to run reconciliation cron', 500)
  }
}
