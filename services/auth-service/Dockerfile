# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copy root workspace files
COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

# Copy service package files (for workspace resolution)
COPY services/auth-service/package.json ./services/auth-service/
COPY packages/types/package.json ./packages/types/

# Install all workspace deps
RUN npm install --workspaces --include-workspace-root

# Copy source
COPY packages/types/ ./packages/types/
COPY services/auth-service/ ./services/auth-service/

# Build shared types first
RUN cd packages/types && npm run build

# Generate Prisma client
RUN cd services/auth-service && npx prisma generate

# Compile TypeScript
RUN cd services/auth-service && npm run build

# Copy Prisma generated client into dist so it ships as part of the compiled output.
# dist/lib/prisma.js resolves require('../generated/prisma') → dist/generated/prisma
RUN mkdir -p /app/services/auth-service/dist/generated && cp -r /app/services/auth-service/src/generated/prisma /app/services/auth-service/dist/generated/prisma

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Required for Prisma native query engine on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Hoisted workspace deps (fastify, zod, prisma, etc. live here)
COPY --from=builder /app/node_modules ./node_modules

# Compiled service output (includes dist/generated/prisma from the cp above)
COPY --from=builder /app/services/auth-service/dist ./dist

# Prisma schema (used for migrations / seeding)
COPY --from=builder /app/services/auth-service/prisma ./prisma

COPY --from=builder /app/services/auth-service/package.json ./

EXPOSE 3001

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/index.js"]
