# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

COPY apps/admin/package.json ./apps/admin/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/

RUN npm install --workspaces --include-workspace-root

COPY packages/types/ ./packages/types/
COPY packages/ui/ ./packages/ui/
COPY apps/admin/ ./apps/admin/

RUN cd packages/types && npm run build
RUN cd apps/admin && npm run build

# ── Stage 2: nginx ────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf.template

# Defaults for local Docker Compose; Railway overrides these via env vars
ENV AUTH_SERVICE_URL=http://auth-service:3001
ENV BACKEND_SERVICE_URL=http://admin-service:3004

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$AUTH_SERVICE_URL $BACKEND_SERVICE_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
