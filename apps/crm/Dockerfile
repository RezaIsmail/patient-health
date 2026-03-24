# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

COPY apps/crm/package.json ./apps/crm/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/

RUN npm install --workspaces --include-workspace-root

COPY packages/types/ ./packages/types/
COPY packages/ui/ ./packages/ui/
COPY apps/crm/ ./apps/crm/

RUN cd packages/types && npm run build
RUN cd apps/crm && npm run build

# ── Stage 2: nginx ────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY --from=builder /app/apps/crm/dist /usr/share/nginx/html
COPY apps/crm/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
