# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Global standards apply.** The root `C:\Users\Reza\CLAUDE.md` defines enterprise grade quality, research-before-implementation, UX/UI standards, security, observability, and GitHub workflow. Everything here is in addition to those standards.

---

## Project Vision

**Patient Health** is a suite of three independent digital health products:

| Product | Description |
|---|---|
| **EMR** | Electronic Medical Record — patient health records, clinical workflows |
| **Admin System** | Internal operations, user management, configuration |
| **CRM** | Healthcare CRM (Salesforce Health Cloud equivalent) — patient relationships, outreach, pipelines |

Products are independently deployable and scale independently. The only shared layer is a centralised **auth service** (SSO across all three).

---

## Architecture

### Principles
- **Microservices** — each product and domain is its own service; products do not share databases
- **Decoupled frontend/backend** — separate servers per product, communicate via REST APIs (OpenAPI spec per service)
- **Independent scaling** — each product has its own infra footprint; Admin, CRM, and EMR scale independently
- **Integration-ready** — Node.js + TypeScript throughout; broadest ecosystem for HL7, FHIR, REST, SOAP, and enterprise webhooks

### Stack

**Frontend** (all three products)
- React + TypeScript, Vite, React Router, TanStack Query
- Tailwind CSS + shadcn/ui (shared design system via `packages/ui`)
- Vitest + React Testing Library

**Backend** (all services)
- Node.js + TypeScript + Fastify
- REST APIs with OpenAPI specs
- JWT auth (short-lived access tokens + refresh tokens)
- Jest for testing
- Single language across frontend and backend enables shared types; Node.js has the broadest ecosystem for healthcare/enterprise integrations

**Database**
- PostgreSQL per product (each product owns its own database — no cross-product joins)
- Redis per product (caching, sessions, queues)

**Infrastructure**
- Docker (all services containerised); Docker Compose for local dev
- Kubernetes with **separate namespaces per product** — independent scaling and deployment pipelines
- AWS ECS / Google Cloud Run recommended at early stage for cost-effective auto-scaling
- GitHub Actions (CI/CD — one workflow file per product)

**Auth**
- Single shared `auth-service` — the only cross-product service
- RBAC with product-scoped roles (a user can hold roles across multiple products simultaneously)
- OAuth 2.0 / OIDC — SSO ready, supports Azure AD, Okta, and other corporate IdP integrations

**Analytics**
- Google Analytics 4 on all frontends
- Custom event taxonomy: `[product]_[entity]_[action]` (e.g. `emr_patient_record_viewed`, `crm_lead_converted`)
- Server-side events for sensitive/clinical actions (no PII in GA)

### Integration Approach
Enterprise integrations (corporate clients, hospital systems, insurers) use:
- REST (primary) with OpenAPI contracts
- HL7 FHIR R4 for clinical data exchange (EMR)
- Webhooks for event-driven integrations
- OAuth 2.0 for third-party auth
- An `integrations/` directory per service for integration-specific adapters

---

## Monorepo Structure

```
patient-health/
  apps/
    emr/           # EMR frontend (React)
    admin/         # Admin frontend (React)
    crm/           # CRM frontend (React)
  services/
    auth-service/  # Shared auth (the only cross-product service)
    emr-service/
    admin-service/
    crm-service/
  packages/
    ui/            # Shared component library (shadcn/ui base)
    analytics/     # Shared GA4 wrapper + event type definitions
    types/         # Shared TypeScript types (used across apps + services)
  infra/
    docker/        # Dockerfiles and docker-compose
    k8s/           # Kubernetes manifests (one namespace folder per product)
    github/        # Reusable GitHub Actions workflows
```

---

## Commands

### Local dev
```bash
docker compose up                          # all services
docker compose up emr-frontend emr-service # one product only
```

### Frontend (per app)
```bash
cd apps/emr
npm install
npm run dev        # dev server
npm test           # vitest
npm run build      # production build
npm run lint       # eslint
```

### Backend (per service)
```bash
cd services/emr-service
npm install
npm run dev        # nodemon + ts-node
npm test           # jest
npm run lint       # eslint
```

### Shared packages
```bash
cd packages/types
npm run build      # compile shared types before services consume them
```

---

## Healthcare-Specific Standards

### Security & compliance
- HIPAA-aligned data handling across all products
- Audit log all writes to patient data — append-only audit table per service, recording actor, timestamp, and before/after state
- No PII in logs, analytics, or error reports — mask or omit before logging

### Clinical data standards
- HL7 FHIR R4 is the standard for clinical data exchange in the EMR
- Patient context must always be visible on clinical screens — never ambiguous whose record is being viewed
- Explicit confirmation required for all clinical writes (medications, diagnoses, care plans)

### Healthcare UX — SMART on FHIR app design guidelines
For all EMR-facing UI, follow SMART on FHIR UX conventions:
- Patient context always visible in the UI header
- Clear data provenance (source, authored by, date)
- Reduce cognitive load — clinical users are time-pressured; surface critical information first, use progressive disclosure for advanced options
- Inline editing where appropriate — avoid full-page context switches for minor updates
- Audit visibility — "last updated by / when" shown inline on patient records

### Competitive references for research
When researching features per the global research-before-implementation standard, the primary references for this project are:
- **EMR**: Epic, Cerner (Oracle Health), Meditech, Elation Health
- **CRM**: Salesforce Health Cloud, HubSpot, Zoho CRM
- **Admin**: internal ops tools — Linear, Retool, AdminJS patterns

---

## Requirements Status

- [x] EMR — [`docs/emr-requirements.md`](docs/emr-requirements.md)
- [ ] Admin System — requirements TBD
- [ ] CRM — requirements TBD
