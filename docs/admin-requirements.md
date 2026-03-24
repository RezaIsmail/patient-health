# Admin System — Product Requirements

**Status:** Draft v1.0
**Last updated:** 2026-03-20
**Product:** Patient Health Admin System
**References:** Salesforce Health Cloud, Epic (Healthy Planet + Cheers), Veeva Vault CRM, Facets/HealthEdge (health plan CAPs)

---

## 1. Product Overview

The Patient Health Admin System is the **control plane and system of record** for the entire Patient Health platform. It sits between the EMR (clinical system of record) and the CRM (relationship system of record) and acts as the canonical identity hub for program members, the central configuration layer for all three products, and the compliance and audit backbone of the platform.

### Why a dedicated Admin System

No competitor does the EMR–CRM bridge cleanly:
- **Epic** buries administration across Security, Healthy Planet, and Cheers modules — no unified admin experience
- **Salesforce Health Cloud** has powerful but complex configuration requiring certified admins — too heavyweight for mid-market
- **Veeva Vault** is life-sciences-first; its patient program administration is excellent but not EMR-native
- **Health plan CAPs (Facets, HealthEdge)** have the most mature member enrollment models but are not SaaS products

The Admin System fills this gap: a purpose-built, mid-market-accessible operations hub that gives healthcare organisations the control and visibility that enterprise systems make fragmented and complex.

### Core responsibilities

| Responsibility | Description |
|---|---|
| **Member identity hub** | The `Member` record is the canonical platform identity — linking an EMR patient to a CRM contact through a neutral admin record |
| **Program enrollment system of record** | Members are enrolled in one or more care programs; Admin owns the enrollment state, consent, and lifecycle for every member-program combination |
| **Platform RBAC** | Role definitions, permission scopes, and user-role assignments for all three products — managed centrally, consumed via the shared auth-service |
| **Organisation hierarchy** | The organisational structure (Org → Sites → Departments → Teams) that scopes data visibility and access across all products |
| **Cross-service audit log** | All write events from EMR, CRM, and Admin services flow here — single searchable compliance audit trail |
| **Configuration management** | Reference data, care program templates, communication templates, workflow rules — admin-owned, version-controlled |
| **Integration monitoring** | Health and status of all service-to-service integrations — EMR↔Admin, CRM↔Admin, external APIs |

### Positioning

The Admin System is an **internal-facing product** used by:
- Platform administrators (customer IT or ops teams)
- Programme managers configuring care programs
- Compliance officers reviewing audit trails
- Clinical operations leads managing teams and assignments

It is **not** a patient-facing or care-delivery tool. It is the operational backbone.

---

## 2. User Types

| User | Description | Primary Actions |
|---|---|---|
| **Platform Admin** | Full access. Manages users, roles, org hierarchy, and all configuration across all products. | User management, RBAC, org config, reference data, audit log |
| **Org Admin** | Manages users and configuration within their own organisation scope only. | User management (own org), programme config, member import |
| **Programme Manager** | Configures care programs, enrollment rules, SLAs, and templates. No user management access. | Programme config, member enrollment oversight, template management |
| **Compliance Officer** | Read-only access to audit logs, access reports, and consent records. No write access. | Audit log, access reports, HIPAA reports, consent history |
| **Operations Analyst** | Read-only access to dashboards, member registries, and integration status. | System health dashboard, member registry (read), analytics |

---

## 3. Feature Modules

---

### 3.1 Member Registry

**Description:** The `Member` record is the canonical identity entity of the platform — the neutral link between an EMR patient record and a CRM contact record. This is the Admin System's most critical differentiator: no competitor maintains a clean identity hub at this layer.

**The identity model:**
```
EMR Service          Admin Service            CRM Service
  patient_id  ←──── member.emrPatientId       member.crmContactId ────→ contact_id
  (clinical)         (canonical identity)      (relationship)
```

The Member record does **not** duplicate clinical data (owned by EMR) or relationship history (owned by CRM). It owns: platform identity, programme enrollment state, consent history, org/team assignment, and risk flags.

**Requirements:**
- `MEM-01` — Member record: `id`, `firstName`, `lastName`, `dateOfBirth`, `sex`, `phone`, `email`, `status`, `emrPatientId` (nullable FK to EMR), `crmContactId` (nullable FK to CRM), `organisationId`, `riskLevel`, `createdAt`, `updatedAt`
- `MEM-02` — Member status lifecycle: `pending_verification → active → suspended → inactive → deceased`
- `MEM-03` — EMR linkage: link/unlink a Member to an EMR patient record; on link, pull demographics sync from EMR service; display linked status with last-sync timestamp
- `MEM-04` — CRM linkage: link/unlink a Member to a CRM contact; CRM contact is notified of programme enrollment changes via internal event
- `MEM-05` — Programme enrollment summary: displayed in member header — active programmes, risk level, open care gaps count, last activity date
- `MEM-06` — Member search: by name, DOB, MRN, member ID, organisation, status, risk level, programme enrollment
- `MEM-07` — Bulk import: CSV upload with field mapping, validation, and duplicate detection (name + DOB + phone)
- `MEM-08` — Duplicate detection: flag potential duplicates at creation; deduplication workflow for admins with merge/unmerge (full audit trail)
- `MEM-09` — Member ID auto-generated: `MEM-YYYYMMDD-NNNN`
- `MEM-10` — Demographics sync: admin can trigger a manual sync of demographics from the linked EMR patient record
- `MEM-11` — Data provenance: every field shows source (`admin_entered | emr_synced | crm_synced | imported`) and last-updated timestamp

---

### 3.2 Programme Management

**Description:** Care programs are the structural backbone of the platform. A programme defines what care a member receives, the rules for eligibility, the lifecycle of enrollment, and the tasks and templates associated with that programme. Admin owns programme configuration.

**Requirements:**

**Programme Definition:**
- `PRG-01` — Programme CRUD: name, description, `programmeType` (`chronic_disease | preventive | behavioural_health | post_discharge | complex_care | other`), status (`draft | active | inactive`), owner (org), care plan template, SLA definitions
- `PRG-02` — Eligibility criteria: visual rule builder — conditions linked by AND/OR logic using member attributes: age range, diagnosis codes (ICD-10), risk level, org, prior programme history, SDoH flags
- `PRG-03` — Enrollment capacity: optional max enrolled members; waitlist behaviour configurable
- `PRG-04` — Co-enrollment rules: allow/deny simultaneous enrollment with specific other programmes; conflict resolution policy
- `PRG-05` — Programme version history: changes to programme definition are versioned with effective dates; members enrolled under prior versions are not retroactively affected unless explicitly migrated

**Enrollment Lifecycle (State Machine):**
- `PRG-06` — Enrollment states: `referred → screened → eligible → consented → enrolled → active → [graduated | disenrolled | transferred | declined]`
- `PRG-07` — Each state transition is configurable: allowed roles, required fields, required documents, automated side effects (create task, send notification, update CRM contact tag)
- `PRG-08` — Transition history: full log of every state change for every member-programme enrollment — actor, timestamp, reason code, notes
- `PRG-09` — Reason codes: admin-configurable coded reasons for disenrollment, decline, and transfer transitions
- `PRG-10` — Enrollment dashboard: counts per state across all active programmes; drill-down to individual records
- `PRG-11` — SLA tracking: configurable time-in-state SLA thresholds — amber/red indicators when SLA approaching or breached; alert rules

**Consent Management:**
- `PRG-12` — Consent record per member-programme: consent type (`verbal | written | electronic | implied`), channel, timestamp, collected by, document version, expiry date
- `PRG-13` — Consent withdrawal: members can withdraw consent; withdrawal recorded with date, reason, actor — does not delete prior consent records (immutable)
- `PRG-14` — Consent document management: upload and version consent form documents; link consent records to the form version used

---

### 3.3 Organisation Hierarchy

**Description:** The organisational structure that defines data visibility and access scoping across all three products. All RBAC scope conditions resolve against this hierarchy.

**Hierarchy:**
```
Organisation (top-level client entity)
  └── Sites (physical or virtual locations)
        └── Departments (clinical or administrative units within a site)
              └── Teams (working groups of users)
```

**Requirements:**
- `ORG-01` — Organisation CRUD: name, type (`health_system | clinic | payer | employer | community_org`), contact, status
- `ORG-02` — Site management: name, address, site type (`clinic | hospital | virtual | admin_only`), parent organisation, status
- `ORG-03` — Department management: name, department type (`clinical | administrative | operations | compliance`), parent site, head of department
- `ORG-04` — Team management: name, team type, parent department, team lead, members
- `ORG-05` — Hierarchy visualisation: tree view of the full org hierarchy with counts (users, members, programmes) at each node
- `ORG-06` — Member assignment: members are assigned to a site and optionally a team; drives data scoping in CRM and EMR views
- `ORG-07` — User assignment: users belong to one or more orgs/sites; their data visibility in all products is scoped accordingly

---

### 3.4 User Management

**Description:** Centralised user administration for all three products. Users are created and managed in Admin; auth is handled by the shared auth-service. Admin is the source of truth for user profiles, role assignments, and status.

**Requirements:**
- `USR-01` — User CRUD: first name, last name, email, phone, job title, user type, status (`active | suspended | deactivated`), org/site assignment
- `USR-02` — Product access: per-user flag for which products are accessible (EMR, CRM, Admin) — maps to auth-service product scopes
- `USR-03` — Role assignment: assign one or more roles to a user; roles are product-scoped; changes take effect on next token refresh
- `USR-04` — MFA management: view MFA status per user; admin can reset MFA for a user (requires re-enrolment on next login)
- `USR-05` — Password policy: org-level configurable: minimum length, complexity, expiry (days), lockout threshold (failed attempts)
- `USR-06` — Session management: view active sessions per user; admin can terminate all sessions (force logout)
- `USR-07` — Bulk user operations: bulk invite via CSV, bulk role assignment, bulk deactivation
- `USR-08` — User import: CSV import with field mapping; sends email invitation on import
- `USR-09` — User activity summary: last login timestamp, last activity, products accessed in last 30 days
- `USR-10` — Delegated admin: Org Admins can manage users within their own org scope; cannot elevate permissions beyond their own
- `USR-11` — Temporal permissions: time-limited role grants with automatic expiry (e.g. covering provider access for 14 days)

---

### 3.5 RBAC Configuration

**Description:** Role-based access control with resource-based permission scopes. Roles are defined in Admin and consumed by all three products via the auth-service JWT claims.

**Permission model:**
```
Role → set of Permissions
Permission: { resource_type, action, scope }
  resource_type: Patient | CareRecord | Referral | Task | Report | ...
  action: read | write | delete | export | admin
  scope: own_records | own_team | own_site | own_org | platform_wide
```

**Requirements:**
- `RBC-01` — Role CRUD: name, description, product scope (EMR | CRM | Admin | platform), permission set, status
- `RBC-02` — Permission matrix UI: visualise which roles have which permissions across all resource types — rows = roles, columns = resource types, cells = action + scope
- `RBC-03` — Built-in roles (non-deletable): `Platform Admin`, `Org Admin`, `EMR Clinician`, `EMR Read-Only`, `CRM Care Coordinator`, `CRM Case Manager`, `CRM Analyst`, `Admin Programme Manager`, `Admin Compliance Officer`
- `RBC-04` — Custom role creation: admins can create custom roles for their organisation; custom roles cannot exceed the permissions of the creating admin's own role (no privilege escalation)
- `RBC-05` — Role cloning: clone an existing role as the basis for a new custom role
- `RBC-06` — Scope conditions enforced at API level: the RBAC engine in each service resolves scope (`own_records` etc.) against the org hierarchy at query time
- `RBC-07` — Role assignment audit: every role grant and revocation is logged — actor, target user, role, timestamp, reason
- `RBC-08` — Effective permissions preview: for any user, show their resolved effective permissions (merged from all assigned roles) — for troubleshooting access issues

---

### 3.6 Audit Log

**Description:** A centralised, immutable, cross-service audit trail covering all write events across EMR, CRM, and Admin. This is the compliance backbone of the platform — required for HIPAA and essential for incident investigation.

**Architecture:**
- Each service publishes audit events to a shared event bus on every sensitive write
- Admin Service consumes these events and writes them to an append-only audit log store
- The audit log is never modified or deleted through any application path; retention enforced at infrastructure level

**Requirements:**
- `AUD-01` — Audit event schema: `{ event_id, timestamp, service (emr|crm|admin), entity_type, entity_id, action (create|update|delete|view), actor_id, actor_role, correlation_id, ip_address, field_changes[{ field, old_value, new_value }], reason_code, notes }`
- `AUD-02` — Change logs: captured for all writes to patient/member/contact records, care plans, referrals, programme enrollments, consents, role assignments, and configuration changes
- `AUD-03` — Access logs: PHI record views (not just writes) logged as `action: view` events — required for HIPAA Access Report
- `AUD-04` — Audit log viewer: searchable by entity type, entity ID, actor, action, service, date range, correlation ID; results paginated and exportable to CSV
- `AUD-05` — HIPAA Access Report: generate per-member report of every access event (views + writes) for that member's records across all services — required output for member data access requests
- `AUD-06` — Reason codes: for sensitive transitions (programme disenrollment, consent withdrawal, record deletion requests), actor must select a coded reason — recorded in audit event
- `AUD-07` — Audit export: compliance officers can export filtered audit results as signed, timestamped CSV/PDF for regulatory submission
- `AUD-08` — Immutability guarantee: audit log API is append-only; no update or delete endpoints; database-level constraints enforce this
- `AUD-09` — Retention: audit records retained for minimum 7 years (configurable to 10 at org level)
- `AUD-10` — Real-time audit alerts: configurable alert rules — e.g. "alert if any user exports >500 records in 1 hour", "alert if a deactivated user's credentials are used" — delivered via email/webhook

---

### 3.7 Integration Monitoring

**Description:** A first-class operational dashboard for the health and status of all service-to-service integrations. This capability is a genuine gap in competitive platforms (Epic does not expose this to ops admins; Salesforce buries it in DevOps Center). Platform admins and operations analysts can see exactly what is happening at every integration boundary without opening a support ticket.

**Integrations monitored:**
- EMR Service ↔ Admin Service (member demographics sync, care gap events)
- CRM Service ↔ Admin Service (programme enrollment status changes, consent events)
- Auth Service (token issuance rate, failed auth events)
- External: email provider (SendGrid/SES), SMS provider (Twilio), FHIR endpoints (if connected)

**Requirements:**
- `INT-01` — Integration status dashboard: per-integration card showing: status (`healthy | degraded | down`), last successful sync timestamp, message throughput (last 1h), error rate (last 1h), P95 latency
- `INT-02` — Error feed: chronological feed of integration errors across all channels — event type, payload summary, error message, retry count, status (`pending_retry | dead_letter | resolved`)
- `INT-03` — Dead letter queue (DLQ) management: admin can view full payload of dead-lettered messages, manually re-queue for retry, or mark as resolved with notes
- `INT-04` — Manual sync trigger: admin can force a re-sync for a specific member (EMR demographics pull, CRM contact push) or a full batch re-sync for an integration
- `INT-05` — Integration credential management: view OAuth token status (active/expired), token expiry date, last rotation; admin can rotate credentials from the UI
- `INT-06` — Alert configuration: per-integration threshold alerts — "notify if error rate >5% in 15 minutes", "notify if sync latency P95 >2s" — delivered via email or webhook
- `INT-07` — Integration event log: searchable log of all integration events (success + failure) with full payload (PHI masked) — for debugging
- `INT-08` — Uptime history: 30-day uptime chart per integration — for SLA reporting to stakeholders

---

### 3.8 Reference Data Management

**Description:** Admin-managed lookup tables and reference datasets that drive dropdowns, validation rules, and clinical coding across all three products. Changes to reference data are versioned with effective dates.

**Requirements:**
- `REF-01` — Reference table management: CRUD on configurable tables — each table has: name, description, entries (`{ code, label, description, effectiveFrom, effectiveTo, active }`)
- `REF-02` — Built-in reference tables: Programme Types, Disenrollment Reason Codes, Task Categories, Document Types, Care Team Role Types, SDoH Flag Types, Risk Level Definitions, Consent Types, ICD-10 shortlists (admin-curated subset for the organisation's programmes)
- `REF-03` — Custom reference tables: admins can create new reference tables for organisation-specific codes without engineering work
- `REF-04` — Versioning: entries have effective-from/to dates; changing a label creates a new version, not an overwrite — historical records reference the version active at the time of their creation
- `REF-05` — Import/export: bulk upload via CSV with validation; export any table as CSV
- `REF-06` — Reference data propagation: reference table changes are pushed to all consuming services via internal event; services cache locally with TTL

---

### 3.9 Template Management

**Description:** Centralised management of all configurable templates used across the platform — communication templates (for CRM campaigns), care plan templates (for EMR and CRM), and document/form templates (for consent and intake).

**Requirements:**
- `TPL-01` — Template types: `communication` (email/SMS body for campaigns), `care_plan` (goal/intervention templates), `document` (consent forms, intake forms, programme agreements)
- `TPL-02` — Template CRUD: name, description, type, status (`draft | active | archived`), content body, variable tokens with validation
- `TPL-03` — Variable tokens: admin defines available tokens per template type (e.g. `{{member.firstName}}`, `{{programme.name}}`, `{{coordinator.name}}`); unresolved tokens flagged at template activation
- `TPL-04` — Approval workflow: `draft → submitted → approved → active`; only approved templates can be used in live campaigns or care plan creation
- `TPL-05` — Version history: every edit creates a new version; active version is pinned; templates in use cannot be deleted — only archived
- `TPL-06` — Preview: admin can preview a rendered template with sample data before approval
- `TPL-07` — Template assignment: templates are assigned to one or more programmes or orgs; a programme can have a default care plan template

---

### 3.10 System Configuration

**Description:** Platform-wide and org-level configuration settings. Separates operational configuration (owned by admins) from infrastructure configuration (owned by DevOps).

**Requirements:**
- `CFG-01` — Org-level settings: audit retention period, password policy, MFA requirement (enforced/optional), session timeout, default timezone, date format
- `CFG-02` — Notification settings: configure system notification recipients — who receives integration alerts, audit alerts, and system health alerts
- `CFG-03` — Feature flags: per-org feature toggles for capabilities in preview — admin enables/disables without a code deployment
- `CFG-04` — Data retention policies: configurable retention periods per data type within regulatory minimums — applied via scheduled purge jobs
- `CFG-05` — Branding: org-level logo and primary colour for the platform UI — applied to email templates and login screen
- `CFG-06` — Configuration export: export full org configuration snapshot as JSON for backup or environment promotion

---

### 3.11 Analytics & Dashboards

**Description:** Operational and compliance dashboards giving platform admins and programme managers real-time visibility into the health and performance of the platform.

**Operations Dashboard (default landing):**
- `ANL-01` — Member registry summary: total active members, members by programme, members by risk level, new members this week
- `ANL-02` — Programme enrollment funnel: members in each enrollment state across all active programmes — drill-down to individual records
- `ANL-03` — System health: integration status overview (all-green / degraded / down), error rate last 24h, failed auth attempts last 24h
- `ANL-04` — User activity: active users today, logins this week, inactive users (no login in 30 days)
- `ANL-05` — Audit activity: write events today vs. 7-day average; flagged audit alerts

**Programme Performance Dashboard:**
- `ANL-06` — Enrollment velocity: members enrolled per week by programme
- `ANL-07` — SLA breach rate: % of enrollment transitions that breached their SLA threshold by programme
- `ANL-08` — Consent rate: consent obtained / consents requested per programme
- `ANL-09` — Disenrollment reasons: breakdown of disenrollment reason codes by programme — identifies programme quality issues

**Compliance Dashboard:**
- `ANL-10` — Audit log volume: write events per day per service — spike detection for unusual activity
- `ANL-11` — Access report requests: count of HIPAA Access Reports generated, pending, and overdue
- `ANL-12` — Role assignment changes: role grants and revocations per day — flags privilege escalation patterns
- `ANL-13` — DLQ depth: dead letter queue depth per integration — integration health signal

---

## 4. User Journeys

### 4.1 Onboard a New Member

1. Admin receives referral or CSV import of new members
2. Creates member record (or imports bulk) — system checks for duplicates on name + DOB + phone
3. Links member to EMR patient record (`emrPatientId`) — demographics sync pulls from EMR
4. Links member to CRM contact record (`crmContactId`) — CRM contact now receives programme enrollment updates
5. Assigns member to org/site/team
6. Identifies applicable programme(s) via eligibility rule evaluation
7. Creates programme enrollment in `referred` state
8. CRM is notified — care coordinator assigned; contact tag updated to reflect programme enrollment

### 4.2 Enrol a Member in a Programme

1. Programme Manager or Care Coordinator opens a member's Admin profile
2. Navigates to Programme Enrollments → New Enrollment
3. Selects programme — system evaluates eligibility rules and shows pass/fail with reasons
4. If eligible: creates enrollment record in `screened` state; assigns coordinator
5. Coordinator contacts member — records consent (type, channel, date, form version)
6. Consent captured → enrollment moves to `consented` → then `enrolled` → `active`
7. System side effects: task created in CRM, care plan template pre-populated in EMR, CRM contact tagged
8. Enrollment appears on audit log; consent record stored immutably

### 4.3 Investigate an Integration Failure

1. Platform Admin receives alert: "EMR demographics sync error rate >10% in last 15 minutes"
2. Opens Integration Monitoring dashboard → EMR↔Admin card shows `degraded`
3. Clicks through to error feed — sees 23 failed sync events with error `connection_timeout`
4. Checks integration credential status — OAuth token expired
5. Rotates OAuth token from the credential management panel
6. Manually triggers re-sync for the 23 failed members
7. Error rate drops to 0%; integration card returns to `healthy`
8. All actions logged in audit log with correlation IDs

### 4.4 Respond to a HIPAA Access Report Request

1. Compliance Officer receives a member data access request (statutory 30-day deadline)
2. Opens Admin → Audit Log → HIPAA Access Report
3. Searches by Member ID or name — system compiles all access events (reads + writes) across all services for that member
4. Reviews report — can see every user who accessed the member's record, what they accessed, and when
5. Exports signed PDF report
6. Access Report generation is itself logged in the audit trail

---

## 5. Data Model (Core Entities)

### 5.1 Member
```
id, memberNumber, firstName, lastName, dateOfBirth, sex,
phone, email, status, riskLevel,
emrPatientId (FK to EMR service), crmContactId (FK to CRM service),
organisationId, siteId, teamId,
createdAt, updatedAt
```

### 5.2 Organisation
```
id, name, type, phone, email, website, address{},
status, parentOrgId, createdAt, updatedAt
```

### 5.3 Site
```
id, name, siteType, address{}, organisationId, status, createdAt, updatedAt
```

### 5.4 Department
```
id, name, departmentType, siteId, headUserId, createdAt, updatedAt
```

### 5.5 Team
```
id, name, teamType, departmentId, leadUserId, memberUserIds[],
createdAt, updatedAt
```

### 5.6 Programme
```
id, name, description, programmeType, status, organisationId,
eligibilityCriteria (JSON rule tree), enrollmentCapacity,
coEnrollmentPolicy (JSON), carePlanTemplateId,
slaDefinitions (JSON), versionNumber, effectiveFrom, effectiveTo,
createdAt, updatedAt
```

### 5.7 ProgrammeEnrollment
```
id, memberId, programmeId, state, assignedUserId,
enrolledAt, graduatedAt, disenrolledAt, transferredAt,
reasonCode, notes, consentId,
createdAt, updatedAt
```

### 5.8 EnrollmentTransition
```
id, enrollmentId, fromState, toState, actorId, actorRole,
reasonCode, notes, timestamp
```

### 5.9 Consent
```
id, memberId, programmeId, consentType, channel,
collectedBy, collectedAt, documentId, documentVersion,
status (active | withdrawn), withdrawnAt, withdrawnBy, withdrawalReason,
createdAt
```

### 5.10 AuditEvent
```
id, eventId, timestamp, service, entityType, entityId,
action, actorId, actorRole, correlationId, ipAddress,
fieldChanges (JSON array), reasonCode, notes
```

### 5.11 Role
```
id, name, description, productScope, isBuiltIn, organisationId,
permissions (JSON array of {resource_type, action, scope}),
createdAt, updatedAt
```

### 5.12 UserRole
```
id, userId, roleId, grantedBy, grantedAt, expiresAt, revokedAt, revokedBy
```

---

## 6. Integration Architecture

### EMR ↔ Admin
- `ADM-INT-01` — On member EMR link: Admin calls EMR service to pull demographic snapshot (name, DOB, sex, phone, contact) — stored on member record with `emr_synced` provenance
- `ADM-INT-02` — EMR publishes care gap events via internal event bus → Admin updates member risk flags
- `ADM-INT-03` — Admin publishes care team assignment events → EMR associates care plan with assigned coordinator

### CRM ↔ Admin
- `ADM-INT-04` — On programme enrollment state change: Admin publishes event → CRM updates contact programme tags and segment membership
- `ADM-INT-05` — On consent recorded: Admin publishes event → CRM logs communication event on contact timeline
- `ADM-INT-06` — CRM outreach outcomes (consent via phone) → CRM calls Admin consent API to record verbal consent

### Auth Service ↔ Admin
- `ADM-INT-07` — Admin is the source of truth for users, roles, and permissions; auth-service reads from Admin to populate JWT claims
- `ADM-INT-08` — Auth service publishes login and session events → Admin audit log

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | HIPAA-aligned; audit log immutable and append-only; no PII in logs (mask before logging); all PHI access logged (reads + writes); secrets via environment variables; RBAC enforced at API layer with scope resolution |
| **Performance** | API responses < 200ms p95; audit log search < 1s for date-range queries with indexed fields; member search < 300ms |
| **Reliability** | 99.9% uptime; health and readiness endpoints; audit event delivery at-least-once via durable message queue; graceful degradation if EMR/CRM unavailable |
| **Observability** | Structured JSON logging with correlationId; all API calls logged with duration + status; Sentry error tracking; integration health metrics exposed via `/metrics` endpoint |
| **Scalability** | Stateless service; horizontal scaling; audit log partitioned by month; DB indexes on all searchable audit fields |
| **Compliance** | HIPAA BAA-ready; 7-year minimum audit retention; Access Report generation within 30 days of request; consent records immutable |

---

## 8. RBAC Matrix

| Action | Platform Admin | Org Admin | Programme Manager | Compliance Officer | Operations Analyst |
|---|---|---|---|---|---|
| Manage users | All orgs | Own org | No | No | No |
| Configure RBAC | Yes | Own org only | No | No | No |
| Manage members | Yes | Own org | Own programmes | No (read-only) | No (read-only) |
| Manage programmes | Yes | Own org | Own programmes | No | No |
| View audit log | Yes | Own org | No | Yes (all) | Read-only |
| Export audit log | Yes | Own org | No | Yes | No |
| Integration monitoring | Yes | No | No | No | Read-only |
| Reference data | Yes | Own org | No | No | No |
| Template management | Yes | Own org | Own programmes | No | No |
| System configuration | Yes | Own org | No | No | No |
| View dashboards | Yes | Own org | Own programmes | Compliance dash | All dashboards |

---

## 9. Phased Delivery

### Phase 1 — Foundation (Weeks 1–5)
- Member registry (CRUD, search, EMR/CRM linkage)
- Organisation hierarchy (Org → Site → Department → Team)
- User management (CRUD, product access, status)
- RBAC configuration (role management, permission matrix, user-role assignment)
- Authentication (shared auth-service integration)
- Basic audit log (capture + viewer)
- Operations dashboard (member counts, system status)

### Phase 2 — Programme & Compliance (Weeks 6–10)
- Programme management (programme CRUD, eligibility rules, enrollment lifecycle state machine)
- Programme enrollment management (full state machine UI, transition history)
- Consent management (consent records, withdrawal, document versioning)
- Full cross-service audit log (EMR + CRM events flowing to Admin)
- HIPAA Access Report generation
- Integration monitoring dashboard
- Reference data management
- Template management

### Phase 3 — Advanced Operations (Weeks 11–16)
- Eligibility rules engine (visual rule builder for complex criteria)
- Workflow automation builder (no-code enrollment triggers, escalation rules)
- Advanced analytics (programme performance, compliance dashboards)
- Delegated administration (Org Admin scoping)
- Configuration export / environment promotion
- Audit alert rules (real-time anomaly detection)
- Feature flag management
