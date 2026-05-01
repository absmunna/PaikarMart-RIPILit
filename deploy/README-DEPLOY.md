# PaikarMart — Deployment Guide

## Contents

```
deploy/
  server/           Express API server bundle (ESM + CJS)
  client/           Vite React frontend (static HTML/CSS/JS)
  shared/           Compiled shared libraries (types, API client)
  package.json      Minimal production package manifest
  .env.example      Environment variable template
  ecosystem.config.cjs  PM2 process manager config
  Dockerfile        Docker build (API only or API+nginx)
  README-DEPLOY.md  This file
```

---

## Prerequisites

- Node.js >= 20 (Node 24 recommended)
- PostgreSQL 14+ running and accessible
- Domain / server ready

---

## Option A — VPS (Ubuntu/Linux) with PM2

### 1. Upload deploy folder to server

```bash
scp -r deploy/ user@your-server:/var/www/paikarmart
```

### 2. Set environment variables

```bash
cd /var/www/paikarmart
cp .env.example .env
nano .env    # fill in DATABASE_URL, PORT, ALLOWED_ORIGINS etc.
```

### 3. Install PM2 (once)

```bash
npm install -g pm2
```

### 4. Start the API

```bash
# ESM (recommended)
pm2 start ecosystem.config.cjs --env production

# OR plain node
node --enable-source-maps server/index.mjs

# OR CJS fallback (no --experimental flags needed)
node server/index.cjs
```

### 5. Serve frontend (nginx example)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/paikarmart/client;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Express
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## Option B — cPanel (Node.js App)

### API Server

1. In cPanel → **Setup Node.js App**:
   - Node version: 20+
   - Application root: `deploy/server`
   - Application startup file: `index.cjs`  ← use CJS for cPanel compatibility
   - Set environment variables from `.env.example`

2. Upload `server/` contents to the application root.

3. Start the app from cPanel Node.js App panel.

### Frontend

1. Upload the contents of `client/` to `public_html/` (or a subdomain's docroot).
2. Create `.htaccess` for SPA routing:

```apacheconf
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Option C — Docker

### API only

```bash
docker build --target api -t paikarmart-api .
docker run -d \
  --name paikarmart-api \
  -p 8080:8080 \
  --env-file .env \
  paikarmart-api
```

### Frontend only (nginx)

```bash
docker build --target frontend -t paikarmart-frontend .
docker run -d --name paikarmart-frontend -p 80:80 paikarmart-frontend
```

### Full stack with docker-compose

```yaml
# docker-compose.yml
version: "3.9"
services:
  api:
    build:
      context: .
      target: api
    ports:
      - "8080:8080"
    env_file: .env
    restart: unless-stopped
    depends_on:
      - db

  frontend:
    build:
      context: .
      target: frontend
    ports:
      - "80:80"
    restart: unless-stopped

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: paikarmart
    volumes:
      - pg_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  pg_data:
```

```bash
docker compose up -d
```

---

## Option D — Shared Hosting (Static Frontend Only)

Upload `client/` contents to your hosting's `public_html` folder.

Add `.htaccess` for SPA routing (see cPanel section above).

> The backend API must be hosted separately (VPS/cPanel Node.js App).

---

## Database Setup

Run migrations before first start:

```bash
# From the monorepo root (development only)
cd lib/db && npx tsx seed.ts
```

For production, use your PostgreSQL client to run schema migrations.

---

## Environment Variables Reference

| Variable         | Required | Description                          |
|-----------------|----------|--------------------------------------|
| `PORT`          | Yes      | API server port (default: 8080)      |
| `DATABASE_URL`  | Yes      | PostgreSQL connection string         |
| `NODE_ENV`      | Yes      | Set to `production`                  |
| `ALLOWED_ORIGINS` | No     | CORS allowed frontend origins        |
| `SESSION_SECRET` | No      | JWT/session secret                   |

---

## Start Commands Reference

| Method     | Command                                      |
|-----------|----------------------------------------------|
| ESM Node  | `node --enable-source-maps server/index.mjs` |
| CJS Node  | `node server/index.cjs`                      |
| PM2       | `pm2 start ecosystem.config.cjs --env production` |
| Docker    | `docker build --target api -t paikarmart-api .` |
