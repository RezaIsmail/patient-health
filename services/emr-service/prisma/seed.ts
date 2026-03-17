import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

// ─── MRN generator ────────────────────────────────────────────────────────────

let mrnCounter = 1
function nextMrn(): string {
  return `PH-${String(mrnCounter++).padStart(6, '0')}`
}

// ─── Seed data ────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding EMR database…')

  // ── Patient 1: Sarah Johnson ────────────────────────────────────────────────
  const sarah = await prisma.patient.upsert({
    where: { mrn: 'PH-000001' },
    update: {},
    create: {
      mrn: nextMrn(),
      firstName: 'Sarah',
      lastName: 'Johnson',
      preferredName: 'Sarah',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'female',
      phone: '(555) 234-5678',
      email: 'sarah.johnson@email.com',
      address: {
        create: {
          line1: '142 Maple Street',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
          country: 'US',
        },
      },
      emergencyContacts: {
        create: [
          {
            name: 'David Johnson',
            relationship: 'Spouse',
            phone: '(555) 234-5679',
          },
        ],
      },
      insurances: {
        create: [
          {
            priority: 1,
            payerName: 'BlueCross BlueShield',
            memberId: 'BCBS-4521987',
            groupId: 'GRP-12345',
            subscriberName: 'Sarah Johnson',
            isActive: true,
          },
        ],
      },
    },
  })

  // Sarah's conditions
  await prisma.condition.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: sarah.id,
        icd10Code: 'I10',
        display: 'Essential Hypertension',
        clinicalStatus: 'active',
        severity: 'mild',
        onsetDate: new Date('2018-06-10'),
        recordedBy: 'seed-physician-001',
      },
      {
        patientId: sarah.id,
        icd10Code: 'E11.9',
        display: 'Type 2 Diabetes Mellitus',
        clinicalStatus: 'active',
        severity: 'moderate',
        onsetDate: new Date('2020-02-14'),
        recordedBy: 'seed-physician-001',
      },
    ],
  })

  // Sarah's medications
  await prisma.medicationRequest.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: sarah.id,
        medicationName: 'Metformin',
        dose: '1000 mg',
        frequency: 'Twice daily',
        route: 'Oral',
        status: 'active',
        prescribedBy: 'seed-physician-001',
        prescribedAt: new Date('2020-02-20'),
      },
      {
        patientId: sarah.id,
        medicationName: 'Lisinopril',
        dose: '10 mg',
        frequency: 'Once daily',
        route: 'Oral',
        status: 'active',
        prescribedBy: 'seed-physician-001',
        prescribedAt: new Date('2018-06-15'),
      },
      {
        patientId: sarah.id,
        medicationName: 'Atorvastatin',
        dose: '20 mg',
        frequency: 'Once daily at bedtime',
        route: 'Oral',
        status: 'active',
        prescribedBy: 'seed-physician-001',
        prescribedAt: new Date('2021-01-10'),
      },
    ],
  })

  // Sarah's allergies
  await prisma.allergyIntolerance.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: sarah.id,
        substance: 'Penicillin',
        type: 'allergy',
        criticality: 'high',
        clinicalStatus: 'active',
        reaction: 'Anaphylaxis',
        reactionSeverity: 'severe',
        onsetDate: new Date('2005-04-01'),
        recordedBy: 'seed-physician-001',
      },
    ],
  })

  // Sarah's vitals (recent)
  await prisma.observation.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: sarah.id,
        category: 'vitals',
        loincCode: '55284-4',
        display: 'Blood Pressure',
        valueString: '138/88',
        isAbnormal: true,
        effectiveAt: new Date('2025-10-15T09:30:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: sarah.id,
        category: 'vitals',
        loincCode: '8867-4',
        display: 'Heart Rate',
        valueQuantity: 78,
        valueUnit: 'bpm',
        referenceRangeLow: 60,
        referenceRangeHigh: 100,
        isAbnormal: false,
        effectiveAt: new Date('2025-10-15T09:30:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: sarah.id,
        category: 'vitals',
        loincCode: '29463-7',
        display: 'Body Weight',
        valueQuantity: 72.5,
        valueUnit: 'kg',
        isAbnormal: false,
        effectiveAt: new Date('2025-10-15T09:30:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: sarah.id,
        category: 'vitals',
        loincCode: '8302-2',
        display: 'Body Height',
        valueQuantity: 165,
        valueUnit: 'cm',
        isAbnormal: false,
        effectiveAt: new Date('2025-10-15T09:30:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: sarah.id,
        category: 'vitals',
        loincCode: '59408-5',
        display: 'Oxygen Saturation',
        valueQuantity: 98,
        valueUnit: '%',
        referenceRangeLow: 95,
        isAbnormal: false,
        effectiveAt: new Date('2025-10-15T09:30:00Z'),
        recordedBy: 'seed-nurse-001',
      },
    ],
  })

  // Sarah's lab results
  await prisma.observation.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: sarah.id,
        category: 'laboratory',
        loincCode: '4548-4',
        display: 'Hemoglobin A1c',
        valueQuantity: 7.2,
        valueUnit: '%',
        referenceRangeLow: 4.0,
        referenceRangeHigh: 5.6,
        isAbnormal: true,
        effectiveAt: new Date('2025-10-01T08:00:00Z'),
        recordedBy: 'seed-lab-001',
      },
      {
        patientId: sarah.id,
        category: 'laboratory',
        loincCode: '2093-3',
        display: 'Total Cholesterol',
        valueQuantity: 195,
        valueUnit: 'mg/dL',
        referenceRangeLow: 0,
        referenceRangeHigh: 200,
        isAbnormal: false,
        effectiveAt: new Date('2025-10-01T08:00:00Z'),
        recordedBy: 'seed-lab-001',
      },
      {
        patientId: sarah.id,
        category: 'laboratory',
        loincCode: '2339-0',
        display: 'Glucose (Fasting)',
        valueQuantity: 142,
        valueUnit: 'mg/dL',
        referenceRangeLow: 70,
        referenceRangeHigh: 100,
        isAbnormal: true,
        effectiveAt: new Date('2025-10-01T08:00:00Z'),
        recordedBy: 'seed-lab-001',
      },
    ],
  })

  // Sarah's immunisations
  await prisma.immunisation.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: sarah.id,
        vaccineName: 'Influenza (Flu)',
        status: 'completed',
        occurrenceDate: new Date('2024-10-01'),
        primarySource: true,
      },
      {
        patientId: sarah.id,
        vaccineName: 'COVID-19 mRNA (Moderna)',
        status: 'completed',
        occurrenceDate: new Date('2021-04-15'),
        lotNumber: 'MOD-001',
        primarySource: true,
      },
      {
        patientId: sarah.id,
        vaccineName: 'Tdap (Boostrix)',
        status: 'completed',
        occurrenceDate: new Date('2019-03-22'),
        primarySource: true,
      },
    ],
  })

  // Sarah's clinical documents
  await prisma.clinicalDocument.create({
    data: {
      patientId: sarah.id,
      type: 'progress-note',
      title: 'Diabetes & Hypertension Follow-up',
      content:
        'Patient presents for routine 3-month follow-up. BP remains mildly elevated at 138/88. ' +
        'A1c improved from 7.8% to 7.2% — good progress with dietary changes and metformin adherence. ' +
        'Continue current medications. Reinforce low-sodium diet for BP management. ' +
        'Return in 3 months or sooner if symptoms worsen.',
      status: 'final',
      authorId: 'seed-physician-001',
      authorName: 'Dr. Sarah Smith',
      signedAt: new Date('2025-10-15T11:00:00Z'),
    },
  })

  // Sarah's upcoming appointment
  await prisma.appointment.create({
    data: {
      patientId: sarah.id,
      providerId: 'seed-physician-001',
      status: 'booked',
      serviceType: 'follow-up',
      description: 'Diabetes & Hypertension 3-month follow-up',
      startTime: new Date('2026-01-15T10:00:00Z'),
      endTime: new Date('2026-01-15T10:30:00Z'),
      durationMinutes: 30,
    },
  })

  console.log(`  Created patient: ${sarah.firstName} ${sarah.lastName} (${sarah.mrn})`)

  // ── Patient 2: James Williams ───────────────────────────────────────────────
  const james = await prisma.patient.upsert({
    where: { mrn: 'PH-000002' },
    update: {},
    create: {
      mrn: 'PH-000002',
      firstName: 'James',
      lastName: 'Williams',
      dateOfBirth: new Date('1960-07-22'),
      gender: 'male',
      phone: '(555) 345-6789',
      email: 'james.williams@email.com',
      address: {
        create: {
          line1: '87 Oak Avenue',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62702',
          country: 'US',
        },
      },
      emergencyContacts: {
        create: [
          {
            name: 'Margaret Williams',
            relationship: 'Spouse',
            phone: '(555) 345-6790',
          },
        ],
      },
      insurances: {
        create: [
          {
            priority: 1,
            payerName: 'Medicare Part B',
            memberId: 'MCR-9876543210A',
            subscriberName: 'James Williams',
            isActive: true,
          },
          {
            priority: 2,
            payerName: 'AARP Supplemental',
            memberId: 'AARP-654321',
            groupId: 'SUP-99',
            subscriberName: 'James Williams',
            isActive: true,
          },
        ],
      },
    },
  })

  await prisma.condition.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: james.id,
        icd10Code: 'E11.65',
        display: 'Type 2 Diabetes with Hyperglycaemia',
        clinicalStatus: 'active',
        severity: 'moderate',
        onsetDate: new Date('2010-03-01'),
        recordedBy: 'seed-physician-001',
      },
      {
        patientId: james.id,
        icd10Code: 'J44.1',
        display: 'COPD with Acute Exacerbation',
        clinicalStatus: 'active',
        severity: 'moderate',
        onsetDate: new Date('2015-08-12'),
        recordedBy: 'seed-physician-001',
      },
      {
        patientId: james.id,
        icd10Code: 'I10',
        display: 'Essential Hypertension',
        clinicalStatus: 'active',
        severity: 'mild',
        onsetDate: new Date('2008-01-15'),
        recordedBy: 'seed-physician-001',
      },
      {
        patientId: james.id,
        icd10Code: 'E78.5',
        display: 'Hyperlipidaemia',
        clinicalStatus: 'active',
        onsetDate: new Date('2012-05-20'),
        recordedBy: 'seed-physician-001',
      },
    ],
  })

  await prisma.medicationRequest.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: james.id,
        medicationName: 'Metformin',
        dose: '500 mg',
        frequency: 'Twice daily',
        route: 'Oral',
        status: 'active',
        prescribedBy: 'seed-physician-001',
      },
      {
        patientId: james.id,
        medicationName: 'Insulin Glargine (Lantus)',
        dose: '20 units',
        frequency: 'Once daily at bedtime',
        route: 'Subcutaneous',
        status: 'active',
        prescribedBy: 'seed-physician-001',
      },
      {
        patientId: james.id,
        medicationName: 'Tiotropium (Spiriva)',
        dose: '18 mcg',
        frequency: 'Once daily (inhaled)',
        route: 'Inhalation',
        status: 'active',
        prescribedBy: 'seed-physician-001',
      },
      {
        patientId: james.id,
        medicationName: 'Salbutamol (Ventolin) PRN',
        dose: '100 mcg',
        frequency: 'As needed',
        route: 'Inhalation',
        status: 'active',
        prescribedBy: 'seed-physician-001',
      },
      {
        patientId: james.id,
        medicationName: 'Amlodipine',
        dose: '5 mg',
        frequency: 'Once daily',
        route: 'Oral',
        status: 'active',
        prescribedBy: 'seed-physician-001',
      },
      {
        patientId: james.id,
        medicationName: 'Rosuvastatin',
        dose: '20 mg',
        frequency: 'Once daily',
        route: 'Oral',
        status: 'active',
        prescribedBy: 'seed-physician-001',
      },
    ],
  })

  await prisma.allergyIntolerance.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: james.id,
        substance: 'Sulfa drugs (Sulfonamides)',
        type: 'allergy',
        criticality: 'high',
        clinicalStatus: 'active',
        reaction: 'Severe rash / Stevens-Johnson syndrome',
        reactionSeverity: 'severe',
        recordedBy: 'seed-physician-001',
      },
      {
        patientId: james.id,
        substance: 'NSAIDs (Ibuprofen)',
        type: 'intolerance',
        criticality: 'low',
        clinicalStatus: 'active',
        reaction: 'GI upset, worsening dyspepsia',
        reactionSeverity: 'mild',
        recordedBy: 'seed-physician-001',
      },
    ],
  })

  await prisma.observation.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: james.id,
        category: 'vitals',
        display: 'Blood Pressure',
        valueString: '152/94',
        isAbnormal: true,
        effectiveAt: new Date('2025-10-10T10:00:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: james.id,
        category: 'vitals',
        display: 'Heart Rate',
        valueQuantity: 88,
        valueUnit: 'bpm',
        referenceRangeLow: 60,
        referenceRangeHigh: 100,
        isAbnormal: false,
        effectiveAt: new Date('2025-10-10T10:00:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: james.id,
        category: 'vitals',
        display: 'Oxygen Saturation',
        valueQuantity: 93,
        valueUnit: '%',
        referenceRangeLow: 95,
        isAbnormal: true,
        effectiveAt: new Date('2025-10-10T10:00:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: james.id,
        category: 'laboratory',
        loincCode: '4548-4',
        display: 'Hemoglobin A1c',
        valueQuantity: 8.9,
        valueUnit: '%',
        referenceRangeLow: 4.0,
        referenceRangeHigh: 5.6,
        isAbnormal: true,
        effectiveAt: new Date('2025-09-20T08:00:00Z'),
        recordedBy: 'seed-lab-001',
      },
      {
        patientId: james.id,
        category: 'laboratory',
        loincCode: '33959-8',
        display: 'FEV1 (Spirometry)',
        valueQuantity: 58,
        valueUnit: '% predicted',
        referenceRangeLow: 80,
        isAbnormal: true,
        effectiveAt: new Date('2025-09-20T08:00:00Z'),
        recordedBy: 'seed-lab-001',
      },
    ],
  })

  await prisma.immunisation.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: james.id,
        vaccineName: 'Pneumococcal (PPSV23)',
        status: 'completed',
        occurrenceDate: new Date('2022-06-01'),
        primarySource: true,
      },
      {
        patientId: james.id,
        vaccineName: 'Influenza (Flu)',
        status: 'completed',
        occurrenceDate: new Date('2024-10-05'),
        primarySource: true,
      },
      {
        patientId: james.id,
        vaccineName: 'Zoster (Shingrix) — Dose 1',
        status: 'completed',
        occurrenceDate: new Date('2023-03-10'),
        primarySource: true,
      },
    ],
  })

  await prisma.appointment.create({
    data: {
      patientId: james.id,
      providerId: 'seed-physician-001',
      status: 'booked',
      serviceType: 'follow-up',
      description: 'COPD / Diabetes quarterly review',
      startTime: new Date('2026-01-20T14:00:00Z'),
      endTime: new Date('2026-01-20T14:45:00Z'),
      durationMinutes: 45,
    },
  })

  console.log(`  Created patient: ${james.firstName} ${james.lastName} (${james.mrn})`)

  // ── Patient 3: Emily Chen ───────────────────────────────────────────────────
  const emily = await prisma.patient.upsert({
    where: { mrn: 'PH-000003' },
    update: {},
    create: {
      mrn: 'PH-000003',
      firstName: 'Emily',
      lastName: 'Chen',
      preferredName: 'Em',
      dateOfBirth: new Date('1995-11-08'),
      gender: 'female',
      phone: '(555) 456-7890',
      email: 'emily.chen@email.com',
      address: {
        create: {
          line1: '310 Pine Court, Apt 4B',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62703',
          country: 'US',
        },
      },
      emergencyContacts: {
        create: [
          {
            name: 'Linda Chen',
            relationship: 'Mother',
            phone: '(555) 456-7891',
          },
        ],
      },
      insurances: {
        create: [
          {
            priority: 1,
            payerName: 'Aetna Health',
            memberId: 'AET-7654321',
            groupId: 'EMP-44567',
            subscriberName: 'Emily Chen',
            isActive: true,
          },
        ],
      },
    },
  })

  // Emily is healthy — no active conditions, just annual checkup observations
  await prisma.observation.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: emily.id,
        category: 'vitals',
        display: 'Blood Pressure',
        valueString: '112/72',
        isAbnormal: false,
        effectiveAt: new Date('2025-11-08T09:00:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: emily.id,
        category: 'vitals',
        display: 'Heart Rate',
        valueQuantity: 68,
        valueUnit: 'bpm',
        referenceRangeLow: 60,
        referenceRangeHigh: 100,
        isAbnormal: false,
        effectiveAt: new Date('2025-11-08T09:00:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: emily.id,
        category: 'vitals',
        display: 'Body Weight',
        valueQuantity: 58,
        valueUnit: 'kg',
        isAbnormal: false,
        effectiveAt: new Date('2025-11-08T09:00:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: emily.id,
        category: 'vitals',
        display: 'Body Height',
        valueQuantity: 162,
        valueUnit: 'cm',
        isAbnormal: false,
        effectiveAt: new Date('2025-11-08T09:00:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: emily.id,
        category: 'vitals',
        display: 'Oxygen Saturation',
        valueQuantity: 99,
        valueUnit: '%',
        referenceRangeLow: 95,
        isAbnormal: false,
        effectiveAt: new Date('2025-11-08T09:00:00Z'),
        recordedBy: 'seed-nurse-001',
      },
      {
        patientId: emily.id,
        category: 'laboratory',
        loincCode: '58410-2',
        display: 'CBC Panel',
        valueString: 'All values within normal limits',
        isAbnormal: false,
        effectiveAt: new Date('2025-11-01T08:00:00Z'),
        recordedBy: 'seed-lab-001',
      },
    ],
  })

  await prisma.immunisation.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: emily.id,
        vaccineName: 'Influenza (Flu)',
        status: 'completed',
        occurrenceDate: new Date('2024-10-08'),
        primarySource: true,
      },
      {
        patientId: emily.id,
        vaccineName: 'COVID-19 mRNA (Pfizer)',
        status: 'completed',
        occurrenceDate: new Date('2021-05-01'),
        primarySource: true,
      },
      {
        patientId: emily.id,
        vaccineName: 'HPV (Gardasil 9) — Series complete',
        status: 'completed',
        occurrenceDate: new Date('2013-09-15'),
        primarySource: true,
      },
    ],
  })

  await prisma.clinicalDocument.create({
    data: {
      patientId: emily.id,
      type: 'progress-note',
      title: 'Annual Wellness Examination',
      content:
        'Emily presents for her annual wellness exam. She is in excellent health with no active complaints. ' +
        'Vitals within normal limits. BMI 22.1 — healthy range. ' +
        'Labs including CBC and metabolic panel all within normal limits. ' +
        'Counselled on sun protection, stress management, and maintaining current healthy lifestyle. ' +
        'Up-to-date on recommended immunisations. Return in 12 months.',
      status: 'final',
      authorId: 'seed-physician-001',
      authorName: 'Dr. Sarah Smith',
      signedAt: new Date('2025-11-08T11:30:00Z'),
    },
  })

  await prisma.appointment.create({
    data: {
      patientId: emily.id,
      providerId: 'seed-physician-001',
      status: 'booked',
      serviceType: 'wellness',
      description: 'Annual Wellness Examination',
      startTime: new Date('2026-11-08T09:00:00Z'),
      endTime: new Date('2026-11-08T09:30:00Z'),
      durationMinutes: 30,
    },
  })

  console.log(`  Created patient: ${emily.firstName} ${emily.lastName} (${emily.mrn})`)

  console.log('\nEMR seed complete.')
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
