# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

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

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/services/auth-service/dist ./dist
COPY --from=builder /app/services/auth-service/prisma ./prisma
COPY --from=builder /app/services/auth-service/node_modules ./node_modules
COPY --from=builder /app/services/auth-service/package.json ./

EXPOSE 3001

CMD ["node", "dist/index.js"]
