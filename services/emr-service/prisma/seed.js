// Plain JS seed — runs in production container via node prisma/seed.js
'use strict';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SEED_PATIENTS = [
  {
    mrn: 'PH-000001',
    firstName: 'James',
    lastName: 'Anderson',
    dateOfBirth: new Date('1965-03-14'),
    gender: 'male',
  },
  {
    mrn: 'PH-000002',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: new Date('1978-07-22'),
    gender: 'female',
    email: 'maria.garcia@demo.com',
    phone: '555-0102',
  },
  {
    mrn: 'PH-000003',
    firstName: 'Robert',
    lastName: 'Chen',
    dateOfBirth: new Date('1952-11-30'),
    gender: 'male',
    email: 'robert.chen@demo.com',
    phone: '555-0103',
  },
  {
    mrn: 'PH-000004',
    firstName: 'Linda',
    lastName: 'Patel',
    dateOfBirth: new Date('1990-01-08'),
    gender: 'female',
    email: 'linda.patel@demo.com',
    phone: '555-0104',
  },
];

async function main() {
  console.log('Seeding EMR database…');
  for (const p of SEED_PATIENTS) {
    const patient = await prisma.patient.upsert({
      where: { mrn: p.mrn },
      update: {},
      create: { ...p, isActive: true },
    });
    console.log(`  ${patient.mrn} — ${patient.firstName} ${patient.lastName}`);
  }
  console.log('EMR seed complete.');
}

main()
  .catch(err => { console.error('EMR seed failed:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
