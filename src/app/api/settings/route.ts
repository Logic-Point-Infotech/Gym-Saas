import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/settings — Retrieve all gym configuration settings
export async function GET() {
  try {
    const settingsList = await prisma.gymSettings.findMany()

    // Format list as a key-value record
    const settingsRecord: Record<string, string> = {}
    settingsList.forEach((s) => {
      settingsRecord[s.key] = s.value
    })

    // Return defaults if empty
    const defaults = {
      gymName: settingsRecord.gymName || 'Vyayam AI Studio',
      gymAddress: settingsRecord.gymAddress || 'Mumbai, Maharashtra, India',
      gymPhone: settingsRecord.gymPhone || '+91 98765 43210',
      notificationAlerts: settingsRecord.notificationAlerts || 'true',
      billingCurrency: settingsRecord.billingCurrency || 'INR',
    }

    return successResponse(defaults)
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return errorResponse('Failed to fetch settings', 500)
  }
}

// PUT /api/settings — Bulk update configuration settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return errorResponse('Unauthorized. Admin access only.', 401)
    }

    const body = await request.json() as Record<string, string>
    if (!body || typeof body !== 'object') {
      return errorResponse('Invalid settings payload', 422)
    }

    // Execute bulk upsert in a database transaction
    const updatedSettings = await prisma.$transaction(
      async (tx) => {
        const promises = Object.entries(body).map(([key, value]) => {
          return tx.gymSettings.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) },
          })
        })
        return Promise.all(promises)
      }
    )

    return successResponse(updatedSettings, 'Settings updated successfully')
  } catch (error) {
    console.error('PUT /api/settings error:', error)
    return errorResponse('Failed to save settings', 500)
  }
}
