# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

COPY services/admin-service/package.json ./services/admin-service/
COPY packages/types/package.json ./packages/types/
COPY packages/events/package.json ./packages/events/

RUN npm install --workspaces --include-workspace-root

COPY packages/types/ ./packages/types/
COPY packages/events/ ./packages/events/
COPY services/admin-service/ ./services/admin-service/

RUN cd packages/types && npm run build
RUN cd packages/events && npm run build
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

# Workspace package — symlink target must exist so Node.js can resolve it
COPY --from=builder /app/packages/events ./packages/events

# Compiled service output
COPY --from=builder /app/services/admin-service/dist ./dist

# Prisma schema (used for migrations / seeding)
COPY --from=builder /app/services/admin-service/prisma ./prisma

COPY --from=builder /app/services/admin-service/package.json ./

EXPOSE 3004

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node prisma/seed.js && node dist/index.js"]
