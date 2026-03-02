# ---- build ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY web-client/package.json web-client/pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY web-client ./
RUN pnpm build

# ---- run (nginx) ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80