// Plain JS seed — runs in production container via node prisma/seed.js
'use strict';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CRM database…');

  // ── Accounts ────────────────────────────────────────────────────────────────
  const demoAccount = await prisma.account.upsert({
    where: { id: 'seed-acct-001' },
    update: {},
    create: {
      id: 'seed-acct-001',
      name: 'Patient Health Demo Clinic',
      type: 'clinic',
      status: 'active',
      phone: '555-0200',
      email: 'admin@demo-clinic.com',
      addressLine1: '123 Health St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'US',
    },
  });
  console.log(`  Account: ${demoAccount.name}`);

  const payerAccount = await prisma.account.upsert({
    where: { id: 'seed-acct-002' },
    update: {},
    create: {
      id: 'seed-acct-002',
      name: 'Blue Cross Demo Plan',
      type: 'payer',
      status: 'active',
      phone: '555-0210',
      email: 'network@bcbs-demo.com',
      city: 'Chicago',
      state: 'IL',
      country: 'US',
    },
  });
  console.log(`  Account: ${payerAccount.name}`);

  // ── Contacts ────────────────────────────────────────────────────────────────
  const SEED_CONTACTS = [
    {
      id: 'seed-con-001',
      firstName: 'James',
      lastName: 'Anderson',
      dateOfBirth: new Date('1965-03-14'),
      sex: 'male',
      phone: '555-0101',
      status: 'active',
      riskLevel: 'medium',
      source: 'referral',
      accountId: demoAccount.id,
      addressLine1: '10 Elm St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'US',
    },
    {
      id: 'seed-con-002',
      firstName: 'Maria',
      lastName: 'Garcia',
      dateOfBirth: new Date('1978-07-22'),
      sex: 'female',
      phone: '555-0102',
      email: 'maria.garcia@demo.com',
      status: 'active',
      riskLevel: 'low',
      source: 'web',
      accountId: demoAccount.id,
      addressLine1: '22 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'US',
    },
    {
      id: 'seed-con-003',
      firstName: 'Robert',
      lastName: 'Chen',
      dateOfBirth: new Date('1952-11-30'),
      sex: 'male',
      phone: '555-0103',
      email: 'robert.chen@demo.com',
      status: 'active',
      riskLevel: 'high',
      source: 'partner',
      accountId: demoAccount.id,
      addressLine1: '5 Maple Dr',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'US',
    },
    {
      id: 'seed-con-004',
      firstName: 'Linda',
      lastName: 'Patel',
      dateOfBirth: new Date('1990-01-08'),
      sex: 'female',
      phone: '555-0104',
      email: 'linda.patel@demo.com',
      status: 'lead',
      riskLevel: 'low',
      source: 'self-referral',
      accountId: demoAccount.id,
      city: 'Springfield',
      state: 'IL',
      country: 'US',
    },
  ];

  for (const c of SEED_CONTACTS) {
    const contact = await prisma.contact.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    });
    console.log(`  Contact: ${contact.firstName} ${contact.lastName} (${contact.status})`);
  }

  console.log('CRM seed complete.');
}

main()
  .catch(err => { console.error('CRM seed failed:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
