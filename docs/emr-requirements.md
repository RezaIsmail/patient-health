# EMR — Product Requirements

**Status:** Draft v1.0 — under review
**Last updated:** 2026-03-16
**Product:** Patient Health EMR
**References:** Epic, Cerner (Oracle Health), Meditech Expanse, Elation Health, athenahealth, eClinicalWorks

---

## 1. Product Overview

The Patient Health EMR is a cloud-native, FHIR-first electronic medical record system targeting ambulatory (outpatient) clinics and small-to-mid-sized health systems. It is designed for clinical users who are time-pressured and need low-friction documentation, and for patients who expect a consumer-grade self-service experience.

The EMR is one of three products in the Patient Health suite. It communicates with the shared Auth Service for identity and access control and exposes its data via FHIR R4 APIs for interoperability with labs, pharmacies, imaging systems, and third-party applications.

---

## 2. User Types

| User | Description | Primary Actions |
|---|---|---|
| **Physician / Provider** | MD, DO — primary clinical user | Document encounters, order labs/imaging/prescriptions, review results, manage problem list |
| **Advanced Practice Provider (APP)** | NP, PA — requires cosign workflow for certain actions | Same as physician; some orders/notes require supervising physician cosign |
| **Nurse / Medical Assistant (MA)** | Clinical support | Room patients, record vitals, reconcile medications, pre-visit intake, care coordination |
| **Front Desk / Scheduler** | Administrative | Schedule appointments, register patients, verify insurance, collect payments, manage referrals |
| **Billing / RCM Staff** | Revenue cycle | Review charges, validate coding, submit claims, manage denials, post payments |
| **Practice Administrator** | Operations and configuration | User management, RBAC, system configuration, reporting, audit log review |
| **Patient** | Self-service via portal | Schedule, view records, message care team, pay bills, request refills |

---

## 3. Feature Modules

### 3.1 Patient Registration & Demographics

**Description:** The system of record for patient identity. Every clinical action is anchored to a verified patient.

**Requirements:**
- `REG-01` — Capture and store core demographics: legal name, preferred name, date of birth, biological sex, gender identity, pronouns, address, phone, email, language preference
- `REG-02` — Emergency contact management (multiple contacts, relationship type)
- `REG-03` — Insurance information: primary, secondary, and tertiary coverage; subscriber info; group and member IDs
- `REG-04` — Real-time insurance eligibility verification at registration and automatically at T-24h before appointments (X12 270/271 via clearinghouse)
- `REG-05` — Master Patient Index (MPI) — duplicate detection at registration, identity reconciliation workflow for potential duplicates
- `REG-06` — Patient consent management: HIPAA Notice of Privacy Practices, treatment consent, research consent — stored with timestamp and staff signature
- `REG-07` — Online pre-registration via patient portal — patient completes their own demographics and insurance before arrival
- `REG-08` — Photo capture for patient identification
- `REG-09` — Guarantor management (for minors or dependent patients)
- `REG-10` — Patient merge / unmerge workflow with full audit trail

---

### 3.2 Scheduling & Appointment Management

**Description:** Multi-provider, multi-location scheduling with self-service patient booking and automated workflows.

**Requirements:**
- `SCH-01` — Provider calendar management: configurable schedule templates by day, time, appointment type, and location
- `SCH-02` — Appointment types with configurable duration, required resources (room, equipment), and pre-visit questionnaires
- `SCH-03` — Multi-location scheduling — a provider's availability managed across all sites
- `SCH-04` — Patient self-scheduling via portal with real-time slot availability
- `SCH-05` — Waitlist management — patient added to waitlist when no slots available; auto-notified when cancellation occurs
- `SCH-06` — Automated reminders: SMS and email at T-3 days and T-1 day; configurable per appointment type
- `SCH-07` — Pre-visit intake questionnaires — linked to appointment type; patient completes online before arrival
- `SCH-08` — Referral-linked scheduling — appointments can be created from a referral order; referral metadata attached
- `SCH-09` — Recurring appointment scheduling (e.g. weekly physical therapy, monthly chronic disease follow-up)
- `SCH-10` — Check-in workflow: front desk check-in and patient self-check-in via QR code or kiosk
- `SCH-11` — Track board / daily schedule view for clinical staff: patient name, appointment type, status (scheduled → arrived → roomed → with provider → checked out), wait times
- `SCH-12` — No-show and cancellation tracking; configurable no-show policy and automated recall messaging
- `SCH-13` — Block scheduling — providers can block time for admin, meetings, or out-of-office

---

### 3.3 Clinical Documentation

**Description:** The core clinical record for each patient encounter. Must be fast, structured, and generate high-quality notes with minimal effort.

**Requirements:**

**Chart structure**
- `DOC-01` — Problem list: active and historical problems coded in SNOMED CT; add, resolve, and history tracking with date and author
- `DOC-02` — Medication list with reconciliation workflow at each encounter
- `DOC-03` — Allergy list: drug and non-drug allergies, reaction type, severity (mild / moderate / severe / life-threatening)
- `DOC-04` — Vital signs flowsheet: BP, HR, RR, temperature, SpO2, height, weight, BMI — trended over time with graphing
- `DOC-05` — Medical, surgical, family, and social history — structured capture with coded entries and free text

**Encounter documentation**
- `DOC-06` — SOAP note structure: Chief Complaint, HPI, ROS, Physical Exam, Assessment (ICD-10 coded), Plan — configurable per specialty
- `DOC-07` — Specialty-specific note templates (e.g. OB/GYN, paediatrics, psychiatry, orthopaedics) — configurable and extensible
- `DOC-08` — Dot-phrase / SmartPhrase shortcuts — provider-defined text macros for common phrases and exam findings
- `DOC-09` — Voice dictation input on all text fields
- `DOC-10` — **Ambient AI documentation** — AI listens to provider-patient conversation and generates a draft SOAP note; provider reviews and signs (target: reduce documentation time by ≥40%)
- `DOC-11` — Note signing and cosign workflow — APPs (NP/PA) can complete notes that are routed to supervising physician for cosign
- `DOC-12` — Addendum workflow — signed notes can be amended via addendum only; original note is preserved; full audit trail
- `DOC-13` — After-visit summary generated automatically from signed note — delivered to patient portal and optionally printed
- `DOC-14` — Progress notes, follow-up notes, procedure notes, telephone encounter notes — all as distinct encounter types
- `DOC-15` — OpenNotes compliance — clinical notes visible to patients via portal within 24 hours of signing (US federal mandate)
- `DOC-16` — Inbound document management — faxes, referral letters, and external records attached to the patient chart with indexing

---

### 3.4 Orders (CPOE — Computerised Provider Order Entry)

**Description:** Centralised ordering for labs, imaging, referrals, procedures, and medications. Every order is tracked from placement to completion.

**Requirements:**
- `ORD-01` — Lab orders: internal and external reference lab (LabCorp, Quest, regional labs); orders transmitted via HL7 v2 ORM or FHIR ServiceRequest
- `ORD-02` — Imaging / radiology orders: X-ray, CT, MRI, ultrasound, nuclear medicine — transmitted to RIS/PACS
- `ORD-03` — Referral orders: specialty, urgency, and reason; generates referral letter; tracks referral status (sent → accepted → completed)
- `ORD-04` — Procedure orders: in-office procedures with associated charge capture
- `ORD-05` — Order sets — pre-configured groups of orders for common clinical scenarios (e.g. "Annual Wellness Visit", "Chest Pain Workup"); configurable per provider and department
- `ORD-06` — Preference lists — provider-specific frequently ordered items surfaced first
- `ORD-07` — Standing orders — protocol-driven orders that execute automatically based on clinical criteria (e.g. MA records vitals per standing order)
- `ORD-08` — Order status tracking — each order moves through states: placed → transmitted → resulted → reviewed → signed off
- `ORD-09` — Result notification — abnormal and critical results trigger inbox notification to ordering provider
- `ORD-10` — Pending / cosign queues — orders requiring countersignature or review are surfaced in a prioritised queue
- `ORD-11` — Order expiry and renewal — standing orders and refill orders have configurable expiry dates; renewal reminders sent

---

### 3.5 Medications & E-Prescribing

**Description:** Electronic prescribing including controlled substances, with drug safety checking and pharmacy network integration.

**Requirements:**
- `MED-01` — Electronic prescribing via Surescripts network — transmit prescriptions to any US retail pharmacy
- `MED-02` — Electronic Prescribing for Controlled Substances (EPCS) — DEA-compliant two-factor authentication for schedule II–V medications
- `MED-03` — Drug-drug interaction checking at time of prescribing — tiered severity (contraindicated / major / moderate / minor)
- `MED-04` — Drug-allergy interaction checking — fires alert if prescribed medication conflicts with documented allergy
- `MED-05` — Dose range checking — alerts if dose is outside clinically appropriate range for patient age and weight
- `MED-06` — Real-time pharmacy benefit check (RTPB) — show patient's out-of-pocket cost and formulary alternatives at time of prescribing
- `MED-07` — Medication history pull via Surescripts — pre-populate medication list from pharmacy fill history
- `MED-08` — Medication reconciliation workflow — structured comparison of current list vs. pulled history; provider reconciles at each encounter
- `MED-09` — Refill request management — patients request refills via portal; routed to provider inbox for approval or denial with messaging
- `MED-10` — Prescription renewal queue — manage bulk renewals for chronic condition medications
- `MED-11` — Specialty pharmacy routing — high-cost and specialty medications routed to appropriate specialty pharmacy
- `MED-12` — Medication list displayed on all clinical screens with last reconciliation date visible

---

### 3.6 Clinical Decision Support (CDS)

**Description:** Evidence-based alerts and guidance delivered at the point of care, without overwhelming clinicians with noise.

**Requirements:**
- `CDS-01` — Preventive care reminders — age- and sex-appropriate screenings and immunizations surfaced at visit (e.g. mammogram due, flu vaccine overdue)
- `CDS-02` — Chronic disease management reminders — HbA1c due for diabetic patients, BP check overdue for hypertensives
- `CDS-03` — Best Practice Advisories (BPAs) — triggered by patient data conditions (e.g. "Patient has CKD — avoid NSAIDs"); configurable and evidenced-based
- `CDS-04` — Risk score calculators embedded in workflow: PHQ-9 (depression), GAD-7 (anxiety), AUDIT-C (alcohol), ASCVD risk, Wells criteria — auto-scored from structured data when possible
- `CDS-05` — Alert fatigue management — tiered alert severity (hard stop / soft stop / advisory); suppression audit trail; low-value alerts disabled by default
- `CDS-06` — Duplicate order detection — warns before placing an order for a test already ordered or resulted recently
- `CDS-07` — CDS Hooks integration — FHIR-based CDS standard; allows third-party evidence sources to plug in alerts at defined workflow points
- `CDS-08` — Critical value notification — abnormal lab/imaging results that meet critical thresholds trigger immediate push notification to provider

---

### 3.7 Laboratory & Results Management

**Description:** Full lifecycle of lab orders — from requisition to result review to patient notification.

**Requirements:**
- `LAB-01` — Lab order transmission to reference labs via HL7 v2 ORM or FHIR ServiceRequest
- `LAB-02` — Result ingestion: HL7 v2 ORU and FHIR DiagnosticReport from external labs; results parsed and structured in patient chart
- `LAB-03` — Results flowsheet — lab values trended over time with graphing; abnormal values highlighted with reference ranges
- `LAB-04` — Critical value workflow — critical results trigger immediate notification; provider must acknowledge; acknowledgement logged
- `LAB-05` — Result routing — results routed to ordering provider; configurable to also copy covering provider or care team
- `LAB-06` — Provider result inbox — prioritised queue of unreviewed results; bulk review mode for high-volume practices
- `LAB-07` — Result release to patient portal — configurable delay (immediate on sign-off / 24-48h delay); results display with patient-friendly explanations alongside clinical values
- `LAB-08` — Microbiology results — culture and sensitivity results displayed in structured format with organism and antibiotic susceptibility
- `LAB-09` — Point-of-care (POC) device integration — results from in-office devices (glucometers, rapid strep, rapid flu) captured directly in chart
- `LAB-10` — External result import — manually attach external lab PDFs and index to patient chart with structured metadata

---

### 3.8 Imaging & Radiology

**Requirements:**
- `IMG-01` — Radiology order management: order type, urgency, clinical indication, relevant history — transmitted to RIS
- `IMG-02` — PACS integration — imaging studies viewable from within the EMR via embedded DICOM viewer or single-sign-on launch to PACS system
- `IMG-03` — Radiology report ingestion — structured and unstructured radiology reports ingested and attached to order in patient chart
- `IMG-04` — Follow-up recommendation tracking — if radiologist recommends follow-up imaging, this creates a trackable action item in the chart
- `IMG-05` — Result routing and inbox — same provider inbox model as lab results

---

### 3.9 Billing & Revenue Cycle Management (RCM)

**Description:** Tightly coupled to the clinical encounter — charges flow from documentation, not from separate data entry.

**Requirements:**
- `BIL-01` — Automated charge capture — diagnoses (ICD-10-CM) and procedures (CPT/HCPCS) from the signed encounter note generate charges automatically
- `BIL-02` — AI-assisted coding suggestions — system suggests appropriate CPT codes based on documented services; provider confirms
- `BIL-03` — Coding validation — check for missing codes, unbundling issues, and documentation requirements before claim generation
- `BIL-04` — Prior authorisation management — track PA requests by payer and service; status updates (submitted / approved / denied / pending); alert provider if auth expires
- `BIL-05` — Real-time eligibility verification (X12 270/271) — run at registration and before appointment
- `BIL-06` — Claim generation — CMS-1500 (professional) and UB-04 (institutional) formatted claims generated automatically from encounter data
- `BIL-07` — Clearinghouse submission — claims routed via integrated clearinghouse (Availity, Waystar, or equivalent); real-time claim status
- `BIL-08` — ERA / EFT — electronic remittance advice (X12 835) auto-posted to patient account; matched to outstanding claims
- `BIL-09` — Denial management — denied claims surfaced in a denial work queue with denial reason code; appeal workflow with document attachment
- `BIL-10` — Patient billing — patient statements generated post-insurance; online bill pay via portal; payment plan setup
- `BIL-11` — RCM reporting — A/R aging by payer, denial rate by payer and code, collection rate, days in A/R, first-pass acceptance rate

---

### 3.10 Population Health

**Description:** Tools to manage patient panels proactively, not just reactively at the point of care.

**Requirements:**
- `POP-01` — Patient registry — dynamic patient lists based on diagnoses, medications, age, or clinical criteria (e.g. "All Type 2 Diabetic patients with HbA1c > 8 in the last 6 months")
- `POP-02` — Care gap identification — surface overdue preventive care and chronic disease milestones at the patient and panel level
- `POP-03` — Risk stratification — assign patients to risk tiers (low / medium / high) based on diagnosis complexity, utilisation, and social determinants
- `POP-04` — Outreach campaigns — generate targeted patient lists and send automated outreach (SMS, email, portal message) for care gaps or recall
- `POP-05` — Quality measure tracking — HEDIS and CMS Merit-based (MIPS) measures tracked in real time; performance dashboard per provider and practice
- `POP-06` — Care management workflows — care plan creation, goal setting, and care coordinator assignment for high-risk patients
- `POP-07` — Transitions of care — flag patients discharged from hospital for timely follow-up; integrates with ADT feed from hospital systems

---

### 3.11 Patient Portal

**Description:** The patient-facing product. Mobile-first, consumer-grade experience. Epic MyChart is the reference standard.

**Requirements:**

**Health records access**
- `PAT-01` — View full medical record: problem list, medications, allergies, immunizations, procedures, vitals history
- `PAT-02` — Lab and imaging results — displayed with patient-friendly explanations alongside clinical values; abnormal values clearly flagged
- `PAT-03` — Clinical notes (OpenNotes) — all signed notes visible within 24 hours of signing
- `PAT-04` — Downloadable health summary in CCDA format; FHIR API access for third-party health apps (21st Century Cures compliance)

**Appointments**
- `PAT-05` — Online self-scheduling with real-time provider availability
- `PAT-06` — Appointment reminders (push notification, SMS, email)
- `PAT-07` — Pre-visit intake — complete demographic updates, insurance, and clinical questionnaires before arrival
- `PAT-08` — E-check-in from home — complete check-in process before arriving; reduces front desk friction
- `PAT-09` — After-visit summary — available in portal immediately after visit is checked out
- `PAT-10` — Telehealth video visit — integrated video consult launched directly from portal appointment

**Communication**
- `PAT-11` — Secure messaging to care team — threaded inbox; provider responds directly or delegates to care team
- `PAT-12` — Proxy access — parent managing minor child's record; adult caregiver managing elderly patient's record; configurable access levels
- `PAT-13` — Broadcast messages from practice — health alerts, policy updates, care gap outreach

**Medications**
- `PAT-14` — View current medication list
- `PAT-15` — Refill request — patient requests refill via portal; routes to provider inbox
- `PAT-16` — Pharmacy selection and management

**Billing**
- `PAT-17` — View and pay outstanding bills online
- `PAT-18` — Payment plan setup and management
- `PAT-19` — Pre-visit cost estimate (price transparency — US federal requirement)
- `PAT-20` — View explanation of benefits

**Advanced**
- `PAT-21` — Mobile app (iOS and Android) — biometric login (Face ID / Touch ID), push notifications for results and messages
- `PAT-22` — Wearable device sync — Apple Health, Google Health Connect; synced data (steps, heart rate, glucose) visible in chart and patient portal
- `PAT-23` — Remote patient monitoring — patient-submitted readings (BP, glucose, weight) flow into clinical flowsheet and trigger review workflow

---

### 3.12 Interoperability

**Description:** The EMR must be a participant in the broader health data ecosystem, not a silo.

**Requirements:**
- `INT-01` — FHIR R4 API — all patient data accessible via FHIR R4 endpoints; US Core Implementation Guide compliant; ONC 21st Century Cures Act certified
- `INT-02` — SMART on FHIR — third-party app launch from within EMR context; app store for ecosystem partners
- `INT-03` — HL7 v2 messaging — ADT (admit/discharge/transfer), ORU (results), ORM (orders), MDM (documents) — for legacy system integration
- `INT-04` — Direct messaging — Direct Trust protocol for care transition documents (CCDs) to and from external providers
- `INT-05` — Carequality and CommonWell — participation in national record-sharing frameworks; patient records retrievable from external organisations on demand
- `INT-06` — Lab integration — bidirectional HL7 v2 or FHIR with major reference labs (LabCorp, Quest); results auto-filed to chart
- `INT-07` — E-prescribing — Surescripts network integration (all retail pharmacies); EPCS compliant
- `INT-08` — Clearinghouse integration — X12 EDI for eligibility (270/271), claims (837P/I), and remittance (835)
- `INT-09` — PACS integration — IHE Radiology profiles; DICOM viewer launch from EMR
- `INT-10` — ADT feed subscription — receive real-time hospital ADT events for care transition management
- `INT-11` — Webhook support — outbound webhooks on key clinical events (patient registered, encounter completed, result received) for downstream system integration

---

### 3.13 Patient Chart (Longitudinal Record View)

**Description:** The single screen a clinician opens to understand a patient at a glance. Everything relevant in one place — no hunting across tabs. This is the most important screen in the EMR and must be immediately readable, not cluttered.

**Design principle:** Surface the most clinically relevant information first. Keep it scannable. One screen, no scrolling required for the essentials.

**Requirements:**
- `CHR-01` — Patient header always visible: name, date of birth, age, sex, MRN, photo, primary insurance, known allergies (highlighted in red if present)
- `CHR-02` — Active problems — concise list of current diagnoses; click to expand detail
- `CHR-03` — Current medications — name, dose, frequency; click to expand or reconcile
- `CHR-04` — Allergies — substance and reaction severity; prominently displayed
- `CHR-05` — Recent results — last 3 lab and imaging results with date and abnormal flag; click to view full results
- `CHR-06` — Upcoming and recent appointments — next scheduled visit; last visit date and provider
- `CHR-07` — Recent notes — last 3 encounter notes with date, type, and provider; click to read full note
- `CHR-08` — Vitals summary — most recent recorded vitals with date; trend indicator (↑↓) for BP and weight
- `CHR-09` — Immunisation status — overdue or upcoming vaccines flagged; full immunisation history accessible one click away
- `CHR-10` — Outstanding actions — any items requiring attention: unsigned orders, pending referrals, unreviewed results, care gaps — shown as a small badge count, not a wall of alerts
- `CHR-11` — The chart view must load in under 1.5 seconds regardless of how much historical data exists

---

### 3.14 Immunisation Records

**Description:** A complete, accurate immunisation history for every patient. Simple to record, easy to view, and interoperable with national/regional immunisation registries.

**Requirements:**
- `IMM-01` — Record administered vaccines: vaccine name, date given, lot number, route, site, administering provider
- `IMM-02` — Immunisation schedule — age-appropriate recommended vaccines surfaced automatically (CDC schedule for US); overdue vaccines clearly flagged
- `IMM-03` — Import immunisation history from external registry (IIS — Immunisation Information System) via HL7 v2 VXU or FHIR Immunization resource
- `IMM-04` — Submit administered vaccines to state/regional immunisation registry (bidirectional exchange)
- `IMM-05` — Patient-reported vaccine history — record vaccines administered elsewhere with a clear "patient-reported" label
- `IMM-06` — Vaccine contraindication checking — alert if a scheduled vaccine is contraindicated given the patient's allergies or conditions
- `IMM-07` — Printable immunisation record for patient (school, travel, employer use)
- `IMM-08` — Immunisation history visible in patient portal

---

### 3.15 Administration & Configuration

**Requirements:**
- `ADM-01` — User management — create, edit, deactivate users; RBAC with product-scoped roles and permission sets
- `ADM-02` — Provider credentialing data — NPI, DEA number, state licence, specialties — stored and used to validate prescribing permissions
- `ADM-03` — Location management — multiple clinic sites, each with its own schedule, resources, and billing information
- `ADM-04` — Audit log — append-only log of every read and write to patient data: actor, action, timestamp, patient, before/after state; searchable by admin
- `ADM-05` — System configuration — appointment types, note templates, order sets, CDS rule thresholds — configurable without code deployment
- `ADM-06` — Reporting and analytics — standard reports (encounters per day, provider productivity, RCM metrics, population health KPIs); custom report builder
- `ADM-07` — Downtime procedures — read-only mode and printed downtime reports available if system is unavailable
- `ADM-08` — Data export — full patient record export in CCDA and FHIR formats; practice-level data export for migration or analysis

---

## 4. Key User Journeys

### Journey 1 — Standard Ambulatory Visit (Physician + MA + Patient)

```
1. Pre-Visit
   Patient self-schedules via portal → receives automated SMS/email reminder →
   completes pre-visit intake form online (demographics, insurance, reason for visit) →
   insurance eligibility verified automatically at T-24h

2. Arrival
   Patient checks in via QR code on phone OR front desk confirms identity and collects co-pay →
   patient added to track board as "Arrived"

3. Rooming (MA)
   MA rooms patient → records vitals (BP, HR, temp, weight, SpO2) →
   reviews and reconciles medication list → documents chief complaint →
   completes applicable screening questionnaires (PHQ-9, AUDIT-C) →
   status updated to "Roomed"

4. Provider Encounter
   Provider opens chart → reviews: reason for visit, active problems, recent results, meds →
   speaks with patient while ambient AI drafts note in background →
   enters orders (labs, imaging, prescriptions) → CDS alerts checked →
   finalises ICD-10 diagnoses → reviews and signs AI-drafted note →
   status updated to "With Provider"

5. Check-Out
   Charges auto-captured from signed note → follow-up appointment scheduled →
   after-visit summary delivered to portal → claim auto-generated and queued

6. Post-Visit
   Lab results arrive → auto-filed to chart → provider inbox notification →
   provider reviews, signs off, adds patient-facing message →
   results released to patient portal with explanations →
   patient notified via push notification
```

---

### Journey 2 — New Patient Registration

```
Patient (or staff) initiates registration →
Duplicate check runs against MPI →
Demographics captured (legal name, DOB, address, contact, insurance) →
Real-time eligibility check confirms active coverage and co-pay →
HIPAA consent presented and signed (e-signature) →
Patient portal invite sent via email / SMS →
Patient activates portal account and completes pre-registration →
Patient appears in schedule for first appointment
```

---

### Journey 3 — E-Prescribing with Drug Check

```
Provider selects "New Prescription" during encounter →
Searches medication by name or condition →
System pulls real-time formulary status and patient cost estimate (RTPB) →
Drug-drug and drug-allergy checks run automatically →
If interaction found: tiered alert shown (contraindicated = hard stop; major = soft stop with override reason required) →
Dose confirmed within range for patient weight/age →
Provider selects pharmacy (patient preference from profile) →
Prescription transmitted to pharmacy via Surescripts →
Prescription recorded on medication list with date, dose, prescriber →
Patient notified via portal that prescription is sent
```

---

### Journey 4 — Lab Result Critical Value

```
Lab result ingested from reference lab via HL7 ORU →
System parses result → flags as critical value (e.g. potassium 6.8 mEq/L) →
Immediate push notification sent to ordering provider →
Notification also appears as high-priority item in provider inbox →
Provider must acknowledge critical value within configurable time window →
Acknowledgement logged with timestamp (audit trail) →
Provider sends secure message to patient via portal with instructions →
Patient notified with push notification and reads result with provider's message
```

---

### Journey 5 — Patient Portal Self-Service (Refill Request)

```
Patient logs into portal app (biometric auth) →
Navigates to Medications → selects medication → taps "Request Refill" →
Adds optional note to care team →
Refill request routed to provider inbox →
Provider reviews (confirm last visit date, check for overdue labs) →
Approves refill → e-prescription transmitted to pharmacy →
Patient receives push notification: "Your refill has been sent to [Pharmacy Name]"
```

---

### Journey 6 — Prior Authorisation

```
Provider enters order requiring prior auth (e.g. MRI, specialty medication) →
System identifies that payer requires PA for this service →
PA request auto-generated with supporting clinical data from chart →
Request submitted to payer electronically (X12 278 or payer FHIR API) →
PA status tracked in billing queue (submitted / pending / approved / denied) →
If approved: auth number attached to claim automatically →
If denied: denial reason surfaced in billing queue → appeal workflow initiated →
Provider and patient notified of outcome
```

---

## 5. Integration Requirements

| Integration | Protocol | Priority |
|---|---|---|
| Surescripts (e-prescribing + medication history + RTPB) | NCPDP SCRIPT | P0 — launch |
| Reference labs (LabCorp, Quest) | HL7 v2 ORM/ORU | P0 — launch |
| Insurance eligibility clearinghouse | X12 270/271 | P0 — launch |
| Claims clearinghouse | X12 837P / 837I / 835 | P0 — launch |
| FHIR R4 API (patient data access) | HL7 FHIR R4 | P0 — launch |
| SMART on FHIR | OAuth 2.0 + FHIR | P1 |
| PACS / Radiology | DICOM, HL7 ORM/ORU | P1 |
| Carequality / CommonWell | FHIR, IHE profiles | P1 |
| Direct messaging | Direct Trust | P1 |
| Wearables (Apple Health, Google Health) | FHIR Observation | P2 |
| Hospital ADT feed | HL7 v2 ADT | P2 |
| Prior auth (Da Vinci IGs) | FHIR | P2 |

---

## 6. FHIR R4 Core Data Model

The EMR data model is structured around these primary FHIR R4 resources:

| Domain | FHIR Resource |
|---|---|
| Patient identity | `Patient` |
| Encounters / visits | `Encounter` |
| Problem list | `Condition` |
| Vitals, results, scores | `Observation` |
| Prescriptions | `MedicationRequest` |
| Patient-reported meds | `MedicationStatement` |
| Allergies | `AllergyIntolerance` |
| Procedures | `Procedure` |
| Immunizations | `Immunization` |
| Lab / imaging orders | `ServiceRequest` |
| Lab results, radiology reports | `DiagnosticReport` |
| Specimens | `Specimen` |
| Imaging studies | `ImagingStudy` |
| Clinical notes, attachments | `DocumentReference` |
| Care plans | `CarePlan` |
| Patient goals | `Goal` |
| Appointments | `Appointment` |
| Provider availability | `Schedule` / `Slot` |
| Providers | `Practitioner` / `PractitionerRole` |
| Organisations / sites | `Organization` / `Location` |
| Insurance | `Coverage` |
| Claims | `Claim` |
| Consents | `Consent` |
| Audit trail | `AuditEvent` |

---

## 7. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Availability** | 99.9% uptime (≤ 8.7 hours downtime/year) |
| **API response time (p95)** | < 500ms for all read endpoints |
| **Page load time** | < 2 seconds on standard connection (Lighthouse) |
| **Concurrent users** | Support 500 concurrent users per deployment from launch |
| **Data encryption** | AES-256 at rest; TLS 1.3 in transit |
| **Backup and recovery** | Daily automated backups; RPO ≤ 1 hour; RTO ≤ 4 hours |
| **Audit retention** | Audit logs retained for minimum 7 years (HIPAA) |
| **Compliance** | HIPAA, ONC 21st Century Cures Act, WCAG 2.1 AA |
| **FHIR certification** | ONC Health IT certification (§170.315 criteria) |

---

## 8. Phased Delivery

### Phase 1 — MVP (Core Clinical)
Patient registration · **Patient chart (longitudinal view)** · Scheduling · Clinical documentation (SOAP notes, problem list, medications, allergies, vitals) · E-prescribing (Surescripts) · Lab orders and results · **Immunisation records** · Basic billing (charge capture, claim generation) · Patient portal (appointments, messaging, results) · FHIR R4 APIs · Audit log

### Phase 2 — Full Ambulatory
Ambient AI documentation · Real-time pharmacy benefit check · Prior auth management · Radiology orders and PACS integration · Population health registry and care gaps · Full RCM (denial management, ERA posting) · Referral management · Telehealth video visits · Mobile app (iOS + Android)

### Phase 3 — Network & Advanced
Carequality / CommonWell participation · SMART on FHIR app platform · Wearable and RPM integration · Population health outreach campaigns · Quality measure reporting (HEDIS / MIPS) · Hospital ADT integration · Advanced analytics and custom reporting

---

## 9. Open Questions

- [ ] Target market: ambulatory only, or will inpatient (hospital) workflows be in scope?
- [ ] Will the EMR be sold as a standalone SaaS product or exclusively as part of the Patient Health suite?
- [ ] Ambient AI documentation: build proprietary or integrate a specialist vendor (e.g. Nuance DAX, Abridge, Suki)?
- [ ] E-prescribing: integrate directly with Surescripts or via a middleware vendor (e.g. DrFirst, NewCrop)?
- [ ] Billing: full in-house RCM or partner with a managed RCM service?
- [ ] Deployment regions: US-only at launch, or international (which changes compliance requirements significantly — GDPR, etc.)?
- [ ] Will the EMR support telehealth natively or integrate with a specialist vendor (e.g. Zoom Health, Doxy.me)?
