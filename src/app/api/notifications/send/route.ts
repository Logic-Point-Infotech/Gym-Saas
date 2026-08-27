import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

// POST /api/notifications/send — Create and send notification to recipients
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return errorResponse('Unauthorized. Admin access only.', 401)
    }

    const { title, message, type, recipientIds } = await request.json()
    if (!title || !message) {
      return errorResponse('Title and message are required', 422)
    }

    // Determine target recipient IDs
    let finalRecipientIds: string[] = []

    if (!recipientIds || recipientIds.length === 0 || recipientIds.includes('ALL')) {
      // Broadcast to all clients
      const clients = await prisma.user.findMany({
        where: { role: 'CLIENT', isDeleted: false },
        select: { id: true },
      })
      finalRecipientIds = clients.map((c) => c.id)
    } else {
      finalRecipientIds = recipientIds
    }

    if (finalRecipientIds.length === 0) {
      return errorResponse('No recipients found to send notification to', 400)
    }

    // Create notification and link recipients in a database transaction
    const notification = await prisma.$transaction(async (tx) => {
      const createdNotification = await tx.notification.create({
        data: {
          title,
          message,
          type: type || 'GENERAL',
          sentById: session.userId,
        },
      })

      // Create recipient entries
      const recipientData = finalRecipientIds.map((userId) => ({
        notificationId: createdNotification.id,
        userId,
      }))

      await tx.notificationRecipient.createMany({
        data: recipientData,
      })

      return createdNotification
    })

    return successResponse(notification, 'Notification sent successfully', 201)
  } catch (error) {
    console.error('POST /api/notifications/send error:', error)
    return errorResponse('Failed to send notification', 500)
  }
}
