# CRM — Product Requirements

**Status:** Draft v1.0 — under review
**Last updated:** 2026-03-19
**Product:** Patient Health CRM
**References:** Salesforce Health Cloud, Veeva Vault CRM, HubSpot for Healthcare, Zoho CRM

---

## 1. Product Overview

The Patient Health CRM is a purpose-built healthcare relationship management platform targeting mid-market healthcare organisations (50–500 providers, 50K–500K patients or members). It is designed for care coordinators, case managers, and network relations teams who need a unified view of patient relationships, care coordination workflows, referral pipelines, and outreach campaigns.

The CRM positions between Salesforce Health Cloud (too expensive, too generic) and HubSpot (not clinical enough). Its differentiators are:

- **Care coordination-first** — not sales-first; the data model and workflows are built around care plans, care gaps, and referral management
- **FHIR-native** — clinical data aligned to HL7 FHIR R4; real-time EMR sync capability
- **360° contact profiles** — unified view merging clinical data (from EMR/EHR APIs) with relational data (referral history, outreach preferences, engagement metrics)
- **Predictive care gaps** — AI-driven identification of missing preventive services, medication adherence failures, and readmission risk
- **Affordable** — relative to Salesforce Health Cloud's enterprise licensing

The CRM is one of three products in the Patient Health suite. It communicates with the shared Auth Service for identity and access control.

---

## 2. User Types

| User | Description | Primary Actions |
|---|---|---|
| **Care Coordinator** | Primary CRM user. Manages caseloads, creates and tracks care plans, processes referrals, and assigns tasks. | 360° contact views, care plan management, referral intake, task assignment, outreach |
| **Case Manager** | Senior clinical role. Supervises care coordinators, reviews complex cases, approves care plan changes. | Review care plans, approve escalations, manage high-risk contacts, analytics review |
| **Network Relations Manager** | Manages provider and partner organisations. Tracks referral sources and partner relationships. | Account management, referral source analytics, partner outreach campaigns |
| **Marketing / Outreach** | Manages campaigns and patient engagement outreach. | Campaign builder, journey management, outreach analytics |
| **CRM Administrator** | System configuration, user management, RBAC, audit review. | User management, workflow configuration, data import/export, audit logs |
| **Read-only / Analyst** | Reports and dashboards only. No write access. | Analytics, exports, dashboards |

---

## 3. Feature Modules

### 3.1 Contact Management (360° Profile)

**Description:** The central entity of the CRM. A Contact is any person tracked in the system — a patient, lead, prospect, or plan member. The 360° profile is the primary workspace for care coordinators.

**Requirements:**
- `CON-01` — Capture and store core demographics: legal name, preferred name, date of birth, biological sex, gender identity, pronouns, address, phone, email, language preference
- `CON-02` — Contact status lifecycle: `lead → prospect → active → inactive → deceased`
- `CON-03` — Source tracking: where the contact originated (referral, self-referral, web form, partner, import)
- `CON-04` — Risk stratification: `low | medium | high | critical` — displayed prominently in the profile header
- `CON-05` — Social Determinants of Health (SDoH) flags: housing instability, food insecurity, transportation barriers, social isolation — inform care prioritisation
- `CON-06` — Assignment: contacts are assigned to a care coordinator; reassignment tracked in audit trail
- `CON-07` — Account linkage: contacts belong to one or more accounts (e.g. a patient belongs to a health plan and an employer)
- `CON-08` — EMR linkage: optional `emrPatientId` field links the CRM contact to their EMR record; syncs clinical summary (conditions, medications, allergies) via read-only FHIR API
- `CON-09` — Duplicate detection: flag potential duplicates at creation time based on name + DOB + phone; deduplicate workflow for administrators
- `CON-10` — Contact merge / unmerge with full audit trail
- `CON-11` — Searchable contact list with filters: status, risk level, assigned coordinator, account, care gap status, last contact date
- `CON-12` — Bulk import via CSV with field mapping and validation
- `CON-13` — Photo / avatar support

**360° Profile Sections:**
- Header: Name, DOB, MRN (if EMR-linked), risk badge, assigned coordinator, SDoH flags, quick action buttons
- Summary tab: demographics, insurance, active conditions (from EMR), active medications, care gaps count
- Care Plans tab: active and historical care plans
- Referrals tab: referral pipeline for this contact
- Tasks tab: open and completed tasks
- Communications tab: full interaction history (calls, emails, SMS, notes)
- Timeline tab: chronological activity stream across all record types

---

### 3.2 Account Management

**Description:** Organisations that contacts belong to or are referred from/to. Accounts represent health systems, clinics, payers, employers, and community organisations.

**Requirements:**
- `ACC-01` — Account types: `health_system | clinic | payer | employer | community_org | other`
- `ACC-02` — Account hierarchy: parent/child relationships (e.g. a clinic belongs to a health system)
- `ACC-03` — Key metrics per account: referral volume, referral conversion rate, active members/patients, last interaction date
- `ACC-04` — Contact roster: list of contacts associated with this account
- `ACC-05` — Account-level tasks and communications log
- `ACC-06` — Contract / agreement tracking (status, renewal date, notes) for partner accounts
- `ACC-07` — Searchable account list with filters: type, status, region

---

### 3.3 Care Plan Management

**Description:** Structured care coordination plans linked to a contact. The care plan is the clinical backbone of the CRM — analogous to Salesforce Health Cloud's Care Program module but designed for day-to-day use by care coordinators.

**Requirements:**
- `CPN-01` — Care plan CRUD: title, description, status (`draft | active | completed | cancelled`), start/end dates, assigned coordinator
- `CPN-02` — Problems list: health problems addressed by this care plan (coded SNOMED/ICD-10)
- `CPN-03` — Goals: measurable outcomes for each problem — description, target date, status (`in_progress | achieved | not_achieved | cancelled`), achieved date
- `CPN-04` — Interventions: actions to achieve goals — description, type (education, referral, medication adjustment, behavioural), frequency, assigned team member, status
- `CPN-05` — Care plan templates: pre-built templates for common conditions (CHF, diabetes, COPD, post-discharge, behavioural health) — coordinator selects template then customises
- `CPN-06` — Care team assignment per care plan: which team members are responsible
- `CPN-07` — Progress notes: free-text notes attached to a care plan with timestamp and author
- `CPN-08` — Review cadence: scheduled review dates with task auto-generation
- `CPN-09` — Care plan history: version history and change audit trail
- `CPN-10` — Explicit confirmation required for all care plan changes that affect clinical data (medication adjustments, goal changes)

---

### 3.4 Care Team Management

**Description:** Multi-disciplinary care teams assigned to contacts and care plans.

**Requirements:**
- `CTM-01` — Care teams are associated with a contact (not a care plan) — a contact has one active care team
- `CTM-02` — Team member roles: `care_coordinator | physician | nurse | social_worker | pharmacist | behavioural_health | other`
- `CTM-03` — Primary flag: one team member designated as primary contact for the patient
- `CTM-04` — Team membership history: join and leave dates tracked
- `CTM-05` — Team-level task assignment: tasks can be assigned to a team (any member picks up) or to a specific member
- `CTM-06` — Internal messaging / handoff notes between team members on a contact (logged to communications)

---

### 3.5 Referral Pipeline

**Description:** End-to-end referral lifecycle management — from intake to completion. The referral pipeline is the CRM's primary pipeline view, analogous to a sales pipeline in a standard CRM but purpose-built for healthcare referrals.

**Requirements:**
- `REF-01` — Referral types: `inbound` (referral received from external provider) | `outbound` (referral sent to specialist or service)
- `REF-02` — Pipeline stages: `received → reviewing → authorized → scheduled → completed | declined | cancelled`
- `REF-03` — Priority: `routine | urgent | emergent` — with visual differentiation in the pipeline view
- `REF-04` — Key fields: referring provider, referring organisation, receiving provider, receiving organisation, reason code (ICD-10/SNOMED), reason description, authorisation number, due date
- `REF-05` — Kanban board view: drag-and-drop referrals between stages; column-level counts and SLA breach indicators
- `REF-06` — List view with sort/filter: by stage, priority, date, assignee, organisation
- `REF-07` — SLA tracking: age of referral in each stage; configurable SLA thresholds with visual indicators (green → amber → red)
- `REF-08` — Prior authorisation workflow: attach auth number, track auth status, expiry date
- `REF-09` — Referral-linked tasks: tasks auto-generated at key stages (e.g. "Schedule appointment" when referral moves to `authorized`)
- `REF-10` — Outcome tracking: completed referrals capture outcome (appointment kept, no-show, cancelled by patient, transferred)
- `REF-11` — Referral source analytics: conversion rates by referring organisation and provider
- `REF-12` — Referral number auto-generated: `REF-YYYYMMDD-NNNN`

---

### 3.6 Care Gap Management

**Description:** Proactive identification and closure of gaps in preventive and chronic care. Analogous to Salesforce Health Cloud's Care Gaps feature.

**Requirements:**
- `GAP-01` — Care gap types: configurable list (mammogram overdue, colorectal screening, HbA1c monitoring, flu vaccination, blood pressure check, medication refill, behavioural health assessment, post-discharge follow-up)
- `GAP-02` — Gap status: `open | in_progress | closed | declined`
- `GAP-03` — Gap identification: care coordinators can manually flag gaps; future: automated identification from EMR data
- `GAP-04` — Priority: `low | medium | high | critical` — based on clinical significance and time overdue
- `GAP-05` — Gap closure workflow: coordinator marks gap as `in_progress` (with assigned task) then `closed` (with closure reason and date)
- `GAP-06` — Decline tracking: if patient declines an intervention, recorded with reason
- `GAP-07` — Contact-level gap summary: displayed in the contact header and summary tab
- `GAP-08` — Population-level gap analytics: how many contacts have open gaps by type; gap closure rates by coordinator
- `GAP-09` — Gap-linked tasks and campaigns: a gap can trigger a task or enrol the contact in an outreach campaign

---

### 3.7 Task Management

**Description:** Actionable items assigned to care team members. Tasks are the operating system of the CRM — they link contacts, referrals, care plans, and care gaps to specific people and due dates.

**Requirements:**
- `TSK-01` — Task types: `call | email | follow_up | assessment | authorization | scheduling | care_plan_review | other`
- `TSK-02` — Task status: `pending | in_progress | completed | cancelled`
- `TSK-03` — Priority: `low | normal | high | critical`
- `TSK-04` — Linkage: tasks can be linked to a contact, a referral, a care plan, or a care gap (or multiple)
- `TSK-05` — Assignment: to a specific user or to a care team
- `TSK-06` — Due date with overdue indicator
- `TSK-07` — Completion notes: required when marking a task complete
- `TSK-08` — My tasks view: filter to tasks assigned to the current user
- `TSK-09` — Team tasks view: filter by care team or coordinator
- `TSK-10` — Today / upcoming / overdue grouping in the list view
- `TSK-11` — Task creation from referral stage transitions (automated) and manually from any context (contact, care plan, gap)

---

### 3.8 Outreach Campaigns

**Description:** Multi-channel patient outreach campaigns. Think of this as a simplified Salesforce Marketing Cloud purpose-built for healthcare — email, SMS, and care portal messaging with HIPAA-compliant delivery and audit logging.

**Requirements:**
- `CAM-01` — Campaign types: `email | sms | phone | multi_channel`
- `CAM-02` — Campaign status: `draft | scheduled | active | paused | completed | cancelled`
- `CAM-03` — Target segmentation: define a patient segment by criteria (status, risk level, conditions, care gaps, assigned coordinator, account, age range, SDoH flags)
- `CAM-04` — Campaign content: subject line, message body — supports personalisation tokens ({{firstName}}, {{coordinatorName}}, {{gapType}})
- `CAM-05` — Schedule: one-time at a specific date/time, or triggered by an event (care gap identified, referral received)
- `CAM-06` — Campaign member tracking: per-contact delivery status (`pending | sent | delivered | opened | clicked | responded | opted_out | failed`)
- `CAM-07` — Opt-out management: contacts who opt out are excluded from future campaigns of the same channel
- `CAM-08` — Campaign performance dashboard: delivery rate, open rate, response rate, opt-out rate per campaign
- `CAM-09` — HIPAA-compliant delivery: no PHI in unencrypted channels; link-based access to clinical content (portal links only, not inline PHI)
- `CAM-10` — Pre-built campaign templates: appointment reminder, medication adherence nudge, care gap closure, post-discharge follow-up, preventive care outreach, enrolment invitation
- `CAM-11` — Campaign approval workflow: draft → submitted for review → approved → scheduled/active (for organisations requiring sign-off)

---

### 3.9 Communications & Activity Log

**Description:** A unified log of all interactions with a contact, across all channels and all system events. The communications log is the chronological record of everything that has happened with a contact.

**Requirements:**
- `COM-01` — Communication types: `email | sms | phone_call | note | portal_message | system_event`
- `COM-02` — Direction: `inbound | outbound`
- `COM-03` — Log a manual communication: care coordinator records a call, note, or email manually
- `COM-04` — Automated logging: campaign sends, task completions, referral stage changes, care plan updates — all logged automatically as system events
- `COM-05` — Visibility: all communications visible to the full care team for the contact
- `COM-06` — Filtered views: filter by type, direction, date range, user
- `COM-07` — Full-text search within a contact's communications log
- `COM-08` — No PHI in logs: communications store metadata and content intent — not free-text clinical data
- `COM-09` — Audit trail: who logged what, when — immutable

---

### 3.10 Analytics & Dashboards

**Description:** Real-time operational and clinical performance dashboards. Every dashboard must have drill-down to the underlying records.

**Requirements:**

**Operations Dashboard (default landing page):**
- `ANL-01` — Open referrals by stage: count and SLA status per pipeline stage
- `ANL-02` — Tasks overdue: count by assignee
- `ANL-03` — Active contacts by risk level: breakdown of caseload by `low | medium | high | critical`
- `ANL-04` — Care gaps open: count by gap type
- `ANL-05` — Campaign performance summary: recent campaigns and their delivery / open rates
- `ANL-06` — My activity summary (for the logged-in coordinator): contacts touched this week, tasks completed, referrals processed

**Care Performance Analytics:**
- `ANL-07` — Care plan completion rates: % of active care plans with goals `achieved` vs `in_progress` vs `not_achieved`
- `ANL-08` — Care gap closure rate: gaps closed / gaps opened per week, by coordinator and gap type
- `ANL-09` — Referral conversion funnel: received → completed conversion rate, average days per stage
- `ANL-10` — Readmission risk distribution: contacts by risk score (future: from EMR integration)

**Coordinator Performance:**
- `ANL-11` — Contacts managed per coordinator: caseload sizing
- `ANL-12` — Referrals processed per coordinator per week
- `ANL-13` — Task completion rate per coordinator

**Referral Source Analytics:**
- `ANL-14` — Top referral sources by volume and conversion rate
- `ANL-15` — Referral trend over time (weekly/monthly)
- `ANL-16` — Time-to-authorisation and time-to-completion by referral type

---

## 4. User Journeys

### 4.1 Referral Intake (Care Coordinator)
1. Referral received (phone / fax / EHR notification / API)
2. Coordinator creates a new referral in CRM: searches for or creates the contact, enters referral details, assigns priority
3. Referral appears in the `received` column of the Kanban board
4. System auto-creates a "Review referral" task assigned to the coordinator
5. Coordinator reviews, verifies insurance eligibility, moves to `reviewing`
6. If auth required: coordinator records auth number, moves to `authorized` when approved
7. Coordinator or scheduler moves to `scheduled` when appointment is booked
8. Follow-up task auto-created for T+3 days post-appointment
9. Coordinator marks `completed` with outcome; referral source analytics updated

### 4.2 Care Plan Creation (Care Coordinator)
1. Coordinator opens a contact's 360° profile
2. Opens the Care Plans tab → New Care Plan
3. Selects a template (e.g. "CHF Management") or starts from scratch
4. Adds problems (ICD-10 coded), sets goals (with target dates), assigns interventions (with team member)
5. Activates the care plan — status moves from `draft` to `active`
6. System auto-creates tasks for each intervention with the specified frequency
7. Team members see their assigned tasks in the My Tasks view
8. Coordinator reviews progress at the scheduled review cadence; updates goal statuses

### 4.3 Care Gap Closure Campaign (Outreach)
1. Analytics shows 150 contacts with open mammogram gaps overdue > 12 months
2. Outreach user creates a campaign: selects segment (gap type = mammogram, status = active, age 40–74)
3. Selects template "Preventive Care Reminder", personalises subject line and message
4. Sends for approval → approved
5. Scheduled for next Monday 9 AM
6. Campaign runs: 150 SMS messages sent
7. Campaign dashboard updates in real time: delivered, opened, responded
8. Responders are automatically logged as inbound communications on their contact record
9. Care coordinator follows up with non-responders via phone task auto-created

---

## 5. Data Model (Core Entities)

### 5.1 Contact (FHIR: Patient)
```
id, firstName, lastName, preferredName, dateOfBirth, sex, genderIdentity,
phone, email, address{}, status, source, riskLevel, sdohFlags[],
assignedTo (userId), accountId, emrPatientId, photoUrl,
createdAt, updatedAt
```

### 5.2 Account (FHIR: Organization)
```
id, name, type, phone, email, website, address{},
parentAccountId, status, notes, createdAt, updatedAt
```

### 5.3 CarePlan (FHIR: CarePlan)
```
id, contactId, title, description, status, templateKey,
startDate, endDate, assignedTo (userId),
problems[], goals[], interventions[],
createdAt, updatedAt
```

### 5.4 Referral (FHIR: ServiceRequest)
```
id, referralNumber, contactId, type, stage, priority,
referringProviderId, referringOrgName, receivingProviderId, receivingOrgName,
reasonCode, reasonDisplay, authorizationNumber, dueDate,
outcome, assignedTo, createdBy, createdAt, updatedAt
```

### 5.5 Task (FHIR: Task)
```
id, title, description, type, status, priority,
contactId, referralId, carePlanId, careGapId,
assignedTo, dueDate, completedAt, completionNotes,
createdBy, createdAt, updatedAt
```

### 5.6 CareGap
```
id, contactId, gapType, description, status, priority,
identifiedAt, targetDate, closedAt, closedBy, declineReason, notes,
createdAt, updatedAt
```

### 5.7 Campaign
```
id, name, description, type, status,
targetSegment (JSON criteria), subject, content,
scheduledAt, launchedAt, completedAt,
createdBy, createdAt, updatedAt
```

### 5.8 Communication
```
id, contactId, type, direction, subject, content,
status, sentBy, sentAt,
referralId, taskId, campaignId,
createdAt
```

---

## 6. Integration Requirements

- `INT-01` — Auth Service (SSO): JWT access/refresh tokens from the shared auth-service; same user identity as EMR and Admin
- `INT-02` — EMR integration (read-only): CRM reads clinical summary for linked contacts from the EMR service via internal API — conditions, medications, allergies (FHIR format)
- `INT-03` — Webhook events: CRM emits events for key state changes (referral stage changed, care plan activated, contact risk level changed) to enable integration with external systems
- `INT-04` — FHIR R4 export: CRM exposes a FHIR R4-compatible API for contacts (Patient resource), care plans (CarePlan resource), referrals (ServiceRequest resource) for interoperability
- `INT-05` — CSV import/export: bulk import of contacts and accounts; export of any list view as CSV
- `INT-06` — Email delivery: integration with transactional email provider (SendGrid / SES) for campaign delivery
- `INT-07` — SMS delivery: integration with SMS provider (Twilio) for SMS campaigns

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | HIPAA-aligned; no PII in logs; audit log all PHI access and writes; role-based access with patient-level record access; secrets via environment variables |
| **Performance** | API responses < 200ms p95 (excluding analytics queries); contact search < 500ms; analytics queries < 2s with materialised views or caching |
| **Reliability** | 99.9% uptime SLA; health and readiness endpoints on all services; graceful degradation if EMR integration unavailable |
| **Observability** | Structured JSON logging with correlationId; error tracking (Sentry); all API requests logged with duration and status |
| **Scalability** | Stateless service design; horizontal scaling via Kubernetes; DB indexes reviewed for all common queries; pagination on all list endpoints |
| **Compliance** | HIPAA BAA-ready; audit trail immutable and append-only; no PHI in campaign delivery channels (link-based access only) |

---

## 8. RBAC Matrix

| Action | Care Coordinator | Case Manager | Network Relations | Marketing | Admin | Analyst |
|---|---|---|---|---|---|---|
| View contacts | Own assigned | All | All | All | All | All |
| Create/edit contacts | Yes | Yes | Yes (accounts only) | No | Yes | No |
| View care plans | Own assigned | All | No | No | All | All |
| Create/edit care plans | Yes | Yes | No | No | Yes | No |
| View referrals | Own assigned | All | All | No | All | All |
| Create/manage referrals | Yes | Yes | Yes | No | Yes | No |
| View tasks | Own assigned | All | All | No | All | No |
| Create/edit tasks | Yes | Yes | Yes | No | Yes | No |
| Create campaigns | No | No | Yes | Yes | Yes | No |
| Launch campaigns | No | Yes | Yes | Yes | Yes | No |
| View analytics | Own metrics | All | Referral analytics | Campaign analytics | All | All |
| User management | No | No | No | No | Yes | No |

---

## 9. Phased Delivery

### Phase 1 — MVP (Weeks 1–6)
- Contact management (list, 360° profile, CRUD)
- Care plan management (create, edit, problems/goals/interventions)
- Referral pipeline (Kanban board, stage management, tasks)
- Task management (create, assign, complete)
- Basic communications log
- Authentication (shared auth-service integration)
- Analytics dashboard (operational KPIs)

### Phase 2 — Core Features (Weeks 7–12)
- Account management
- Care team management
- Care gap identification and closure
- Campaign builder (email + SMS) with delivery integration
- EMR integration (read-only clinical summary for linked contacts)
- FHIR R4 API export

### Phase 3 — Advanced (Weeks 13–20)
- Predictive risk scoring (ML model — readmission risk, churn risk)
- Automated care gap identification from EMR data
- Campaign journey builder (multi-step, triggered workflows)
- Population health analytics (cohort analysis, geographic heatmaps)
- Webhook event streaming
- Mobile-optimised view for care coordinators on the go
