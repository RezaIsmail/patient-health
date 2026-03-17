# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

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

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/services/emr-service/dist ./dist
COPY --from=builder /app/services/emr-service/prisma ./prisma
COPY --from=builder /app/services/emr-service/node_modules ./node_modules
COPY --from=builder /app/services/emr-service/package.json ./

EXPOSE 3002

CMD ["node", "dist/index.js"]
