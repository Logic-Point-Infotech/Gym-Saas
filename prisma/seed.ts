import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Local enum definitions for SQLite compatibility
const Role = {
  ADMIN: 'ADMIN',
  TRAINER: 'TRAINER',
  CLIENT: 'CLIENT',
}

const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
}

const MembershipStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  FROZEN: 'FROZEN',
}

const MealType = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
  SNACK: 'SNACK',
}

const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
}

async function main() {
  console.log('🌱 Seeding database...\n')

  // ---- Clean existing data ----
  await prisma.notificationRecipient.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.dailyNutrition.deleteMany()
  await prisma.clientHealthMetric.deleteMany()
  await prisma.trainerAllocation.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.gymHistory.deleteMany()
  await prisma.memberDocument.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('Admin@123', 12)
  const trainerPassword = await hash('Trainer@123', 12)
  const clientPassword = await hash('Client@123', 12)

  // ---- Admin ----
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@gymadmin.com',
      passwordHash,
      phone: '+91 9876543210',
      role: Role.ADMIN,
      gender: Gender.MALE,
      status: UserStatus.ACTIVE,
    },
  })
  console.log(`✅ Admin created: ${admin.email}`)

  // ---- Trainers ----
  const trainerData = [
    { name: 'Arjun Kapoor', email: 'arjun@gymadmin.com', phone: '+91 9876543211', specialization: 'Weight Training', experience: 8, gender: Gender.MALE },
    { name: 'Meera Joshi', email: 'meera@gymadmin.com', phone: '+91 9876543212', specialization: 'Yoga', experience: 5, gender: Gender.FEMALE },
    { name: 'Ravi Shankar', email: 'ravi@gymadmin.com', phone: '+91 9876543213', specialization: 'CrossFit', experience: 6, gender: Gender.MALE },
  ]

  const trainers = []
  for (const t of trainerData) {
    const trainer = await prisma.user.create({
      data: {
        ...t,
        passwordHash: trainerPassword,
        role: Role.TRAINER,
        status: UserStatus.ACTIVE,
      },
    })
    trainers.push(trainer)
    console.log(`✅ Trainer created: ${trainer.name}`)
  }

  // ---- Clients ----
  const clientData = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9000000001', gender: Gender.MALE, heightCm: 175, weightKg: 78 },
    { name: 'Priya Patel', email: 'priya@example.com', phone: '+91 9000000002', gender: Gender.FEMALE, heightCm: 162, weightKg: 58 },
    { name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 9000000003', gender: Gender.MALE, heightCm: 180, weightKg: 85 },
    { name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 9000000004', gender: Gender.FEMALE, heightCm: 165, weightKg: 62 },
    { name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 9000000005', gender: Gender.MALE, heightCm: 172, weightKg: 90 },
    { name: 'Ananya Gupta', email: 'ananya@example.com', phone: '+91 9000000006', gender: Gender.FEMALE, heightCm: 158, weightKg: 55 },
    { name: 'Karthik Nair', email: 'karthik@example.com', phone: '+91 9000000007', gender: Gender.MALE, heightCm: 178, weightKg: 73 },
    { name: 'Divya Menon', email: 'divya@example.com', phone: '+91 9000000008', gender: Gender.FEMALE, heightCm: 160, weightKg: 60 },
    { name: 'Rohan Das', email: 'rohan@example.com', phone: '+91 9000000009', gender: Gender.MALE, heightCm: 182, weightKg: 88 },
    { name: 'Ishita Verma', email: 'ishita@example.com', phone: '+91 9000000010', gender: Gender.FEMALE, heightCm: 155, weightKg: 52 },
  ]

  const clients = []
  const usedMemberIds = new Set<string>()

  for (const c of clientData) {
    const dob = new Date(1994 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 27) + 1)
    const dayStr = String(dob.getDate()).padStart(2, '0')
    const monthStr = String(dob.getMonth() + 1).padStart(2, '0')
    let baseMemberId = `vyayam_${dayStr}${monthStr}`
    let memberId = baseMemberId
    let count = 1
    while (usedMemberIds.has(memberId)) {
      count++
      memberId = `${baseMemberId}_${count}`
    }
    usedMemberIds.add(memberId)

    const client = await prisma.user.create({
      data: {
        ...c,
        memberId,
        passwordHash: clientPassword,
        role: Role.CLIENT,
        status: UserStatus.ACTIVE,
        dateOfBirth: dob,
        address: 'Mumbai, Maharashtra, India',
      },
    })
    clients.push(client)
    console.log(`✅ Client created: ${client.name} (${memberId})`)
  }

  // ---- Seed Gym History ----
  for (let i = 0; i < clients.length; i++) {
    const c = clients[i]
    if (i % 2 === 0) {
      await prisma.gymHistory.create({
        data: {
          clientId: c.id,
          gymName: 'ABC Fitness Studio',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-12-31'),
          durationMonths: 12,
          isCurrent: false,
        },
      })
      await prisma.gymHistory.create({
        data: {
          clientId: c.id,
          gymName: 'XYZ Cult Fitness',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2025-06-30'),
          durationMonths: 18,
          isCurrent: false,
        },
      })
    }
    await prisma.gymHistory.create({
      data: {
        clientId: c.id,
        gymName: 'Vyayam AI Gym (Current)',
        startDate: new Date('2025-07-01'),
        durationMonths: 13,
        isCurrent: true,
      },
    })
  }
  console.log(`✅ Gym histories seeded`)

  // ---- Seed Member Documents ----
  for (const client of clients) {
    await prisma.memberDocument.create({
      data: {
        clientId: client.id,
        title: 'Aadhaar / Photo ID Proof',
        fileUrl: '/documents/id_proof.pdf',
        fileType: 'PDF',
      },
    })
    await prisma.memberDocument.create({
      data: {
        clientId: client.id,
        title: 'Medical Fitness & Blood Clearance Certificate',
        fileUrl: '/documents/medical_cert.pdf',
        fileType: 'PDF',
      },
    })
  }
  console.log(`✅ Member documents seeded`)

  // ---- Memberships ----
  const plans = ['Basic', 'Standard', 'Premium', 'Annual']
  const amounts = [999, 1999, 4999, 8999]
  const durations = [30, 90, 180, 365]

  for (let i = 0; i < clients.length; i++) {
    const planIndex = i % plans.length
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 60))
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + durations[planIndex])

    const isExpired = endDate < new Date()
    const status = i === 4 ? MembershipStatus.FROZEN : isExpired ? MembershipStatus.EXPIRED : MembershipStatus.ACTIVE

    await prisma.membership.create({
      data: {
        clientId: clients[i].id,
        planName: plans[planIndex],
        amount: amounts[planIndex],
        startDate,
        endDate,
        status,
      },
    })
  }
  console.log(`\n✅ ${clients.length} memberships created`)

  // ---- Trainer Allocations ----
  for (let i = 0; i < clients.length; i++) {
    const trainerIndex = i % trainers.length
    await prisma.trainerAllocation.create({
      data: {
        trainerId: trainers[trainerIndex].id,
        clientId: clients[i].id,
      },
    })
  }
  console.log(`✅ ${clients.length} trainer allocations created`)

  // ---- Health Metrics (3 records per client over past 3 months) ----
  for (const client of clients) {
    const baseWeight = client.weightKg || 70
    for (let j = 0; j < 3; j++) {
      const recordDate = new Date()
      recordDate.setMonth(recordDate.getMonth() - (2 - j))
      const weight = baseWeight - j * (Math.random() * 2)
      const heightM = (client.heightCm || 170) / 100
      const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10

      await prisma.clientHealthMetric.create({
        data: {
          clientId: client.id,
          weightKg: Math.round(weight * 10) / 10,
          bmi,
          notes: j === 2 ? 'Good progress observed' : undefined,
          recordedAt: recordDate,
        },
      })
    }
  }
  console.log(`✅ ${clients.length * 3} health metrics created`)

  // ---- Daily Nutrition (2 entries per client) ----
  const foods = ['Grilled Chicken Salad', 'Brown Rice Bowl', 'Protein Shake', 'Oatmeal with Fruits', 'Egg White Omelette', 'Paneer Tikka']
  const mealTypes = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK]

  for (const client of clients) {
    for (let j = 0; j < 2; j++) {
      const logDate = new Date()
      logDate.setDate(logDate.getDate() - j)

      await prisma.dailyNutrition.create({
        data: {
          clientId: client.id,
          detectedFood: foods[Math.floor(Math.random() * foods.length)],
          calories: 300 + Math.floor(Math.random() * 500),
          protein: 15 + Math.floor(Math.random() * 35),
          carbs: 20 + Math.floor(Math.random() * 60),
          fats: 5 + Math.floor(Math.random() * 25),
          mealType: mealTypes[Math.floor(Math.random() * mealTypes.length)],
          loggedAt: logDate,
        },
      })
    }
  }
  console.log(`✅ ${clients.length * 2} nutrition logs created`)

  console.log('\n🎉 Seeding complete!\n')
  console.log('Login credentials:')
  console.log('  Admin:   admin@gymadmin.com / Admin@123')
  console.log('  Trainer: arjun@gymadmin.com / Trainer@123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
