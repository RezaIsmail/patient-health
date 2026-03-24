import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

// Auth user IDs aligned with auth-service seed accounts
const USERS = {
  physician: 'user-dr-smith-001',
  nurseP: 'user-np-jones-001',
  nurse: 'user-nurse-davis-001',
  frontDesk: 'user-reception-001',
  admin: 'user-admin-001',
}

async function main() {
  console.log('Seeding CRM database…')

  // ── Accounts ───────────────────────────────────────────────────────────────
  // Organisations: the clinic itself plus payers linked to each patient

  const clinic = await prisma.account.upsert({
    where: { id: 'acc-springfield-medical' },
    update: {},
    create: {
      id: 'acc-springfield-medical',
      name: 'Springfield Medical Group',
      type: 'clinic',
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

  const bcbs = await prisma.account.upsert({
    where: { id: 'acc-bcbs' },
    update: {},
    create: {
      id: 'acc-bcbs',
      name: 'BlueCross BlueShield',
      type: 'payer',
      status: 'active',
      phone: '(800) 521-2227',
      website: 'https://bcbs.com',
      parentAccountId: null,
    },
  })

  const medicare = await prisma.account.upsert({
    where: { id: 'acc-medicare' },
    update: {},
    create: {
      id: 'acc-medicare',
      name: 'Medicare',
      type: 'payer',
      status: 'active',
      phone: '(800) 633-4227',
      website: 'https://medicare.gov',
    },
  })

  const aetna = await prisma.account.upsert({
    where: { id: 'acc-aetna' },
    update: {},
    create: {
      id: 'acc-aetna',
      name: 'Aetna Health',
      type: 'payer',
      status: 'active',
      phone: '(800) 872-3862',
      website: 'https://aetna.com',
    },
  })

  console.log(`  Accounts: ${clinic.name}, ${bcbs.name}, ${medicare.name}, ${aetna.name}`)

  // ── Contacts ───────────────────────────────────────────────────────────────
  // One CRM contact per EMR patient — emrPatientId links by MRN

  const sarah = await prisma.contact.upsert({
    where: { id: 'contact-sarah-johnson' },
    update: {},
    create: {
      id: 'contact-sarah-johnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      preferredName: 'Sarah',
      dateOfBirth: new Date('1985-03-15'),
      sex: 'female',
      phone: '(555) 234-5678',
      email: 'sarah.johnson@email.com',
      language: 'en',
      status: 'active',
      source: 'self-referral',
      riskLevel: 'medium',
      sdohFlags: [],
      assignedTo: USERS.nurseP,
      accountId: bcbs.id,
      emrPatientId: 'emr-patient-sarah-johnson',
      addressLine1: '142 Maple Street',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'US',
      notes:
        'Motivated patient. Good adherence to Metformin and Lisinopril. Working on dietary changes for BP and diabetes management. Improving HbA1c trend (7.8% → 7.2%).',
    },
  })

  const james = await prisma.contact.upsert({
    where: { id: 'contact-james-williams' },
    update: {},
    create: {
      id: 'contact-james-williams',
      firstName: 'James',
      lastName: 'Williams',
      dateOfBirth: new Date('1960-07-22'),
      sex: 'male',
      phone: '(555) 345-6789',
      email: 'james.williams@email.com',
      language: 'en',
      status: 'active',
      source: 'referral',
      riskLevel: 'high',
      sdohFlags: ['transportation'],
      assignedTo: USERS.nurseP,
      accountId: medicare.id,
      emrPatientId: 'emr-patient-james-williams',
      addressLine1: '87 Oak Avenue',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62702',
      country: 'US',
      notes:
        'Complex multi-morbidity patient (T2D + COPD + HTN + Hyperlipidaemia). Transportation barrier causing missed insulin doses — medication delivery arranged. Requires close monitoring and proactive outreach.',
    },
  })

  const emily = await prisma.contact.upsert({
    where: { id: 'contact-emily-chen' },
    update: {},
    create: {
      id: 'contact-emily-chen',
      firstName: 'Emily',
      lastName: 'Chen',
      preferredName: 'Em',
      dateOfBirth: new Date('1995-11-08'),
      sex: 'female',
      phone: '(555) 456-7890',
      email: 'emily.chen@email.com',
      language: 'en',
      status: 'active',
      source: 'web',
      riskLevel: 'low',
      sdohFlags: [],
      assignedTo: USERS.frontDesk,
      accountId: aetna.id,
      emrPatientId: 'emr-patient-emily-chen',
      addressLine1: '310 Pine Court, Apt 4B',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62703',
      country: 'US',
      notes: 'Healthy young adult. Excellent wellness visit. Annual reminders sufficient. Next visit due Nov 2026.',
    },
  })

  console.log(`  Contacts: ${sarah.firstName} ${sarah.lastName}, ${james.firstName} ${james.lastName}, ${emily.firstName} ${emily.lastName}`)

  // ── Care Teams ─────────────────────────────────────────────────────────────

  await prisma.careTeam.upsert({
    where: { contactId: sarah.id },
    update: {},
    create: {
      id: 'careteam-sarah',
      contactId: sarah.id,
      name: 'Sarah Johnson Care Team',
      members: {
        create: [
          { userId: USERS.physician, memberName: 'Dr. Sarah Smith', role: 'physician', isPrimary: true },
          { userId: USERS.nurseP, memberName: 'Michael Jones, NP', role: 'care_coordinator', isPrimary: false },
          { userId: USERS.nurse, memberName: 'Emily Davis, RN', role: 'nurse', isPrimary: false },
        ],
      },
    },
  })

  await prisma.careTeam.upsert({
    where: { contactId: james.id },
    update: {},
    create: {
      id: 'careteam-james',
      contactId: james.id,
      name: 'James Williams Care Team',
      members: {
        create: [
          { userId: USERS.physician, memberName: 'Dr. Sarah Smith', role: 'physician', isPrimary: true },
          { userId: USERS.nurseP, memberName: 'Michael Jones, NP', role: 'care_coordinator', isPrimary: false },
          { userId: USERS.nurse, memberName: 'Emily Davis, RN', role: 'nurse', isPrimary: false },
        ],
      },
    },
  })

  await prisma.careTeam.upsert({
    where: { contactId: emily.id },
    update: {},
    create: {
      id: 'careteam-emily',
      contactId: emily.id,
      name: 'Emily Chen Care Team',
      members: {
        create: [
          { userId: USERS.physician, memberName: 'Dr. Sarah Smith', role: 'physician', isPrimary: true },
          { userId: USERS.frontDesk, memberName: 'Jessica Taylor', role: 'care_coordinator', isPrimary: false },
        ],
      },
    },
  })

  console.log('  Care teams created for all three contacts')

  // ── Care Plans ─────────────────────────────────────────────────────────────
  // Sarah — Diabetes & Hypertension Management

  const sarahPlan = await prisma.carePlan.upsert({
    where: { id: 'careplan-sarah-diabetes-htn' },
    update: {},
    create: {
      id: 'careplan-sarah-diabetes-htn',
      contactId: sarah.id,
      title: 'Diabetes & Hypertension Management Plan',
      description:
        'Integrated care plan addressing Type 2 Diabetes Mellitus and Essential Hypertension. ' +
        'Focus on medication adherence, lifestyle modification, and regular monitoring to achieve glycaemic and BP targets.',
      status: 'active',
      templateKey: 'diabetes',
      startDate: new Date('2025-10-15'),
      endDate: new Date('2026-10-15'),
      assignedTo: USERS.nurseP,
      createdBy: USERS.physician,
    },
  })

  await prisma.carePlanProblem.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'cpp-sarah-diabetes',
        carePlanId: sarahPlan.id,
        description: 'Type 2 Diabetes Mellitus — HbA1c 7.2% (target < 7.0%)',
        icd10Code: 'E11.9',
        status: 'active',
        onsetDate: new Date('2020-02-14'),
      },
      {
        id: 'cpp-sarah-htn',
        carePlanId: sarahPlan.id,
        description: 'Essential Hypertension — BP 138/88 mmHg (target < 130/80)',
        icd10Code: 'I10',
        status: 'active',
        onsetDate: new Date('2018-06-10'),
      },
    ],
  })

  const sarahGoal1 = await prisma.carePlanGoal.upsert({
    where: { id: 'cpg-sarah-hba1c' },
    update: {},
    create: {
      id: 'cpg-sarah-hba1c',
      carePlanId: sarahPlan.id,
      problemId: 'cpp-sarah-diabetes',
      description: 'Reduce HbA1c to below 7.0% within 6 months',
      targetDate: new Date('2026-04-15'),
      status: 'in_progress',
    },
  })

  const sarahGoal2 = await prisma.carePlanGoal.upsert({
    where: { id: 'cpg-sarah-bp' },
    update: {},
    create: {
      id: 'cpg-sarah-bp',
      carePlanId: sarahPlan.id,
      problemId: 'cpp-sarah-htn',
      description: 'Achieve blood pressure target of < 130/80 mmHg',
      targetDate: new Date('2026-04-15'),
      status: 'in_progress',
    },
  })

  await prisma.carePlanIntervention.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'cpi-sarah-hba1c-monitor',
        carePlanId: sarahPlan.id,
        goalId: sarahGoal1.id,
        description: 'HbA1c lab order every 3 months',
        type: 'monitoring',
        frequency: 'Every 3 months',
        assignedTo: USERS.nurseP,
        status: 'active',
      },
      {
        id: 'cpi-sarah-dsme',
        carePlanId: sarahPlan.id,
        goalId: sarahGoal1.id,
        description: 'Diabetes self-management education — carbohydrate counting and meal planning',
        type: 'education',
        frequency: 'Weekly for 4 weeks, then monthly',
        assignedTo: USERS.nurseP,
        status: 'active',
      },
      {
        id: 'cpi-sarah-bp-monitor',
        carePlanId: sarahPlan.id,
        goalId: sarahGoal2.id,
        description: 'Home BP monitoring — twice-daily readings log',
        type: 'monitoring',
        frequency: 'Daily',
        assignedTo: USERS.nurse,
        status: 'active',
      },
      {
        id: 'cpi-sarah-diet',
        carePlanId: sarahPlan.id,
        goalId: sarahGoal2.id,
        description: 'Low-sodium diet counselling (< 2,300 mg sodium/day)',
        type: 'education',
        frequency: 'Monthly',
        assignedTo: USERS.nurseP,
        status: 'active',
      },
      {
        id: 'cpi-sarah-endo',
        carePlanId: sarahPlan.id,
        goalId: sarahGoal1.id,
        description: 'Referral to endocrinology for diabetes specialist input — consider GLP-1 agonist',
        type: 'referral',
        frequency: 'One-time',
        assignedTo: USERS.physician,
        status: 'active',
      },
    ],
  })

  await prisma.carePlanNote.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'cpn-sarah-initial',
        carePlanId: sarahPlan.id,
        content:
          'Initial care plan established following Oct 2025 follow-up. Patient motivated and adherent to Metformin and Lisinopril. ' +
          'A1c improved from 7.8% to 7.2% — good trajectory. Dietary sodium restriction discussed for BP management.',
        authorId: USERS.physician,
        authorName: 'Dr. Sarah Smith',
        createdAt: new Date('2025-10-15T11:30:00Z'),
      },
    ],
  })

  // James — Complex Chronic Disease Management

  const jamesPlan = await prisma.carePlan.upsert({
    where: { id: 'careplan-james-complex' },
    update: {},
    create: {
      id: 'careplan-james-complex',
      contactId: james.id,
      title: 'Complex Chronic Disease Management Plan',
      description:
        'Multi-morbidity care plan addressing T2D with hyperglycaemia, COPD with exacerbation history, Essential Hypertension, and Hyperlipidaemia. ' +
        'Requires coordinated multi-disciplinary care including pulmonology, endocrinology, and pharmacy.',
      status: 'active',
      templateKey: 'copd',
      startDate: new Date('2025-10-10'),
      endDate: new Date('2026-10-10'),
      assignedTo: USERS.nurseP,
      createdBy: USERS.physician,
    },
  })

  await prisma.carePlanProblem.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'cpp-james-diabetes',
        carePlanId: jamesPlan.id,
        description: 'Type 2 Diabetes with Hyperglycaemia — HbA1c 8.9% (target < 8.0%)',
        icd10Code: 'E11.65',
        status: 'active',
        onsetDate: new Date('2010-03-01'),
      },
      {
        id: 'cpp-james-copd',
        carePlanId: jamesPlan.id,
        description: 'COPD with Acute Exacerbation history — FEV1 58% predicted',
        icd10Code: 'J44.1',
        status: 'active',
        onsetDate: new Date('2015-08-12'),
      },
      {
        id: 'cpp-james-htn',
        carePlanId: jamesPlan.id,
        description: 'Essential Hypertension — BP 152/94 mmHg (target < 140/90)',
        icd10Code: 'I10',
        status: 'active',
        onsetDate: new Date('2008-01-15'),
      },
      {
        id: 'cpp-james-hyperlipidemia',
        carePlanId: jamesPlan.id,
        description: 'Hyperlipidaemia — on Rosuvastatin 20 mg',
        icd10Code: 'E78.5',
        status: 'active',
        onsetDate: new Date('2012-05-20'),
      },
    ],
  })

  const jamesGoal1 = await prisma.carePlanGoal.upsert({
    where: { id: 'cpg-james-hba1c' },
    update: {},
    create: {
      id: 'cpg-james-hba1c',
      carePlanId: jamesPlan.id,
      problemId: 'cpp-james-diabetes',
      description: 'Reduce HbA1c to below 8.0% within 6 months',
      targetDate: new Date('2026-04-10'),
      status: 'in_progress',
    },
  })

  const jamesGoal2 = await prisma.carePlanGoal.upsert({
    where: { id: 'cpg-james-copd' },
    update: {},
    create: {
      id: 'cpg-james-copd',
      carePlanId: jamesPlan.id,
      problemId: 'cpp-james-copd',
      description: 'Stabilise COPD — prevent further exacerbations, maintain FEV1',
      targetDate: new Date('2026-04-10'),
      status: 'in_progress',
    },
  })

  const jamesGoal3 = await prisma.carePlanGoal.upsert({
    where: { id: 'cpg-james-bp' },
    update: {},
    create: {
      id: 'cpg-james-bp',
      carePlanId: jamesPlan.id,
      problemId: 'cpp-james-htn',
      description: 'Achieve BP target < 140/90 mmHg',
      targetDate: new Date('2026-04-10'),
      status: 'in_progress',
    },
  })

  await prisma.carePlanIntervention.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'cpi-james-hba1c-monitor',
        carePlanId: jamesPlan.id,
        goalId: jamesGoal1.id,
        description: 'HbA1c monitoring every 3 months',
        type: 'monitoring',
        frequency: 'Every 3 months',
        assignedTo: USERS.nurseP,
        status: 'active',
      },
      {
        id: 'cpi-james-insulin',
        carePlanId: jamesPlan.id,
        goalId: jamesGoal1.id,
        description: 'Insulin dose titration review — monthly phone check-in',
        type: 'medication_adjustment',
        frequency: 'Monthly',
        assignedTo: USERS.physician,
        status: 'active',
      },
      {
        id: 'cpi-james-pulm-referral',
        carePlanId: jamesPlan.id,
        goalId: jamesGoal2.id,
        description: 'Pulmonology referral — COPD management and spirometry review (COMPLETED)',
        type: 'referral',
        frequency: 'Quarterly follow-up',
        assignedTo: USERS.physician,
        status: 'completed',
      },
      {
        id: 'cpi-james-inhaler',
        carePlanId: jamesPlan.id,
        goalId: jamesGoal2.id,
        description: 'Inhaler technique education and rescue inhaler usage diary',
        type: 'education',
        frequency: 'Weekly for first month',
        assignedTo: USERS.nurseP,
        status: 'active',
      },
      {
        id: 'cpi-james-pulm-rehab',
        carePlanId: jamesPlan.id,
        goalId: jamesGoal2.id,
        description: 'Pulmonary rehabilitation — 12-week programme',
        type: 'referral',
        frequency: '3x per week for 12 weeks',
        assignedTo: USERS.nurseP,
        status: 'active',
      },
      {
        id: 'cpi-james-bp-monitor',
        carePlanId: jamesPlan.id,
        goalId: jamesGoal3.id,
        description: 'Monthly BP check (telehealth or in-clinic)',
        type: 'monitoring',
        frequency: 'Monthly',
        assignedTo: USERS.nurse,
        status: 'active',
      },
    ],
  })

  await prisma.carePlanNote.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'cpn-james-initial',
        carePlanId: jamesPlan.id,
        content:
          'James enrolled in complex care management programme. High-risk patient with 4 active chronic conditions. ' +
          'Key concerns: HbA1c 8.9%, COPD FEV1 58%, BP 152/94. Transportation barrier identified — coordinating telehealth and medication delivery. ' +
          'Pulmonology referral initiated.',
        authorId: USERS.physician,
        authorName: 'Dr. Sarah Smith',
        createdAt: new Date('2025-10-10T14:00:00Z'),
      },
      {
        id: 'cpn-james-np-checkin',
        carePlanId: jamesPlan.id,
        content:
          'NP check-in: Patient using salbutamol 3–4 times/week — above expected. Reviewed Spiriva technique, identified incorrect inhalation method. ' +
          'Pulmonology appointment confirmed for Nov 12. Reviewed insulin injection technique — minor correction made. Medication delivery confirmed active.',
        authorId: USERS.nurseP,
        authorName: 'Michael Jones, NP',
        createdAt: new Date('2025-10-24T10:00:00Z'),
      },
      {
        id: 'cpn-james-post-pulm',
        carePlanId: jamesPlan.id,
        content:
          'Post-pulmonology review: Dr. Lisa Chen confirmed COPD Grade III (severe). Switched from Tiotropium to Trelegy Ellipta (triple therapy). ' +
          'O2 sat improved to 96%. Pulmonary rehabilitation programme commenced. Next spirometry in 3 months.',
        authorId: USERS.physician,
        authorName: 'Dr. Sarah Smith',
        createdAt: new Date('2025-11-13T14:00:00Z'),
      },
    ],
  })

  console.log('  Care plans created for Sarah Johnson and James Williams')

  // ── Referrals ──────────────────────────────────────────────────────────────

  const sarahReferral = await prisma.referral.upsert({
    where: { referralNumber: 'REF-20251015-0001' },
    update: {},
    create: {
      id: 'ref-sarah-endo',
      referralNumber: 'REF-20251015-0001',
      contactId: sarah.id,
      type: 'outbound',
      stage: 'scheduled',
      priority: 'routine',
      referringProvider: 'Dr. Sarah Smith',
      referringOrgName: 'Springfield Medical Group',
      receivingProvider: 'Dr. Alan Park, MD',
      receivingOrgName: 'Springfield Endocrinology Associates',
      reasonDisplay:
        'Type 2 Diabetes — specialist input for optimisation of glycaemic control. HbA1c 7.2% on Metformin 1000 mg BD. Considering addition of GLP-1 agonist.',
      dueDate: new Date('2026-01-30'),
      assignedTo: USERS.nurseP,
      createdBy: USERS.physician,
      createdAt: new Date('2025-10-15T12:00:00Z'),
    },
  })

  const jamesReferralPulm = await prisma.referral.upsert({
    where: { referralNumber: 'REF-20251010-0002' },
    update: {},
    create: {
      id: 'ref-james-pulm',
      referralNumber: 'REF-20251010-0002',
      contactId: james.id,
      type: 'outbound',
      stage: 'completed',
      priority: 'urgent',
      referringProvider: 'Dr. Sarah Smith',
      referringOrgName: 'Springfield Medical Group',
      receivingProvider: 'Dr. Lisa Chen, MD',
      receivingOrgName: 'Springfield Pulmonary & Critical Care',
      reasonDisplay:
        'COPD with FEV1 58% predicted and recent acute exacerbation. Requires pulmonology evaluation, spirometry review, and consideration of long-term oxygen therapy.',
      outcome: 'kept',
      outcomeNotes:
        'COPD Grade III confirmed. Switched to Trelegy Ellipta (triple therapy). Pulmonary rehabilitation programme commenced. Follow-up spirometry in 3 months.',
      assignedTo: USERS.nurseP,
      createdBy: USERS.physician,
      createdAt: new Date('2025-10-10T15:00:00Z'),
    },
  })

  const jamesReferralCardio = await prisma.referral.upsert({
    where: { referralNumber: 'REF-20251024-0003' },
    update: {},
    create: {
      id: 'ref-james-cardio',
      referralNumber: 'REF-20251024-0003',
      contactId: james.id,
      type: 'outbound',
      stage: 'authorized',
      priority: 'routine',
      referringProvider: 'Dr. Sarah Smith',
      referringOrgName: 'Springfield Medical Group',
      receivingProvider: 'Dr. Robert Torres, MD',
      receivingOrgName: 'Springfield Cardiovascular Group',
      reasonDisplay:
        'Persistent hypertension 152/94 mmHg despite Amlodipine 5 mg. Hyperlipidaemia on Rosuvastatin. ' +
        'Cardiovascular risk stratification requested given diabetic + COPD comorbidities.',
      authorizationNumber: 'AUTH-MCR-2025-8834',
      dueDate: new Date('2026-02-10'),
      assignedTo: USERS.nurseP,
      createdBy: USERS.physician,
      createdAt: new Date('2025-10-24T11:00:00Z'),
    },
  })

  console.log('  Referrals: 1 for Sarah (endocrinology), 2 for James (pulmonology, cardiology)')

  // ── Care Gaps ──────────────────────────────────────────────────────────────

  const sarahGap1 = await prisma.careGap.upsert({
    where: { id: 'gap-sarah-hba1c' },
    update: {},
    create: {
      id: 'gap-sarah-hba1c',
      contactId: sarah.id,
      gapType: 'hba1c',
      description: 'HbA1c due Q1 2026 — last result 7.2% (Oct 2025), target < 7.0%',
      status: 'open',
      priority: 'medium',
      identifiedBy: USERS.nurseP,
      targetDate: new Date('2026-01-15'),
      notes: 'Patient on Metformin 1000 mg BD. Improving trend (7.8% → 7.2%). Endocrinology referral also in progress.',
    },
  })

  const sarahGap2 = await prisma.careGap.upsert({
    where: { id: 'gap-sarah-bp' },
    update: {},
    create: {
      id: 'gap-sarah-bp',
      contactId: sarah.id,
      gapType: 'bp_check',
      description: 'Monthly BP monitoring required — last reading 138/88 mmHg (above 130/80 target)',
      status: 'in_progress',
      priority: 'medium',
      identifiedBy: USERS.nurse,
      targetDate: new Date('2026-01-15'),
      notes: 'Patient instructed to log home BP twice daily. Results to be reviewed at January follow-up.',
    },
  })

  const jamesGap1 = await prisma.careGap.upsert({
    where: { id: 'gap-james-hba1c' },
    update: {},
    create: {
      id: 'gap-james-hba1c',
      contactId: james.id,
      gapType: 'hba1c',
      description: 'HbA1c critically elevated at 8.9% — urgent repeat required in 6 weeks',
      status: 'in_progress',
      priority: 'critical',
      identifiedBy: USERS.physician,
      targetDate: new Date('2025-12-01'),
      notes:
        'Insulin dose titration underway. Transportation barrier causing missed doses — medication delivery arranged. Cardiology and endocrinology input pending.',
    },
  })

  await prisma.careGap.upsert({
    where: { id: 'gap-james-post-discharge' },
    update: {},
    create: {
      id: 'gap-james-post-discharge',
      contactId: james.id,
      gapType: 'post_discharge_followup',
      description: 'Post-COPD-exacerbation follow-up — ensure respiratory status stabilised',
      status: 'closed',
      priority: 'high',
      identifiedBy: USERS.physician,
      targetDate: new Date('2025-11-01'),
      closedAt: new Date('2025-11-04'),
      closedBy: USERS.nurseP,
      notes: 'Pulmonology appointment completed Nov 12. New inhaler regimen (Trelegy Ellipta) commenced. O2 sat improved to 96%.',
    },
  })

  await prisma.careGap.upsert({
    where: { id: 'gap-james-flu' },
    update: {},
    create: {
      id: 'gap-james-flu',
      contactId: james.id,
      gapType: 'flu_vaccine',
      description: 'Annual flu vaccine — critical for COPD patient',
      status: 'closed',
      priority: 'high',
      identifiedBy: USERS.nurse,
      closedAt: new Date('2024-10-05'),
      closedBy: USERS.nurse,
      notes: 'Flu vaccine administered 2024-10-05.',
    },
  })

  const emilyGap1 = await prisma.careGap.upsert({
    where: { id: 'gap-emily-mammogram' },
    update: {},
    create: {
      id: 'gap-emily-mammogram',
      contactId: emily.id,
      gapType: 'mammogram',
      description: 'Baseline mammogram — per USPSTF guidelines, recommended at age 40 (due 2035)',
      status: 'open',
      priority: 'low',
      identifiedBy: USERS.physician,
      targetDate: new Date('2035-11-08'),
      notes: 'Patient is 30 years old. Flag for automated outreach in 2035.',
    },
  })

  const emilyGap2 = await prisma.careGap.upsert({
    where: { id: 'gap-emily-wellness' },
    update: {},
    create: {
      id: 'gap-emily-wellness',
      contactId: emily.id,
      gapType: 'other',
      description: 'Annual wellness examination — next due Nov 2026',
      status: 'open',
      priority: 'low',
      identifiedBy: USERS.frontDesk,
      targetDate: new Date('2026-11-08'),
      notes: 'Annual wellness completed Nov 2025. Next due Nov 2026.',
    },
  })

  console.log('  Care gaps: 2 for Sarah, 3 for James (1 critical), 2 for Emily')

  // ── Tasks ──────────────────────────────────────────────────────────────────

  await prisma.task.createMany({
    skipDuplicates: true,
    data: [
      // Sarah
      {
        id: 'task-sarah-endo-booking',
        title: 'Schedule endocrinology referral appointment for Sarah Johnson',
        description:
          'Book Sarah for Dr. Alan Park at Springfield Endocrinology Associates (REF-20251015-0001). Patient prefers afternoon slots.',
        type: 'scheduling',
        status: 'completed',
        priority: 'normal',
        contactId: sarah.id,
        referralId: sarahReferral.id,
        assignedTo: USERS.frontDesk,
        dueDate: new Date('2025-10-25'),
        completedAt: new Date('2025-10-22T14:30:00Z'),
        completionNotes: 'Appointment confirmed for 2026-01-28 at 2:00 PM with Dr. Alan Park.',
        createdBy: USERS.nurseP,
        createdAt: new Date('2025-10-15T12:30:00Z'),
      },
      {
        id: 'task-sarah-dsme-week1',
        title: 'Diabetes education session — Week 1 (carb counting)',
        description: 'Conduct initial DSME session: carbohydrate counting, meal planning, glycaemic index overview.',
        type: 'follow_up',
        status: 'completed',
        priority: 'normal',
        contactId: sarah.id,
        carePlanId: sarahPlan.id,
        assignedTo: USERS.nurseP,
        dueDate: new Date('2025-10-22'),
        completedAt: new Date('2025-10-22T11:00:00Z'),
        completionNotes: 'Patient engaged well. Carb counting worksheet provided. Week 2 session booked.',
        createdBy: USERS.nurseP,
        createdAt: new Date('2025-10-15T13:00:00Z'),
      },
      {
        id: 'task-sarah-hba1c-q1',
        title: 'HbA1c lab order — Q1 2026 review',
        description: 'Order HbA1c lab for Sarah ahead of January follow-up appointment. Target < 7.0%.',
        type: 'assessment',
        status: 'pending',
        priority: 'normal',
        contactId: sarah.id,
        carePlanId: sarahPlan.id,
        careGapId: sarahGap1.id,
        assignedTo: USERS.nurseP,
        dueDate: new Date('2026-01-08'),
        createdBy: USERS.nurseP,
        createdAt: new Date('2025-10-15T13:00:00Z'),
      },
      // James
      {
        id: 'task-james-hba1c-call',
        title: 'Urgent outreach — HbA1c 8.9%, insulin adherence review',
        description:
          'Call James Williams re: critical HbA1c 8.9%. Review insulin glargine adherence, identify barriers. Set up medication delivery if needed.',
        type: 'call',
        status: 'completed',
        priority: 'high',
        contactId: james.id,
        carePlanId: jamesPlan.id,
        careGapId: jamesGap1.id,
        assignedTo: USERS.nurseP,
        dueDate: new Date('2025-10-14'),
        completedAt: new Date('2025-10-14T10:15:00Z'),
        completionNotes:
          'Spoke with James. Missing ~3 doses/week due to transportation barriers. Medication delivery service arranged. Next insulin titration review scheduled.',
        createdBy: USERS.physician,
        createdAt: new Date('2025-10-10T15:30:00Z'),
      },
      {
        id: 'task-james-cardio-auth',
        title: 'Chase Medicare authorisation — cardiology referral (REF-20251024-0003)',
        description:
          'Follow up with Medicare on auth AUTH-MCR-2025-8834 for Dr. Robert Torres cardiology referral. Confirm scheduling once authorised.',
        type: 'authorization',
        status: 'in_progress',
        priority: 'normal',
        contactId: james.id,
        referralId: jamesReferralCardio.id,
        assignedTo: USERS.frontDesk,
        dueDate: new Date('2026-01-15'),
        createdBy: USERS.nurseP,
        createdAt: new Date('2025-10-24T12:00:00Z'),
      },
      {
        id: 'task-james-care-plan-review',
        title: 'Quarterly MDT care plan review — James Williams',
        description:
          'MDT review of all 4 active conditions. Incorporate pulmonology (Dr. Chen) and cardiology (Dr. Torres) inputs. Adjust goals if needed.',
        type: 'care_plan_review',
        status: 'pending',
        priority: 'high',
        contactId: james.id,
        carePlanId: jamesPlan.id,
        assignedTo: USERS.physician,
        dueDate: new Date('2026-01-20'),
        createdBy: USERS.nurseP,
        createdAt: new Date('2025-10-24T12:30:00Z'),
      },
      // Emily
      {
        id: 'task-emily-wellness-2026',
        title: 'Annual wellness reminder — book Emily Chen for Nov 2026',
        description: 'Send Emily Chen an annual wellness reminder in Oct 2026 and book her appointment.',
        type: 'follow_up',
        status: 'pending',
        priority: 'low',
        contactId: emily.id,
        careGapId: emilyGap2.id,
        assignedTo: USERS.frontDesk,
        dueDate: new Date('2026-10-01'),
        createdBy: USERS.frontDesk,
        createdAt: new Date('2025-11-08T12:00:00Z'),
      },
    ],
  })

  console.log('  Tasks: 3 for Sarah, 3 for James, 1 for Emily')

  // ── Communications ─────────────────────────────────────────────────────────

  await prisma.communication.createMany({
    skipDuplicates: true,
    data: [
      // Sarah
      {
        id: 'comm-sarah-referral-call',
        contactId: sarah.id,
        type: 'phone_call',
        direction: 'outbound',
        subject: 'Endocrinology referral confirmation call',
        content:
          'Called Sarah to confirm referral details for Springfield Endocrinology Associates. Patient confirmed receipt of referral letter. Reminded of home BP logging twice daily.',
        status: 'delivered',
        sentBy: USERS.nurseP,
        sentAt: new Date('2025-10-17T10:00:00Z'),
      },
      {
        id: 'comm-sarah-care-plan-email',
        contactId: sarah.id,
        type: 'email',
        direction: 'outbound',
        subject: 'Your Care Plan Summary — Diabetes & Hypertension Management',
        content:
          'Dear Sarah, please find attached your care plan summary from your recent visit. Your next HbA1c lab is scheduled for January 2026 (target < 7.0%). Please continue home BP logging twice daily and log results in your patient portal.',
        status: 'delivered',
        sentBy: USERS.nurseP,
        sentAt: new Date('2025-10-18T09:00:00Z'),
      },
      {
        id: 'comm-sarah-portal-diet',
        contactId: sarah.id,
        type: 'portal_message',
        direction: 'inbound',
        subject: 'Portal message — diet question',
        content:
          'Patient asked about low-sodium alternatives to her usual snacks. Responded with approved snack list and directed to the ADA dietary resource sheet and recipe guide.',
        status: 'read',
        sentBy: USERS.nurseP,
        sentAt: new Date('2025-10-25T14:00:00Z'),
      },
      // James
      {
        id: 'comm-james-hba1c-call',
        contactId: james.id,
        type: 'phone_call',
        direction: 'outbound',
        subject: 'High-risk outreach — HbA1c 8.9% result',
        content:
          'Called James regarding critical HbA1c result of 8.9%. Identified transportation as primary barrier to insulin adherence. Medication delivery service arranged. Patient was cooperative and expressed relief at the support.',
        status: 'delivered',
        sentBy: USERS.nurseP,
        sentAt: new Date('2025-10-14T10:15:00Z'),
      },
      {
        id: 'comm-james-pulm-confirm',
        contactId: james.id,
        type: 'phone_call',
        direction: 'outbound',
        subject: 'Pulmonology appointment confirmation',
        content:
          'Confirmed James\'s pulmonology appointment for Nov 12, 2025 with Dr. Lisa Chen. Transport arranged via community partner. Reminded patient to bring all current inhalers to appointment.',
        status: 'delivered',
        sentBy: USERS.frontDesk,
        sentAt: new Date('2025-10-28T11:00:00Z'),
        referralId: jamesReferralPulm.id,
      },
      {
        id: 'comm-james-post-pulm-note',
        contactId: james.id,
        type: 'note',
        direction: 'outbound',
        subject: 'Post-pulmonology visit clinical summary',
        content:
          'Reviewed Dr. Chen\'s (Pulmonology) consultation notes. COPD Grade III (severe) confirmed. Medication switched to Trelegy Ellipta. Pulmonary rehab referral accepted by patient — commencing at Springfield Respiratory Rehabilitation Centre. Next spirometry in 3 months.',
        status: 'sent',
        sentBy: USERS.physician,
        sentAt: new Date('2025-11-13T14:00:00Z'),
        referralId: jamesReferralPulm.id,
      },
      {
        id: 'comm-james-med-delivery-sms',
        contactId: james.id,
        type: 'sms',
        direction: 'outbound',
        subject: 'Medication delivery reminder',
        content:
          'Hi James, your medication delivery is scheduled for tomorrow between 10am–12pm. Please ensure someone is home to receive it. Reply STOP to opt out of SMS reminders.',
        status: 'delivered',
        sentBy: USERS.nurse,
        sentAt: new Date('2025-11-20T09:00:00Z'),
      },
      // Emily
      {
        id: 'comm-emily-wellness-summary',
        contactId: emily.id,
        type: 'email',
        direction: 'outbound',
        subject: 'Your Annual Wellness Visit Summary',
        content:
          'Dear Emily, thank you for attending your annual wellness examination. You are in excellent health — all vitals and labs within normal range. Your next annual visit is due November 2026. We will send a reminder in October 2026.',
        status: 'delivered',
        sentBy: USERS.frontDesk,
        sentAt: new Date('2025-11-10T10:00:00Z'),
      },
    ],
  })

  console.log('  Communications: 3 for Sarah, 4 for James, 1 for Emily')

  // ── Campaigns ──────────────────────────────────────────────────────────────

  const diabetesCampaign = await prisma.campaign.upsert({
    where: { id: 'campaign-diabetes-q1-2026' },
    update: {},
    create: {
      id: 'campaign-diabetes-q1-2026',
      name: 'Diabetes Management Outreach — Q1 2026',
      description:
        'Targeted outreach to all active diabetic patients promoting HbA1c monitoring, medication adherence, and referral appointment uptake.',
      type: 'multi_channel',
      status: 'active',
      targetSegment: {
        conditions: ['E11.9', 'E11.65'],
        riskLevel: ['medium', 'high'],
        status: 'active',
      },
      subject: 'Your Diabetes Health Check — January 2026',
      content:
        'As part of your diabetes care programme, we are reaching out to schedule your HbA1c check and care plan review. Please contact us or book online.',
      scheduledAt: new Date('2026-01-05T09:00:00Z'),
      launchedAt: new Date('2026-01-05T09:00:00Z'),
      sentCount: 2,
      deliveredCount: 2,
      openedCount: 1,
      respondedCount: 1,
      createdBy: USERS.nurseP,
    },
  })

  const wellnessCampaign = await prisma.campaign.upsert({
    where: { id: 'campaign-wellness-2026' },
    update: {},
    create: {
      id: 'campaign-wellness-2026',
      name: 'Annual Wellness Reminder — 2026',
      description:
        'Annual reminder to all active low-risk patients encouraging preventive wellness visits and confirming up-to-date immunisations.',
      type: 'email',
      status: 'scheduled',
      targetSegment: { riskLevel: ['low'], status: 'active' },
      subject: 'Time to Book Your Annual Wellness Visit',
      content:
        'Preventive care keeps you healthy. Your annual wellness visit is due this autumn — click here to book your appointment at Springfield Medical Group.',
      scheduledAt: new Date('2026-10-01T09:00:00Z'),
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      respondedCount: 0,
      createdBy: USERS.frontDesk,
    },
  })

  await prisma.campaignMember.createMany({
    skipDuplicates: true,
    data: [
      {
        campaignId: diabetesCampaign.id,
        contactId: sarah.id,
        status: 'responded',
        sentAt: new Date('2026-01-05T09:00:00Z'),
        deliveredAt: new Date('2026-01-05T09:02:00Z'),
        openedAt: new Date('2026-01-05T10:15:00Z'),
        respondedAt: new Date('2026-01-06T09:00:00Z'),
      },
      {
        campaignId: diabetesCampaign.id,
        contactId: james.id,
        status: 'delivered',
        sentAt: new Date('2026-01-05T09:00:00Z'),
        deliveredAt: new Date('2026-01-05T09:02:00Z'),
      },
      {
        campaignId: wellnessCampaign.id,
        contactId: emily.id,
        status: 'pending',
      },
    ],
  })

  console.log('  Campaigns: Diabetes Q1 2026 (Sarah + James), Annual Wellness 2026 (Emily)')

  console.log('\nCRM seed complete.')
  console.log('  4 accounts, 3 contacts, 3 care teams, 2 care plans, 3 referrals')
  console.log('  7 care gaps, 7 tasks, 8 communications, 2 campaigns, 3 campaign members')
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
