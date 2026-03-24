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
COPY apps/crm/nginx.conf /etc/nginx/conf.d/default.conf.template

# Defaults for local Docker Compose; Railway overrides these via env vars
ENV AUTH_SERVICE_URL=http://auth-service:3001
ENV BACKEND_SERVICE_URL=http://crm-service:3003
ENV PORT=80

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$AUTH_SERVICE_URL $BACKEND_SERVICE_URL $PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
