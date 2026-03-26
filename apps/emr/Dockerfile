# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

COPY apps/emr/package.json ./apps/emr/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/events/package.json ./packages/events/
COPY packages/analytics/package.json ./packages/analytics/

RUN npm install --workspaces --include-workspace-root

COPY packages/types/ ./packages/types/
COPY packages/ui/ ./packages/ui/
COPY packages/events/ ./packages/events/
COPY packages/analytics/ ./packages/analytics/
COPY apps/emr/ ./apps/emr/

RUN cd packages/types && npm run build
RUN cd apps/emr && npm run build

# ── Stage 2: nginx ────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Required for nginx to proxy to HTTPS upstream services (Railway)
RUN apk add --no-cache ca-certificates

COPY --from=builder /app/apps/emr/dist /usr/share/nginx/html
COPY apps/emr/nginx.conf /etc/nginx/conf.d/default.conf.template

# Defaults for local Docker Compose; Railway overrides these via env vars
ENV AUTH_SERVICE_URL=http://auth-service:3001
ENV BACKEND_SERVICE_URL=http://emr-service:3002
ENV PORT=80

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$AUTH_SERVICE_URL $BACKEND_SERVICE_URL $PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
