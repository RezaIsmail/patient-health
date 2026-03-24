import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

// Auth user IDs aligned with auth-service seed accounts
const USERS = {
  admin:     'user-admin-001',
  physician: 'user-dr-smith-001',
  nurseP:    'user-np-jones-001',
  nurse:     'user-nurse-davis-001',
  frontDesk: 'user-reception-001',
  billing:   'user-billing-001',
}

async function main() {
  console.log('Seeding admin database…')

  // ── Organisation ────────────────────────────────────────────────────────────
  const org = await prisma.organisation.upsert({
    where: { id: 'org-springfield-medical' },
    update: {},
    create: {
      id: 'org-springfield-medical',
      name: 'Springfield Medical Group',
      type: 'health_system',
      status: 'active',
      phone: '(555) 100-2000',
      email: 'admin@springfieldmedical.com',
      website: 'https://springfieldmedical.com',
      addressLine1: '500 Medical Center Drive',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'US',
    },
  })
  console.log(`  Organisation: ${org.name}`)

  // ── Sites ────────────────────────────────────────────────────────────────────
  const siteMain = await prisma.site.upsert({
    where: { id: 'site-main-campus' },
    update: {},
    create: {
      id: 'site-main-campus',
      name: 'Main Campus',
      siteType: 'hospital',
      organisationId: org.id,
      addressLine1: '500 Medical Center Drive',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      status: 'active',
    },
  })

  const siteNorth = await prisma.site.upsert({
    where: { id: 'site-north-clinic' },
    update: {},
    create: {
      id: 'site-north-clinic',
      name: 'North Springfield Clinic',
      siteType: 'clinic',
      organisationId: org.id,
      addressLine1: '120 Maple Avenue',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62702',
      status: 'active',
    },
  })

  const siteVirtual = await prisma.site.upsert({
    where: { id: 'site-virtual' },
    update: {},
    create: {
      id: 'site-virtual',
      name: 'Virtual Care Hub',
      siteType: 'virtual',
      organisationId: org.id,
      status: 'active',
    },
  })
  console.log(`  Sites: ${siteMain.name}, ${siteNorth.name}, ${siteVirtual.name}`)

  // ── Departments ──────────────────────────────────────────────────────────────
  const deptClinical = await prisma.department.upsert({
    where: { id: 'dept-clinical-main' },
    update: {},
    create: {
      id: 'dept-clinical-main',
      name: 'Clinical Services',
      departmentType: 'clinical',
      siteId: siteMain.id,
      headUserId: USERS.physician,
    },
  })

  const deptCareOps = await prisma.department.upsert({
    where: { id: 'dept-care-ops' },
    update: {},
    create: {
      id: 'dept-care-ops',
      name: 'Care Operations',
      departmentType: 'operations',
      siteId: siteMain.id,
      headUserId: USERS.nurseP,
    },
  })

  const deptAdmin = await prisma.department.upsert({
    where: { id: 'dept-admin' },
    update: {},
    create: {
      id: 'dept-admin',
      name: 'Administration',
      departmentType: 'administrative',
      siteId: siteMain.id,
      headUserId: USERS.admin,
    },
  })

  const deptCompliance = await prisma.department.upsert({
    where: { id: 'dept-compliance' },
    update: {},
    create: {
      id: 'dept-compliance',
      name: 'Compliance & Quality',
      departmentType: 'compliance',
      siteId: siteMain.id,
      headUserId: USERS.admin,
    },
  })
  console.log(`  Departments: ${[deptClinical, deptCareOps, deptAdmin, deptCompliance].map(d => d.name).join(', ')}`)

  // ── Teams ────────────────────────────────────────────────────────────────────
  const teamCareA = await prisma.team.upsert({
    where: { id: 'team-care-a' },
    update: {},
    create: {
      id: 'team-care-a',
      name: 'Care Team Alpha',
      teamType: 'care',
      departmentId: deptCareOps.id,
      leadUserId: USERS.nurseP,
    },
  })

  const teamCareB = await prisma.team.upsert({
    where: { id: 'team-care-b' },
    update: {},
    create: {
      id: 'team-care-b',
      name: 'Care Team Beta',
      teamType: 'care',
      departmentId: deptCareOps.id,
      leadUserId: USERS.nurse,
    },
  })

  const teamAdmin = await prisma.team.upsert({
    where: { id: 'team-admin-ops' },
    update: {},
    create: {
      id: 'team-admin-ops',
      name: 'Admin Operations',
      teamType: 'administrative',
      departmentId: deptAdmin.id,
      leadUserId: USERS.frontDesk,
    },
  })
  console.log(`  Teams: ${[teamCareA, teamCareB, teamAdmin].map(t => t.name).join(', ')}`)

  // ── Programmes ───────────────────────────────────────────────────────────────
  const programmes = await Promise.all([
    prisma.programme.upsert({
      where: { id: 'prog-chf-management' },
      update: {},
      create: {
        id: 'prog-chf-management',
        name: 'CHF Management Programme',
        description: 'Comprehensive care coordination for patients with congestive heart failure. Focuses on medication adherence, fluid management, and early decompensation detection.',
        programmeType: 'chronic_disease',
        status: 'active',
        organisationId: org.id,
        enrollmentCapacity: 150,
        eligibilityCriteria: {
          operator: 'AND',
          rules: [
            { field: 'diagnosis', operator: 'contains', value: 'I50' },
            { field: 'riskLevel', operator: 'in', value: ['high', 'critical'] },
          ],
        },
        slaDefinitions: {
          referred_to_screened_days: 3,
          screened_to_consented_days: 7,
          consented_to_enrolled_days: 5,
        },
      },
    }),
    prisma.programme.upsert({
      where: { id: 'prog-diabetes-care' },
      update: {},
      create: {
        id: 'prog-diabetes-care',
        name: 'Diabetes Care Management',
        description: 'Structured support for Type 2 diabetes patients including HbA1c monitoring, medication management, nutrition coaching, and complication prevention.',
        programmeType: 'chronic_disease',
        status: 'active',
        organisationId: org.id,
        enrollmentCapacity: 300,
        eligibilityCriteria: {
          operator: 'AND',
          rules: [
            { field: 'diagnosis', operator: 'contains', value: 'E11' },
            { field: 'age', operator: 'gte', value: 18 },
          ],
        },
        slaDefinitions: {
          referred_to_screened_days: 5,
          screened_to_consented_days: 10,
          consented_to_enrolled_days: 7,
        },
      },
    }),
    prisma.programme.upsert({
      where: { id: 'prog-copd' },
      update: {},
      create: {
        id: 'prog-copd',
        name: 'COPD Pulmonary Rehabilitation',
        description: 'Pulmonary rehabilitation and ongoing disease management for COPD patients including breathing exercises, inhaler technique, and exacerbation prevention.',
        programmeType: 'chronic_disease',
        status: 'active',
        organisationId: org.id,
        enrollmentCapacity: 100,
        eligibilityCriteria: {
          operator: 'AND',
          rules: [
            { field: 'diagnosis', operator: 'contains', value: 'J44' },
          ],
        },
        slaDefinitions: {
          referred_to_screened_days: 5,
          screened_to_consented_days: 10,
          consented_to_enrolled_days: 7,
        },
      },
    }),
    prisma.programme.upsert({
      where: { id: 'prog-preventive-care' },
      update: {},
      create: {
        id: 'prog-preventive-care',
        name: 'Preventive Care & Wellness',
        description: 'Annual wellness visits, preventive screenings, and health coaching for members without active chronic conditions. Focus on early detection and health maintenance.',
        programmeType: 'preventive',
        status: 'active',
        organisationId: org.id,
        enrollmentCapacity: 500,
        eligibilityCriteria: {
          operator: 'OR',
          rules: [
            { field: 'age', operator: 'gte', value: 40 },
            { field: 'riskLevel', operator: 'in', value: ['medium', 'high'] },
          ],
        },
        slaDefinitions: {
          referred_to_screened_days: 14,
          screened_to_consented_days: 21,
          consented_to_enrolled_days: 14,
        },
      },
    }),
    prisma.programme.upsert({
      where: { id: 'prog-post-discharge' },
      update: {},
      create: {
        id: 'prog-post-discharge',
        name: 'Post-Discharge Follow-up',
        description: '30-day intensive follow-up programme for recently hospitalised members. Reduces 30-day readmission rates through medication reconciliation, provider follow-up scheduling, and early symptom monitoring.',
        programmeType: 'post_discharge',
        status: 'active',
        organisationId: org.id,
        enrollmentCapacity: 80,
        eligibilityCriteria: {
          operator: 'AND',
          rules: [
            { field: 'recentDischarge', operator: 'within_days', value: 3 },
          ],
        },
        slaDefinitions: {
          referred_to_screened_days: 1,
          screened_to_consented_days: 1,
          consented_to_enrolled_days: 1,
        },
      },
    }),
    prisma.programme.upsert({
      where: { id: 'prog-behavioural-health' },
      update: {},
      create: {
        id: 'prog-behavioural-health',
        name: 'Integrated Behavioural Health',
        description: 'Integrated mental health and substance use support embedded in primary care. Includes care coordination, therapy linkage, and medication management for depression, anxiety, and SUD.',
        programmeType: 'behavioural_health',
        status: 'active',
        organisationId: org.id,
        enrollmentCapacity: 120,
        eligibilityCriteria: {
          operator: 'OR',
          rules: [
            { field: 'sdohFlags', operator: 'contains', value: 'social_isolation' },
            { field: 'diagnosis', operator: 'contains', value: 'F32' },
            { field: 'diagnosis', operator: 'contains', value: 'F41' },
          ],
        },
        slaDefinitions: {
          referred_to_screened_days: 3,
          screened_to_consented_days: 5,
          consented_to_enrolled_days: 3,
        },
      },
    }),
  ])
  console.log(`  Programmes: ${programmes.map(p => p.name).join(', ')}`)

  const [progCHF, progDiabetes, progCOPD, progPreventive, progPostDischarge, progBH] = programmes

  // ── Members ──────────────────────────────────────────────────────────────────
  const memberData = [
    // ── Cross-service aligned members (exist in EMR + CRM + Admin) ──────────────
    {
      id: 'mem-sarah-johnson', memberNumber: 'MEM-20260115-0001',
      firstName: 'Sarah', lastName: 'Johnson',
      dateOfBirth: new Date('1985-03-15'), sex: 'female',
      phone: '(555) 234-5678', email: 'sarah.johnson@email.com',
      status: 'active', riskLevel: 'medium',
      emrPatientId: 'emr-patient-sarah-johnson', crmContactId: 'contact-sarah-johnson',
      siteId: siteMain.id,
    },
    {
      id: 'mem-james-williams', memberNumber: 'MEM-20260115-0002',
      firstName: 'James', lastName: 'Williams',
      dateOfBirth: new Date('1960-07-22'), sex: 'male',
      phone: '(555) 345-6789', email: 'james.williams@email.com',
      status: 'active', riskLevel: 'high',
      emrPatientId: 'emr-patient-james-williams', crmContactId: 'contact-james-williams',
      siteId: siteMain.id,
    },
    {
      id: 'mem-emily-chen', memberNumber: 'MEM-20260115-0003',
      firstName: 'Emily', lastName: 'Chen',
      dateOfBirth: new Date('1995-11-08'), sex: 'female',
      phone: '(555) 456-7890', email: 'emily.chen@email.com',
      status: 'active', riskLevel: 'low',
      emrPatientId: 'emr-patient-emily-chen', crmContactId: 'contact-emily-chen',
      siteId: siteNorth.id,
    },
    // ── Additional members (admin-only, no cross-service links yet) ──────────────
    {
      id: 'mem-001', memberNumber: 'MEM-20260101-0001',
      firstName: 'Harold', lastName: 'Thompson',
      dateOfBirth: new Date('1948-03-12'), sex: 'male',
      phone: '(555) 201-0001', email: 'harold.thompson@email.com',
      status: 'active', riskLevel: 'critical',
      emrPatientId: 'pat-harold-thompson', crmContactId: 'crm-harold-thompson',
      siteId: siteMain.id,
    },
    {
      id: 'mem-002', memberNumber: 'MEM-20260101-0002',
      firstName: 'Margaret', lastName: 'Okafor',
      dateOfBirth: new Date('1955-07-24'), sex: 'female',
      phone: '(555) 201-0002', email: 'margaret.okafor@email.com',
      status: 'active', riskLevel: 'high',
      emrPatientId: 'pat-margaret-okafor', crmContactId: 'crm-margaret-okafor',
      siteId: siteMain.id,
    },
    {
      id: 'mem-003', memberNumber: 'MEM-20260101-0003',
      firstName: 'Carlos', lastName: 'Rivera',
      dateOfBirth: new Date('1962-11-08'), sex: 'male',
      phone: '(555) 201-0003', email: 'carlos.rivera@email.com',
      status: 'active', riskLevel: 'high',
      emrPatientId: 'pat-carlos-rivera', crmContactId: 'crm-carlos-rivera',
      siteId: siteNorth.id,
    },
    {
      id: 'mem-004', memberNumber: 'MEM-20260101-0004',
      firstName: 'Dorothy', lastName: 'Chen',
      dateOfBirth: new Date('1970-02-17'), sex: 'female',
      phone: '(555) 201-0004', email: 'dorothy.chen@email.com',
      status: 'active', riskLevel: 'medium',
      emrPatientId: 'pat-dorothy-chen', crmContactId: 'crm-dorothy-chen',
      siteId: siteNorth.id,
    },
    {
      id: 'mem-005', memberNumber: 'MEM-20260101-0005',
      firstName: 'James', lastName: 'Patel',
      dateOfBirth: new Date('1958-09-30'), sex: 'male',
      phone: '(555) 201-0005', email: 'james.patel@email.com',
      status: 'active', riskLevel: 'critical',
      emrPatientId: 'pat-james-patel', crmContactId: 'crm-james-patel',
      siteId: siteMain.id,
    },
    {
      id: 'mem-006', memberNumber: 'MEM-20260101-0006',
      firstName: 'Sandra', lastName: 'Kowalski',
      dateOfBirth: new Date('1943-05-03'), sex: 'female',
      phone: '(555) 201-0006', email: 'sandra.kowalski@email.com',
      status: 'active', riskLevel: 'high',
      emrPatientId: 'pat-sandra-kowalski', crmContactId: null,
      siteId: siteMain.id,
    },
    {
      id: 'mem-007', memberNumber: 'MEM-20260101-0007',
      firstName: 'Marcus', lastName: 'Williams',
      dateOfBirth: new Date('1975-08-14'), sex: 'male',
      phone: '(555) 201-0007', email: 'marcus.williams@email.com',
      status: 'active', riskLevel: 'medium',
      emrPatientId: 'pat-marcus-williams', crmContactId: 'crm-marcus-williams',
      siteId: siteVirtual.id,
    },
    {
      id: 'mem-008', memberNumber: 'MEM-20260101-0008',
      firstName: 'Helen', lastName: 'Nakamura',
      dateOfBirth: new Date('1952-12-22'), sex: 'female',
      phone: '(555) 201-0008', email: 'helen.nakamura@email.com',
      status: 'active', riskLevel: 'high',
      emrPatientId: 'pat-helen-nakamura', crmContactId: 'crm-helen-nakamura',
      siteId: siteNorth.id,
    },
    {
      id: 'mem-009', memberNumber: 'MEM-20260101-0009',
      firstName: 'Robert', lastName: 'Osei',
      dateOfBirth: new Date('1967-04-11'), sex: 'male',
      phone: '(555) 201-0009', email: 'robert.osei@email.com',
      status: 'active', riskLevel: 'medium',
      emrPatientId: null, crmContactId: 'crm-robert-osei',
      siteId: siteVirtual.id,
    },
    {
      id: 'mem-010', memberNumber: 'MEM-20260101-0010',
      firstName: 'Patricia', lastName: 'Hernandez',
      dateOfBirth: new Date('1980-06-27'), sex: 'female',
      phone: '(555) 201-0010', email: 'patricia.hernandez@email.com',
      status: 'active', riskLevel: 'low',
      emrPatientId: 'pat-patricia-hernandez', crmContactId: 'crm-patricia-hernandez',
      siteId: siteNorth.id,
    },
    {
      id: 'mem-011', memberNumber: 'MEM-20260101-0011',
      firstName: 'Eugene', lastName: 'Fontaine',
      dateOfBirth: new Date('1950-10-05'), sex: 'male',
      phone: '(555) 201-0011', email: null,
      status: 'active', riskLevel: 'high',
      emrPatientId: 'pat-eugene-fontaine', crmContactId: null,
      siteId: siteMain.id,
    },
    {
      id: 'mem-012', memberNumber: 'MEM-20260101-0012',
      firstName: 'Amara', lastName: 'Diallo',
      dateOfBirth: new Date('1988-01-19'), sex: 'female',
      phone: '(555) 201-0012', email: 'amara.diallo@email.com',
      status: 'active', riskLevel: 'medium',
      emrPatientId: 'pat-amara-diallo', crmContactId: 'crm-amara-diallo',
      siteId: siteVirtual.id,
    },
    {
      id: 'mem-013', memberNumber: 'MEM-20260101-0013',
      firstName: 'Thomas', lastName: 'Bergmann',
      dateOfBirth: new Date('1945-07-31'), sex: 'male',
      phone: '(555) 201-0013', email: 'thomas.bergmann@email.com',
      status: 'suspended', riskLevel: 'critical',
      emrPatientId: 'pat-thomas-bergmann', crmContactId: 'crm-thomas-bergmann',
      siteId: siteMain.id,
    },
    {
      id: 'mem-014', memberNumber: 'MEM-20260101-0014',
      firstName: 'Vivian', lastName: 'Moore',
      dateOfBirth: new Date('1963-03-08'), sex: 'female',
      phone: '(555) 201-0014', email: 'vivian.moore@email.com',
      status: 'active', riskLevel: 'low',
      emrPatientId: 'pat-vivian-moore', crmContactId: 'crm-vivian-moore',
      siteId: siteNorth.id,
    },
    {
      id: 'mem-015', memberNumber: 'MEM-20260101-0015',
      firstName: 'Leonard', lastName: 'Kasparov',
      dateOfBirth: new Date('1971-09-16'), sex: 'male',
      phone: '(555) 201-0015', email: 'leonard.kasparov@email.com',
      status: 'inactive', riskLevel: 'medium',
      emrPatientId: null, crmContactId: null,
      siteId: siteMain.id,
    },
  ]

  const members: Awaited<ReturnType<typeof prisma.member.upsert>>[] = []
  for (const m of memberData) {
    const member = await prisma.member.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        memberNumber: m.memberNumber,
        firstName: m.firstName,
        lastName: m.lastName,
        dateOfBirth: m.dateOfBirth,
        sex: m.sex,
        phone: m.phone,
        email: m.email ?? undefined,
        status: m.status,
        riskLevel: m.riskLevel,
        emrPatientId: m.emrPatientId ?? undefined,
        crmContactId: m.crmContactId ?? undefined,
        organisationId: org.id,
        siteId: m.siteId,
      },
    })
    members.push(member)
  }
  console.log(`  Members: ${members.length} created`)

  // ── Programme Enrollments ────────────────────────────────────────────────────
  // Each enrollment also gets transitions and (where active) a consent record

  type EnrollmentSpec = {
    id: string
    memberId: string
    programmeId: string
    state: string
    assignedTo: string
    enrolledAt?: Date
    transitions: { fromState: string; toState: string; actorId: string; daysAgo: number; reasonCode?: string }[]
    consent?: { consentType: string; channel: string; collectedBy: string }
  }

  const now = new Date()
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000)

  const enrollmentSpecs: EnrollmentSpec[] = [
    // Harold Thompson — CHF: active
    {
      id: 'enr-harold-chf',
      memberId: 'mem-001', programmeId: progCHF.id,
      state: 'active', assignedTo: USERS.nurseP,
      enrolledAt: daysAgo(42),
      transitions: [
        { fromState: 'referred',   toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 45 },
        { fromState: 'screened',   toState: 'eligible',  actorId: USERS.nurseP,    daysAgo: 44 },
        { fromState: 'eligible',   toState: 'consented', actorId: USERS.nurseP,    daysAgo: 43 },
        { fromState: 'consented',  toState: 'enrolled',  actorId: USERS.nurseP,    daysAgo: 42 },
        { fromState: 'enrolled',   toState: 'active',    actorId: USERS.nurseP,    daysAgo: 42 },
      ],
      consent: { consentType: 'verbal', channel: 'phone', collectedBy: USERS.nurseP },
    },
    // Harold Thompson — Post-Discharge: graduated
    {
      id: 'enr-harold-pd',
      memberId: 'mem-001', programmeId: progPostDischarge.id,
      state: 'graduated', assignedTo: USERS.nurse,
      enrolledAt: daysAgo(90),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 92 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 91 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 91 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurse,     daysAgo: 90 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurse,     daysAgo: 90 },
        { fromState: 'active',    toState: 'graduated', actorId: USERS.nurseP,    daysAgo: 60 },
      ],
      consent: { consentType: 'written', channel: 'in_person', collectedBy: USERS.nurse },
    },
    // Margaret Okafor — Diabetes: active
    {
      id: 'enr-margaret-diabetes',
      memberId: 'mem-002', programmeId: progDiabetes.id,
      state: 'active', assignedTo: USERS.nurseP,
      enrolledAt: daysAgo(120),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 125 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurseP,    daysAgo: 122 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurseP,    daysAgo: 121 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurseP,    daysAgo: 120 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurseP,    daysAgo: 120 },
      ],
      consent: { consentType: 'electronic', channel: 'portal', collectedBy: USERS.nurseP },
    },
    // Margaret Okafor — Preventive: active
    {
      id: 'enr-margaret-prev',
      memberId: 'mem-002', programmeId: progPreventive.id,
      state: 'active', assignedTo: USERS.nurse,
      enrolledAt: daysAgo(90),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 95 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 93 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 92 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurse,     daysAgo: 90 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurse,     daysAgo: 90 },
      ],
      consent: { consentType: 'verbal', channel: 'phone', collectedBy: USERS.nurse },
    },
    // Carlos Rivera — COPD: active
    {
      id: 'enr-carlos-copd',
      memberId: 'mem-003', programmeId: progCOPD.id,
      state: 'active', assignedTo: USERS.nurseP,
      enrolledAt: daysAgo(55),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 60 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurseP,    daysAgo: 58 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurseP,    daysAgo: 57 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurseP,    daysAgo: 55 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurseP,    daysAgo: 55 },
      ],
      consent: { consentType: 'written', channel: 'in_person', collectedBy: USERS.nurseP },
    },
    // Carlos Rivera — Diabetes: consented (pending enrollment)
    {
      id: 'enr-carlos-diabetes',
      memberId: 'mem-003', programmeId: progDiabetes.id,
      state: 'consented', assignedTo: USERS.nurse,
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 12 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 10 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 8 },
      ],
      consent: { consentType: 'verbal', channel: 'phone', collectedBy: USERS.nurse },
    },
    // Dorothy Chen — Preventive: active
    {
      id: 'enr-dorothy-prev',
      memberId: 'mem-004', programmeId: progPreventive.id,
      state: 'active', assignedTo: USERS.nurse,
      enrolledAt: daysAgo(200),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 210 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 208 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 205 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurse,     daysAgo: 200 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurse,     daysAgo: 200 },
      ],
      consent: { consentType: 'electronic', channel: 'portal', collectedBy: USERS.nurse },
    },
    // James Patel — CHF: active
    {
      id: 'enr-james-chf',
      memberId: 'mem-005', programmeId: progCHF.id,
      state: 'active', assignedTo: USERS.nurseP,
      enrolledAt: daysAgo(30),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 33 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurseP,    daysAgo: 32 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurseP,    daysAgo: 31 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurseP,    daysAgo: 30 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurseP,    daysAgo: 30 },
      ],
      consent: { consentType: 'verbal', channel: 'phone', collectedBy: USERS.nurseP },
    },
    // James Patel — Post-Discharge: active (recent hospitalisation)
    {
      id: 'enr-james-pd',
      memberId: 'mem-005', programmeId: progPostDischarge.id,
      state: 'active', assignedTo: USERS.nurse,
      enrolledAt: daysAgo(5),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 6 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 6 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 5 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurse,     daysAgo: 5 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurse,     daysAgo: 5 },
      ],
      consent: { consentType: 'verbal', channel: 'phone', collectedBy: USERS.nurse },
    },
    // Sandra Kowalski — CHF: eligible (awaiting consent)
    {
      id: 'enr-sandra-chf',
      memberId: 'mem-006', programmeId: progCHF.id,
      state: 'eligible', assignedTo: USERS.nurseP,
      transitions: [
        { fromState: 'referred',  toState: 'screened', actorId: USERS.frontDesk, daysAgo: 8 },
        { fromState: 'screened',  toState: 'eligible', actorId: USERS.nurseP,    daysAgo: 6 },
      ],
    },
    // Sandra Kowalski — Behavioural Health: screened
    {
      id: 'enr-sandra-bh',
      memberId: 'mem-006', programmeId: progBH.id,
      state: 'screened', assignedTo: USERS.nurse,
      transitions: [
        { fromState: 'referred',  toState: 'screened', actorId: USERS.frontDesk, daysAgo: 4 },
      ],
    },
    // Marcus Williams — Diabetes: active
    {
      id: 'enr-marcus-diabetes',
      memberId: 'mem-007', programmeId: progDiabetes.id,
      state: 'active', assignedTo: USERS.nurse,
      enrolledAt: daysAgo(75),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 82 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 80 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 78 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurse,     daysAgo: 75 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurse,     daysAgo: 75 },
      ],
      consent: { consentType: 'electronic', channel: 'portal', collectedBy: USERS.nurse },
    },
    // Helen Nakamura — COPD: active
    {
      id: 'enr-helen-copd',
      memberId: 'mem-008', programmeId: progCOPD.id,
      state: 'active', assignedTo: USERS.nurseP,
      enrolledAt: daysAgo(110),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 115 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurseP,    daysAgo: 113 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurseP,    daysAgo: 112 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurseP,    daysAgo: 110 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurseP,    daysAgo: 110 },
      ],
      consent: { consentType: 'written', channel: 'in_person', collectedBy: USERS.nurseP },
    },
    // Helen Nakamura — Preventive: active
    {
      id: 'enr-helen-prev',
      memberId: 'mem-008', programmeId: progPreventive.id,
      state: 'active', assignedTo: USERS.nurse,
      enrolledAt: daysAgo(150),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 155 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 153 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 152 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurse,     daysAgo: 150 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurse,     daysAgo: 150 },
      ],
      consent: { consentType: 'verbal', channel: 'phone', collectedBy: USERS.nurse },
    },
    // Robert Osei — Preventive: referred (just entered)
    {
      id: 'enr-robert-prev',
      memberId: 'mem-009', programmeId: progPreventive.id,
      state: 'referred', assignedTo: USERS.nurse,
      transitions: [],
    },
    // Patricia Hernandez — Preventive: active
    {
      id: 'enr-patricia-prev',
      memberId: 'mem-010', programmeId: progPreventive.id,
      state: 'active', assignedTo: USERS.nurse,
      enrolledAt: daysAgo(300),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 310 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 307 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 305 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurse,     daysAgo: 300 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurse,     daysAgo: 300 },
      ],
      consent: { consentType: 'electronic', channel: 'portal', collectedBy: USERS.nurse },
    },
    // Eugene Fontaine — Behavioural Health: active
    {
      id: 'enr-eugene-bh',
      memberId: 'mem-011', programmeId: progBH.id,
      state: 'active', assignedTo: USERS.nurseP,
      enrolledAt: daysAgo(65),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 70 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurseP,    daysAgo: 68 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurseP,    daysAgo: 67 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurseP,    daysAgo: 65 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurseP,    daysAgo: 65 },
      ],
      consent: { consentType: 'verbal', channel: 'phone', collectedBy: USERS.nurseP },
    },
    // Amara Diallo — Behavioural Health + Preventive: active in both
    {
      id: 'enr-amara-bh',
      memberId: 'mem-012', programmeId: progBH.id,
      state: 'active', assignedTo: USERS.nurse,
      enrolledAt: daysAgo(40),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 45 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 43 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 42 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurse,     daysAgo: 40 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurse,     daysAgo: 40 },
      ],
      consent: { consentType: 'electronic', channel: 'portal', collectedBy: USERS.nurse },
    },
    {
      id: 'enr-amara-prev',
      memberId: 'mem-012', programmeId: progPreventive.id,
      state: 'active', assignedTo: USERS.nurse,
      enrolledAt: daysAgo(40),
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 45 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 43 },
        { fromState: 'eligible',  toState: 'consented', actorId: USERS.nurse,     daysAgo: 42 },
        { fromState: 'consented', toState: 'enrolled',  actorId: USERS.nurse,     daysAgo: 40 },
        { fromState: 'enrolled',  toState: 'active',    actorId: USERS.nurse,     daysAgo: 40 },
      ],
      consent: { consentType: 'electronic', channel: 'portal', collectedBy: USERS.nurse },
    },
    // Thomas Bergmann — CHF: disenrolled (suspended member)
    {
      id: 'enr-thomas-chf',
      memberId: 'mem-013', programmeId: progCHF.id,
      state: 'disenrolled', assignedTo: USERS.nurseP,
      enrolledAt: daysAgo(180),
      transitions: [
        { fromState: 'referred',   toState: 'screened',    actorId: USERS.frontDesk, daysAgo: 185 },
        { fromState: 'screened',   toState: 'eligible',    actorId: USERS.nurseP,    daysAgo: 183 },
        { fromState: 'eligible',   toState: 'consented',   actorId: USERS.nurseP,    daysAgo: 182 },
        { fromState: 'consented',  toState: 'enrolled',    actorId: USERS.nurseP,    daysAgo: 180 },
        { fromState: 'enrolled',   toState: 'active',      actorId: USERS.nurseP,    daysAgo: 180 },
        { fromState: 'active',     toState: 'disenrolled', actorId: USERS.admin,     daysAgo: 14, reasonCode: 'non_compliance' },
      ],
      consent: { consentType: 'written', channel: 'in_person', collectedBy: USERS.nurseP },
    },
    // Vivian Moore — Preventive: declined
    {
      id: 'enr-vivian-prev',
      memberId: 'mem-014', programmeId: progPreventive.id,
      state: 'declined', assignedTo: USERS.nurse,
      transitions: [
        { fromState: 'referred',  toState: 'screened',  actorId: USERS.frontDesk, daysAgo: 20 },
        { fromState: 'screened',  toState: 'eligible',  actorId: USERS.nurse,     daysAgo: 18 },
        { fromState: 'eligible',  toState: 'declined',  actorId: USERS.nurse,     daysAgo: 16, reasonCode: 'patient_declined' },
      ],
    },
  ]

  let enrollmentCount = 0
  for (const spec of enrollmentSpecs) {
    const enrollment = await prisma.programmeEnrollment.upsert({
      where: { id: spec.id },
      update: {},
      create: {
        id: spec.id,
        memberId: spec.memberId,
        programmeId: spec.programmeId,
        state: spec.state,
        assignedTo: spec.assignedTo,
        enrolledAt: spec.enrolledAt,
        disenrolledAt: spec.state === 'disenrolled' ? daysAgo(14) : undefined,
        graduatedAt: spec.state === 'graduated' ? daysAgo(60) : undefined,
        reasonCode: spec.state === 'disenrolled' ? 'non_compliance' : spec.state === 'declined' ? 'patient_declined' : undefined,
      },
    })

    for (const t of spec.transitions) {
      await prisma.enrollmentTransition.upsert({
        where: { id: `${spec.id}-${t.fromState}-${t.toState}` },
        update: {},
        create: {
          id: `${spec.id}-${t.fromState}-${t.toState}`,
          enrollmentId: enrollment.id,
          fromState: t.fromState,
          toState: t.toState,
          actorId: t.actorId,
          actorRole: t.actorId === USERS.physician ? 'physician' : t.actorId === USERS.nurseP ? 'nurse_practitioner' : t.actorId === USERS.nurse ? 'nurse' : t.actorId === USERS.admin ? 'admin' : 'front_desk',
          reasonCode: t.reasonCode,
          timestamp: daysAgo(t.daysAgo),
        },
      })
    }

    if (spec.consent) {
      await prisma.consent.upsert({
        where: { id: `consent-${spec.id}` },
        update: {},
        create: {
          id: `consent-${spec.id}`,
          memberId: spec.memberId,
          enrollmentId: enrollment.id,
          consentType: spec.consent.consentType,
          channel: spec.consent.channel,
          collectedBy: spec.consent.collectedBy,
          documentVersion: '1.0',
          status: 'active',
          collectedAt: spec.enrolledAt ?? daysAgo(5),
        },
      })
    }

    enrollmentCount++
  }
  console.log(`  Enrollments: ${enrollmentCount} created (with transitions and consents)`)

  // ── Roles ────────────────────────────────────────────────────────────────────
  const rolesData = [
    {
      id: 'role-platform-admin',
      name: 'Platform Admin',
      description: 'Full access to all products and configuration across the platform.',
      productScope: 'platform',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'Member', action: 'admin', scope: 'platform_wide' },
        { resource_type: 'Programme', action: 'admin', scope: 'platform_wide' },
        { resource_type: 'User', action: 'admin', scope: 'platform_wide' },
        { resource_type: 'Organisation', action: 'admin', scope: 'platform_wide' },
        { resource_type: 'Role', action: 'admin', scope: 'platform_wide' },
        { resource_type: 'AuditLog', action: 'export', scope: 'platform_wide' },
        { resource_type: 'Integration', action: 'admin', scope: 'platform_wide' },
        { resource_type: 'Configuration', action: 'admin', scope: 'platform_wide' },
      ],
    },
    {
      id: 'role-org-admin',
      name: 'Org Admin',
      description: 'Manages users and configuration within their organisation scope.',
      productScope: 'admin',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'Member', action: 'write', scope: 'own_org' },
        { resource_type: 'Programme', action: 'write', scope: 'own_org' },
        { resource_type: 'User', action: 'write', scope: 'own_org' },
        { resource_type: 'Organisation', action: 'read', scope: 'own_org' },
        { resource_type: 'AuditLog', action: 'read', scope: 'own_org' },
      ],
    },
    {
      id: 'role-programme-manager',
      name: 'Programme Manager',
      description: 'Configures care programmes, enrollment rules, and templates.',
      productScope: 'admin',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'Programme', action: 'write', scope: 'own_org' },
        { resource_type: 'Member', action: 'read', scope: 'own_org' },
        { resource_type: 'AuditLog', action: 'read', scope: 'own_org' },
      ],
    },
    {
      id: 'role-compliance-officer',
      name: 'Compliance Officer',
      description: 'Read-only access to audit logs, access reports, and consent records.',
      productScope: 'admin',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'AuditLog', action: 'export', scope: 'platform_wide' },
        { resource_type: 'Member', action: 'read', scope: 'platform_wide' },
      ],
    },
    {
      id: 'role-emr-clinician',
      name: 'EMR Clinician',
      description: 'Full clinical access to EMR patient records and care plans.',
      productScope: 'emr',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'Patient', action: 'write', scope: 'own_records' },
        { resource_type: 'CareRecord', action: 'write', scope: 'own_records' },
        { resource_type: 'Report', action: 'read', scope: 'own_site' },
      ],
    },
    {
      id: 'role-emr-readonly',
      name: 'EMR Read-Only',
      description: 'Read-only access to EMR patient records.',
      productScope: 'emr',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'Patient', action: 'read', scope: 'own_site' },
        { resource_type: 'CareRecord', action: 'read', scope: 'own_site' },
      ],
    },
    {
      id: 'role-crm-care-coordinator',
      name: 'CRM Care Coordinator',
      description: 'Manages contacts, referrals, care plans, and tasks in the CRM.',
      productScope: 'crm',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'Contact', action: 'write', scope: 'own_records' },
        { resource_type: 'Referral', action: 'write', scope: 'own_records' },
        { resource_type: 'Task', action: 'write', scope: 'own_records' },
        { resource_type: 'Report', action: 'read', scope: 'own_team' },
      ],
    },
    {
      id: 'role-crm-case-manager',
      name: 'CRM Case Manager',
      description: 'Supervises care coordinators and reviews complex cases.',
      productScope: 'crm',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'Contact', action: 'write', scope: 'own_site' },
        { resource_type: 'Referral', action: 'write', scope: 'own_site' },
        { resource_type: 'Task', action: 'write', scope: 'own_site' },
        { resource_type: 'Report', action: 'read', scope: 'own_site' },
      ],
    },
    {
      id: 'role-crm-analyst',
      name: 'CRM Analyst',
      description: 'Read-only access to CRM reports and dashboards.',
      productScope: 'crm',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'Contact', action: 'read', scope: 'platform_wide' },
        { resource_type: 'Report', action: 'export', scope: 'platform_wide' },
      ],
    },
    {
      id: 'role-ops-analyst',
      name: 'Operations Analyst',
      description: 'Read-only dashboards and integration monitoring.',
      productScope: 'admin',
      isBuiltIn: true,
      permissions: [
        { resource_type: 'Member', action: 'read', scope: 'own_org' },
        { resource_type: 'Integration', action: 'read', scope: 'platform_wide' },
        { resource_type: 'AuditLog', action: 'read', scope: 'own_org' },
      ],
    },
  ]

  for (const r of rolesData) {
    await prisma.role.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        name: r.name,
        description: r.description,
        productScope: r.productScope,
        isBuiltIn: r.isBuiltIn,
        permissions: r.permissions,
      },
    })
  }
  console.log(`  Roles: ${rolesData.length} created`)

  // ── User Role Assignments ────────────────────────────────────────────────────
  const userRoleAssignments = [
    { id: 'ur-admin-platform',    userId: USERS.admin,     roleId: 'role-platform-admin',       grantedBy: USERS.admin },
    { id: 'ur-admin-org',         userId: USERS.admin,     roleId: 'role-org-admin',             grantedBy: USERS.admin },
    { id: 'ur-physician-emr',     userId: USERS.physician, roleId: 'role-emr-clinician',         grantedBy: USERS.admin },
    { id: 'ur-physician-crm',     userId: USERS.physician, roleId: 'role-crm-case-manager',      grantedBy: USERS.admin },
    { id: 'ur-nursep-emr',        userId: USERS.nurseP,    roleId: 'role-emr-clinician',         grantedBy: USERS.admin },
    { id: 'ur-nursep-crm',        userId: USERS.nurseP,    roleId: 'role-crm-care-coordinator',  grantedBy: USERS.admin },
    { id: 'ur-nursep-prog',       userId: USERS.nurseP,    roleId: 'role-programme-manager',     grantedBy: USERS.admin },
    { id: 'ur-nurse-emr',         userId: USERS.nurse,     roleId: 'role-emr-clinician',         grantedBy: USERS.admin },
    { id: 'ur-nurse-crm',         userId: USERS.nurse,     roleId: 'role-crm-care-coordinator',  grantedBy: USERS.admin },
    { id: 'ur-frontdesk-emr',     userId: USERS.frontDesk, roleId: 'role-emr-readonly',          grantedBy: USERS.admin },
    { id: 'ur-frontdesk-crm',     userId: USERS.frontDesk, roleId: 'role-crm-care-coordinator',  grantedBy: USERS.admin },
    { id: 'ur-billing-emr',       userId: USERS.billing,   roleId: 'role-emr-readonly',          grantedBy: USERS.admin },
    { id: 'ur-billing-analyst',   userId: USERS.billing,   roleId: 'role-crm-analyst',           grantedBy: USERS.admin },
  ]

  for (const ur of userRoleAssignments) {
    await prisma.userRole.upsert({
      where: { id: ur.id },
      update: {},
      create: {
        id: ur.id,
        userId: ur.userId,
        roleId: ur.roleId,
        grantedBy: ur.grantedBy,
        grantedAt: daysAgo(Math.floor(Math.random() * 60) + 30),
      },
    })
  }
  console.log(`  User role assignments: ${userRoleAssignments.length} created`)

  // ── Audit Events ────────────────────────────────────────────────────────────
  const auditEvents = [
    // Member creates
    { service: 'admin', entityType: 'member', entityId: 'mem-001', action: 'create', actorId: USERS.frontDesk, actorRole: 'front_desk', daysAgo: 250, memberId: 'mem-001' },
    { service: 'admin', entityType: 'member', entityId: 'mem-002', action: 'create', actorId: USERS.frontDesk, actorRole: 'front_desk', daysAgo: 200, memberId: 'mem-002' },
    { service: 'admin', entityType: 'member', entityId: 'mem-003', action: 'create', actorId: USERS.frontDesk, actorRole: 'front_desk', daysAgo: 130, memberId: 'mem-003' },
    { service: 'admin', entityType: 'member', entityId: 'mem-004', action: 'create', actorId: USERS.frontDesk, actorRole: 'front_desk', daysAgo: 220, memberId: 'mem-004' },
    { service: 'admin', entityType: 'member', entityId: 'mem-005', action: 'create', actorId: USERS.frontDesk, actorRole: 'front_desk', daysAgo: 60,  memberId: 'mem-005' },
    { service: 'admin', entityType: 'member', entityId: 'mem-006', action: 'create', actorId: USERS.frontDesk, actorRole: 'front_desk', daysAgo: 20,  memberId: 'mem-006' },
    // Member views
    { service: 'admin', entityType: 'member', entityId: 'mem-001', action: 'view', actorId: USERS.nurseP,    actorRole: 'nurse_practitioner', daysAgo: 1, memberId: 'mem-001' },
    { service: 'admin', entityType: 'member', entityId: 'mem-001', action: 'view', actorId: USERS.physician, actorRole: 'physician',          daysAgo: 2, memberId: 'mem-001' },
    { service: 'admin', entityType: 'member', entityId: 'mem-005', action: 'view', actorId: USERS.nurse,     actorRole: 'nurse',              daysAgo: 1, memberId: 'mem-005' },
    // Member updates
    {
      service: 'admin', entityType: 'member', entityId: 'mem-013', action: 'update',
      actorId: USERS.admin, actorRole: 'admin', daysAgo: 14,
      fieldChanges: [{ field: 'status', oldValue: 'active', newValue: 'suspended' }],
      memberId: 'mem-013',
    },
    // EMR events (cross-service)
    { service: 'emr',   entityType: 'patient',    entityId: 'pat-harold-thompson', action: 'view',   actorId: USERS.physician, actorRole: 'physician',          daysAgo: 1,  memberId: 'mem-001' },
    { service: 'emr',   entityType: 'patient',    entityId: 'pat-harold-thompson', action: 'update', actorId: USERS.physician, actorRole: 'physician',          daysAgo: 3,  memberId: 'mem-001', fieldChanges: [{ field: 'medications', oldValue: 'furosemide 20mg', newValue: 'furosemide 40mg' }] },
    { service: 'emr',   entityType: 'patient',    entityId: 'pat-james-patel',     action: 'view',   actorId: USERS.nurseP,    actorRole: 'nurse_practitioner', daysAgo: 1,  memberId: 'mem-005' },
    { service: 'emr',   entityType: 'care_plan',  entityId: 'cp-harold-001',       action: 'create', actorId: USERS.physician, actorRole: 'physician',          daysAgo: 40, memberId: 'mem-001' },
    // CRM events (cross-service)
    { service: 'crm',   entityType: 'contact',    entityId: 'crm-harold-thompson', action: 'view',   actorId: USERS.nurseP,    actorRole: 'nurse_practitioner', daysAgo: 2,  memberId: 'mem-001' },
    { service: 'crm',   entityType: 'referral',   entityId: 'ref-harold-001',      action: 'create', actorId: USERS.frontDesk, actorRole: 'front_desk',         daysAgo: 50, memberId: 'mem-001' },
    { service: 'crm',   entityType: 'contact',    entityId: 'crm-margaret-okafor', action: 'update', actorId: USERS.nurseP,    actorRole: 'nurse_practitioner', daysAgo: 5,  memberId: 'mem-002', fieldChanges: [{ field: 'riskLevel', oldValue: 'medium', newValue: 'high' }] },
    // Enrollment events
    { service: 'admin', entityType: 'enrollment', entityId: 'enr-harold-chf',      action: 'create', actorId: USERS.frontDesk, actorRole: 'front_desk',         daysAgo: 45, memberId: 'mem-001' },
    { service: 'admin', entityType: 'enrollment', entityId: 'enr-james-chf',       action: 'create', actorId: USERS.frontDesk, actorRole: 'front_desk',         daysAgo: 33, memberId: 'mem-005' },
    { service: 'admin', entityType: 'enrollment', entityId: 'enr-thomas-chf',      action: 'update', actorId: USERS.admin,     actorRole: 'admin',              daysAgo: 14, memberId: 'mem-013', fieldChanges: [{ field: 'state', oldValue: 'active', newValue: 'disenrolled' }] },
    // Role assignment events
    { service: 'admin', entityType: 'user_role', entityId: 'ur-nursep-prog', action: 'create', actorId: USERS.admin, actorRole: 'admin', daysAgo: 60, memberId: null },
    // Auth events
    { service: 'auth',  entityType: 'session',    entityId: USERS.physician,       action: 'create', actorId: USERS.physician, actorRole: 'physician',          daysAgo: 0,  memberId: null },
    { service: 'auth',  entityType: 'session',    entityId: USERS.nurseP,          action: 'create', actorId: USERS.nurseP,    actorRole: 'nurse_practitioner', daysAgo: 0,  memberId: null },
    { service: 'auth',  entityType: 'session',    entityId: USERS.nurse,           action: 'create', actorId: USERS.nurse,     actorRole: 'nurse',              daysAgo: 1,  memberId: null },
  ]

  for (let i = 0; i < auditEvents.length; i++) {
    const e = auditEvents[i]
    await prisma.auditEvent.upsert({
      where: { eventId: `seed-event-${i}` },
      update: {},
      create: {
        eventId: `seed-event-${i}`,
        timestamp: daysAgo(e.daysAgo),
        service: e.service,
        entityType: e.entityType,
        entityId: e.entityId,
        action: e.action,
        actorId: e.actorId,
        actorRole: e.actorRole,
        correlationId: `corr-seed-${i}`,
        ipAddress: '10.0.1.' + ((i % 50) + 10),
        fieldChanges: (e as { fieldChanges?: object }).fieldChanges ?? undefined,
        memberId: e.memberId ?? null,
      },
    })
  }
  console.log(`  Audit events: ${auditEvents.length} created`)

  console.log('\nAdmin seed complete.')
  console.log(`  Organisation: Springfield Medical Group`)
  console.log(`  Sites: 3  |  Departments: 4  |  Teams: 3`)
  console.log(`  Programmes: ${programmes.length}  |  Members: ${members.length}`)
  console.log(`  Enrollments: ${enrollmentCount}  |  Roles: ${rolesData.length}`)
}

main()
  .catch((err) => {
    console.error('Admin seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
