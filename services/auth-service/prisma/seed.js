// Plain JS seed — runs in production container via node prisma/seed.js
'use strict';
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const DEMO_PASSWORD = 'Demo1234!';

const SEED_USERS = [
  { email: 'dr.smith@demo.com',   firstName: 'Sarah',   lastName: 'Smith',   role: 'physician'   },
  { email: 'np.jones@demo.com',   firstName: 'Michael', lastName: 'Jones',   role: 'app'         },
  { email: 'nurse.davis@demo.com',firstName: 'Emily',   lastName: 'Davis',   role: 'nurse'       },
  { email: 'reception@demo.com',  firstName: 'Jessica', lastName: 'Taylor',  role: 'front_desk'  },
  { email: 'billing@demo.com',    firstName: 'Robert',  lastName: 'Wilson',  role: 'billing'     },
  { email: 'admin@demo.com',      firstName: 'Admin',   lastName: 'User',    role: 'admin'       },
];

async function main() {
  console.log('Seeding auth database…');
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  for (const u of SEED_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash, isActive: true },
    });
    console.log(`  ${user.email} (${user.role})`);
  }
  console.log('Seed complete. Password: ' + DEMO_PASSWORD);
}

main()
  .catch(err => { console.error('Seed failed:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
