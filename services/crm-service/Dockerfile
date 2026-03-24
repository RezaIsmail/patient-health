# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

COPY services/crm-service/package.json ./services/crm-service/
COPY packages/types/package.json ./packages/types/

RUN npm install --workspaces --include-workspace-root

COPY packages/types/ ./packages/types/
COPY services/crm-service/ ./services/crm-service/

RUN cd packages/types && npm run build
RUN cd services/crm-service && npx prisma generate
RUN cd services/crm-service && npm run build

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Required for Prisma native query engine on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Hoisted workspace deps (fastify, zod, prisma, etc. live here)
COPY --from=builder /app/node_modules ./node_modules

# Compiled service output
COPY --from=builder /app/services/crm-service/dist ./dist

# Prisma schema (used for migrations / seeding)
COPY --from=builder /app/services/crm-service/prisma ./prisma

# Prisma generated client with native engine binary.
# Must live at ./dist/generated/prisma so that dist/lib/prisma.js can resolve
# require('../generated/prisma') — i.e. /app/dist/lib/../generated/prisma.
COPY --from=builder /app/services/crm-service/src/generated/prisma ./dist/generated/prisma

COPY --from=builder /app/services/crm-service/package.json ./

EXPOSE 3003

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/index.js"]
