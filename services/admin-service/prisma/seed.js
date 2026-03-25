// Plain JS seed — runs in production container via node prisma/seed.js
'use strict';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Admin database…');

  // ── Organisations ───────────────────────────────────────────────────────────
  const demoOrg = await prisma.organisation.upsert({
    where: { id: 'seed-org-001' },
    update: {},
    create: {
      id: 'seed-org-001',
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
  console.log(`  Organisation: ${demoOrg.name}`);

  const secondOrg = await prisma.organisation.upsert({
    where: { id: 'seed-org-002' },
    update: {},
    create: {
      id: 'seed-org-002',
      name: 'Regional Health System',
      type: 'health_system',
      status: 'active',
      phone: '555-0201',
      email: 'admin@regional-health.com',
      addressLine1: '456 Medical Blvd',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62702',
      country: 'US',
    },
  });
  console.log(`  Organisation: ${secondOrg.name}`);

  // ── Site ────────────────────────────────────────────────────────────────────
  const mainSite = await prisma.site.upsert({
    where: { id: 'seed-site-001' },
    update: {},
    create: {
      id: 'seed-site-001',
      name: 'Main Clinic — Downtown',
      siteType: 'clinic',
      organisationId: demoOrg.id,
      addressLine1: '123 Health St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      status: 'active',
    },
  });
  console.log(`  Site: ${mainSite.name}`);

  // ── Members ─────────────────────────────────────────────────────────────────
  const SEED_MEMBERS = [
    {
      id: 'seed-mem-001',
      memberNumber: 'MEM-20260101-0001',
      firstName: 'James',
      lastName: 'Anderson',
      dateOfBirth: new Date('1965-03-14'),
      sex: 'male',
      phone: '555-0101',
      status: 'active',
      riskLevel: 'medium',
      organisationId: demoOrg.id,
      siteId: mainSite.id,
    },
    {
      id: 'seed-mem-002',
      memberNumber: 'MEM-20260101-0002',
      firstName: 'Maria',
      lastName: 'Garcia',
      dateOfBirth: new Date('1978-07-22'),
      sex: 'female',
      phone: '555-0102',
      email: 'maria.garcia@demo.com',
      status: 'active',
      riskLevel: 'low',
      organisationId: demoOrg.id,
      siteId: mainSite.id,
    },
    {
      id: 'seed-mem-003',
      memberNumber: 'MEM-20260101-0003',
      firstName: 'Robert',
      lastName: 'Chen',
      dateOfBirth: new Date('1952-11-30'),
      sex: 'male',
      phone: '555-0103',
      email: 'robert.chen@demo.com',
      status: 'active',
      riskLevel: 'high',
      organisationId: demoOrg.id,
      siteId: mainSite.id,
    },
  ];

  for (const m of SEED_MEMBERS) {
    const member = await prisma.member.upsert({
      where: { memberNumber: m.memberNumber },
      update: {},
      create: m,
    });
    console.log(`  Member: ${member.memberNumber} — ${member.firstName} ${member.lastName}`);
  }

  console.log('Admin seed complete.');
}

main()
  .catch(err => { console.error('Admin seed failed:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
