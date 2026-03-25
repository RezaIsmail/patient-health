# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

COPY services/admin-service/package.json ./services/admin-service/
COPY packages/types/package.json ./packages/types/

RUN npm install --workspaces --include-workspace-root

COPY packages/types/ ./packages/types/
COPY services/admin-service/ ./services/admin-service/

RUN cd packages/types && npm run build
RUN cd services/admin-service && npx prisma generate
RUN cd services/admin-service && npm run build

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Required for Prisma native query engine on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Hoisted workspace deps (fastify, zod, prisma, etc. live here)
COPY --from=builder /app/node_modules ./node_modules

# Compiled service output
COPY --from=builder /app/services/admin-service/dist ./dist

# Prisma schema (used for migrations / seeding)
COPY --from=builder /app/services/admin-service/prisma ./prisma

COPY --from=builder /app/services/admin-service/package.json ./

EXPOSE 3004

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node prisma/seed.js && node dist/index.js"]
