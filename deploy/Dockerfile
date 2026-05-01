# ─────────────────────────────────────────────────────────────────────
#  PaikarMart — Production Docker Image
#  Serves Express API + optionally static frontend via nginx
# ─────────────────────────────────────────────────────────────────────

# ── Stage 1: API server ──────────────────────────────────────────────
FROM node:24-alpine AS api

WORKDIR /app

# Copy pre-built API server bundle
COPY server/ ./server/
COPY package.json ./
COPY .env.example ./.env.example

# Install only runtime production deps (pino workers etc. are bundled)
# Only pg is needed at runtime for database connectivity
RUN npm install --omit=dev --ignore-scripts 2>/dev/null || true

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "--enable-source-maps", "server/index.mjs"]


# ── Stage 2: Frontend static files (nginx) ───────────────────────────
FROM nginx:alpine AS frontend

# Copy built Vite output
COPY client/ /usr/share/nginx/html/

# SPA fallback: all routes serve index.html
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  gzip on;\n\
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80


# ── Stage 3: Combined (API + static via single container) ────────────
# To run API + static in one container use docker-compose instead.
# See README-DEPLOY.md for docker-compose example.
