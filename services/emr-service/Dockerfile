# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

COPY services/emr-service/package.json ./services/emr-service/
COPY packages/types/package.json ./packages/types/

RUN npm install --workspaces --include-workspace-root

COPY packages/types/ ./packages/types/
COPY services/emr-service/ ./services/emr-service/

RUN cd packages/types && npm run build
RUN cd services/emr-service && npx prisma generate
RUN cd services/emr-service && npm run build

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Required for Prisma native query engine on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Hoisted workspace deps (fastify, zod, prisma, etc. live here)
COPY --from=builder /app/node_modules ./node_modules

# Compiled service output
COPY --from=builder /app/services/emr-service/dist ./dist

# Prisma schema (used for migrations / seeding)
COPY --from=builder /app/services/emr-service/prisma ./prisma

# Prisma generated client with native engine binary.
# Must live at ./dist/generated/prisma so that dist/lib/prisma.js can resolve
# require('../generated/prisma') — i.e. /app/dist/lib/../generated/prisma.
COPY --from=builder /app/services/emr-service/src/generated/prisma ./dist/generated/prisma

COPY --from=builder /app/services/emr-service/package.json ./

EXPOSE 3002

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/index.js"]
