# Railway Deployment Guide

This guide walks through deploying Patient Health to a Railway test/staging environment. The entire stack — 4 backends, 3 frontends, PostgreSQL, and Redis — runs on Railway.

**Estimated time:** 45–60 minutes for the first deploy.

---

## Overview

| Service | Type | Railway service name |
|---|---|---|
| PostgreSQL | Railway plugin | `Postgres` |
| Redis | Railway plugin | `Redis` |
| auth-service | Docker (backend) | `auth-service` |
| emr-service | Docker (backend) | `emr-service` |
| crm-service | Docker (backend) | `crm-service` |
| admin-service | Docker (backend) | `admin-service` |
| emr-frontend | Docker (nginx) | `emr-frontend` |
| crm-frontend | Docker (nginx) | `crm-frontend` |
| admin-frontend | Docker (nginx) | `admin-frontend` |

---

## Step 1 — Create a Railway account and project

1. Go to [railway.app](https://railway.app) and sign up (use GitHub login — it links directly to your repo)
2. Click **New Project**
3. Select **Empty project**
4. Name it `patient-health-staging`

---

## Step 2 — Add databases

### PostgreSQL
1. In your project, click **+ New** → **Database** → **Add PostgreSQL**
2. Railway provisions a Postgres instance. Click on it and go to **Variables** — note the `DATABASE_URL` value (you'll need it shortly)

### Redis
1. Click **+ New** → **Database** → **Add Redis**
2. Note the `REDIS_URL` value from its **Variables** tab

---

## Step 3 — Deploy the backend services

Repeat these steps for each of the 4 backend services: `auth-service`, `emr-service`, `crm-service`, `admin-service`.

1. Click **+ New** → **GitHub Repo** → select `patient-health`
2. Click **Add service** (not "Deploy now" yet)
3. In the service settings:
   - **Service name**: `auth-service` (or whichever you're adding)
   - **Root Directory**: leave blank (monorepo root)
   - **Dockerfile Path**: `services/auth-service/Dockerfile`
4. Go to the **Variables** tab and add the env vars listed below for that service
5. Click **Deploy**

### auth-service variables
```
NODE_ENV=production
AUTH_DATABASE_URL=<paste DATABASE_URL from Postgres plugin, change /postgres to /auth_db>
REDIS_URL=<paste REDIS_URL from Redis plugin>
JWT_ACCESS_SECRET=<generate a strong random string, min 32 chars>
JWT_REFRESH_SECRET=<generate a different strong random string>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=<leave blank for now — fill in after frontends are deployed>
```

### emr-service variables
```
NODE_ENV=production
EMR_DATABASE_URL=<DATABASE_URL, change /postgres to /emr_db>
REDIS_URL=<REDIS_URL from Redis plugin>
JWT_ACCESS_SECRET=<same value as auth-service>
INTERNAL_SERVICE_TOKEN=<generate a random string>
EMR_SERVICE_URL=http://emr-service.railway.internal:3002
CRM_SERVICE_URL=http://crm-service.railway.internal:3003
ADMIN_SERVICE_URL=http://admin-service.railway.internal:3004
CORS_ORIGIN=<leave blank for now>
```

### crm-service variables
```
NODE_ENV=production
CRM_DATABASE_URL=<DATABASE_URL, change /postgres to /crm_db>
REDIS_URL=<REDIS_URL from Redis plugin>
JWT_ACCESS_SECRET=<same value as auth-service>
INTERNAL_SERVICE_TOKEN=<same value as emr-service>
EMR_SERVICE_URL=http://emr-service.railway.internal:3002
CRM_SERVICE_URL=http://crm-service.railway.internal:3003
ADMIN_SERVICE_URL=http://admin-service.railway.internal:3004
CORS_ORIGIN=<leave blank for now>
```

### admin-service variables
```
NODE_ENV=production
ADMIN_DATABASE_URL=<DATABASE_URL, change /postgres to /admin_db>
REDIS_URL=<REDIS_URL from Redis plugin>
JWT_ACCESS_SECRET=<same value as auth-service>
INTERNAL_SERVICE_TOKEN=<same value as emr-service>
EMR_SERVICE_URL=http://emr-service.railway.internal:3002
CRM_SERVICE_URL=http://crm-service.railway.internal:3003
ADMIN_SERVICE_URL=http://admin-service.railway.internal:3004
CORS_ORIGIN=<leave blank for now>
```

> **Tip — generating secrets:** In your terminal run `openssl rand -base64 32` to generate a strong random string. Use a different value for each secret.

---

## Step 4 — Run database migrations and seed data

Once all 4 backend services have deployed successfully (green status), you need to run Prisma migrations and seed each database.

For each service, go to its Railway page → **Settings** → **Deploy** → click **New Deploy** with a custom start command... Actually the easiest approach:

1. In the Railway service, click **+ New** → **Service** → select the same repo
2. Set **Dockerfile** to the backend service you want to seed
3. Override the **Start Command** to: `npx prisma db push && npx ts-node prisma/seed.ts`
4. Run once, then delete this one-off service

Alternatively, SSH into the running service container via Railway's shell feature and run migrations there.

> **Shortcut:** In the Railway dashboard, each service has a **Shell** tab. Click it and run:
> ```bash
> cd /app && npx prisma db push
> ```

---

## Step 5 — Deploy the frontend services

Repeat for each: `emr-frontend`, `crm-frontend`, `admin-frontend`.

1. Click **+ New** → **GitHub Repo** → same repo
2. Settings:
   - **Service name**: `emr-frontend`
   - **Dockerfile Path**: `apps/emr/Dockerfile`
3. Variables:

### emr-frontend variables
```
AUTH_SERVICE_URL=http://auth-service.railway.internal:3001
BACKEND_SERVICE_URL=http://emr-service.railway.internal:3002
```

### crm-frontend variables
```
AUTH_SERVICE_URL=http://auth-service.railway.internal:3001
BACKEND_SERVICE_URL=http://crm-service.railway.internal:3003
```

### admin-frontend variables
```
AUTH_SERVICE_URL=http://auth-service.railway.internal:3001
BACKEND_SERVICE_URL=http://admin-service.railway.internal:3004
```

4. Click **Deploy**

Railway will assign each frontend a public URL like `emr-frontend-production.up.railway.app`.

---

## Step 6 — Wire up CORS

Once the frontends are deployed, go back to each backend service and update the `CORS_ORIGIN` variable with the corresponding frontend URL:

| Service | CORS_ORIGIN value |
|---|---|
| auth-service | all three frontend URLs, comma-separated |
| emr-service | `https://emr-frontend-production.up.railway.app` |
| crm-service | `https://crm-frontend-production.up.railway.app` |
| admin-service | `https://admin-frontend-production.up.railway.app` |

For `auth-service`, CORS_ORIGIN should be all three frontends:
```
https://emr-frontend-production.up.railway.app,https://crm-frontend-production.up.railway.app,https://admin-frontend-production.up.railway.app
```

Redeploy each backend after updating CORS_ORIGIN.

---

## Step 7 — Test the deployment

1. Open the `emr-frontend` public URL → should see the login page
2. Log in with `admin@patienthealth.io` / `Admin1234!`
3. Navigate to a patient chart — clinical data should load
4. Open the `crm-frontend` URL → log in → open a contact → check the EMR tab

---

## Automatic deploys

Railway auto-deploys whenever you push to the branch configured on each service (defaults to `main`). To deploy staging from `develop`:

In each service → **Settings** → **Source** → set **Branch** to `develop`.

---

## Cost estimate

| Resource | Plan | ~Monthly cost |
|---|---|---|
| PostgreSQL | Starter | $5 |
| Redis | Starter | $5 |
| 4 backend services | Hobby ($5/service) | $20 |
| 3 frontend services | Hobby ($5/service) | $15 |
| **Total** | | **~$45/month** |

The Hobby plan is sufficient for a test/staging environment.
