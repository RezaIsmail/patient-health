import { PrismaClient, UserRole } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEMO_PASSWORD = 'Demo1234!'
const SALT_ROUNDS = 12

interface SeedUser {
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

const SEED_USERS: SeedUser[] = [
  {
    email: 'dr.smith@demo.com',
    firstName: 'Sarah',
    lastName: 'Smith',
    role: 'physician' as UserRole,
  },
  {
    email: 'np.jones@demo.com',
    firstName: 'Michael',
    lastName: 'Jones',
    role: 'app' as UserRole,
  },
  {
    email: 'nurse.davis@demo.com',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'nurse' as UserRole,
  },
  {
    email: 'reception@demo.com',
    firstName: 'Jessica',
    lastName: 'Taylor',
    role: 'front_desk' as UserRole,
  },
  {
    email: 'billing@demo.com',
    firstName: 'Robert',
    lastName: 'Wilson',
    role: 'billing' as UserRole,
  },
  {
    email: 'admin@demo.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as UserRole,
  },
]

async function main() {
  console.log('Seeding auth database…')

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS)

  for (const seedUser of SEED_USERS) {
    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      update: {},
      create: {
        email: seedUser.email,
        passwordHash,
        firstName: seedUser.firstName,
        lastName: seedUser.lastName,
        role: seedUser.role,
        isActive: true,
      },
    })
    console.log(`  Created/found user: ${user.email} (${user.role})`)
  }

  console.log(`\nSeed complete. All demo accounts use password: ${DEMO_PASSWORD}`)
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
