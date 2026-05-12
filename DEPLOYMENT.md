# 🚀 PaikarMart Deployment Guide

## Overview

This guide covers deploying PaikarMart to:
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: PostgreSQL (Railway or external)

---

## 1️⃣ Vercel Deployment (Frontend)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Steps

1. **Connect Repository**
   ```
   Go to vercel.com → Import Project
   Select your GitHub repo: absmunna/PaikarMart-RIPILit
   ```

2. **Configure Build Settings**
   - **Framework**: Vite
   - **Build Command**: `pnpm --filter @workspace/paikarmart run build`
   - **Output Directory**: `artifacts/paikarmart/dist`
   - **Install Command**: `pnpm install --frozen-lockfile`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app/api
   VITE_APP_NAME=PaikarMart
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Access your app at `your-project.vercel.app`

### Troubleshooting

**Build fails with "pnpm not found"**
- Vercel uses npm by default
- Add environment variable: `PNPM_HOME=/pnpm`
- Update Node.js version in settings

**API calls fail (CORS error)**
- Check `VITE_API_URL` is correct
- Ensure backend CORS includes Vercel domain

---

## 2️⃣ Railway Deployment (Backend)

### Prerequisites
- Railway account (railway.app)
- GitHub repository connected

### Steps

1. **Create New Project**
   ```
   Go to railway.app → New Project
   Select "GitHub Repo"
   Choose: absmunna/PaikarMart-RIPILit
   ```

2. **Add PostgreSQL Database**
   ```
   Add Service → PostgreSQL
   This creates DATABASE_URL automatically
   ```

3. **Configure Backend Service**
   ```
   Add Service → GitHub Repo (your repo)
   
   Settings:
   - Build Command: pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build
   - Start Command: pnpm --filter @workspace/api-server run start
   - Root Directory: artifacts/api-server
   ```

4. **Environment Variables**
   - Go to Variables tab
   - `DATABASE_URL` - Auto-filled from PostgreSQL
   - `NODE_ENV=production`
   - `JWT_SECRET` - Generate secure key
   - `PORT=3000`

   ```bash
   # Generate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Push to GitHub
   - Railway auto-deploys
   - Check logs: `Logs` tab

### Database Setup

**First Deployment**
```bash
# Run migrations
railway run pnpm run db:push

# Or manually in Railway shell
pnpm run db:push
```

**Verify Connection**
```bash
# In Railway shell
psql $DATABASE_URL -c "\dt"
```

---

## 3️⃣ PostgreSQL Setup

### Option A: Railway PostgreSQL (Recommended)

**Already done when you add PostgreSQL to Railway**

```
Railway handles:
✓ Database creation
✓ User management
✓ Connection pooling
✓ Backups
✓ Auto-scaling
```

### Option B: External PostgreSQL

**Using PlanetScale, Neon, or AWS RDS**

1. Create PostgreSQL instance
2. Copy connection string
3. Add to Railway Variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```

---

## 4️⃣ Domain Setup

### Vercel Frontend Domain

1. **Custom Domain**
   ```
   Settings → Domains
   Add custom domain
   Point DNS to Vercel nameservers
   ```

2. **Update Environment**
   ```
   Frontend: VITE_API_URL=https://api.yourdomain.com
   Backend: CORS_ORIGIN=https://yourdomain.com
   ```

### Railway Backend Domain

1. **Custom Domain**
   ```
   Settings → Custom Domain
   Add domain
   Point DNS CNAME to Railway endpoint
   ```

---

## 5️⃣ Health Check

### Frontend
```bash
curl https://yourdomain.com
# Should return HTML
```

### Backend
```bash
curl https://api.yourdomain.com/health
# Should return: {"status": "ok"}
```

### Database
```bash
curl https://api.yourdomain.com/api/health/db
# Should return database connection status
```

---

## 6️⃣ Monitoring & Logs

### Vercel
```
Settings → Analytics
View:
- Request count
- Response times
- Errors
```

### Railway
```
Logs tab → View real-time logs
Metrics tab → View CPU, Memory, Network
```

---

## 🚨 Troubleshooting

### "DATABASE_URL not found"
```
Railway → Variables
Ensure DATABASE_URL is set
Restart deployment
```

### "Build fails - pnpm not found"
```
Railway → Settings → Node.js Version
Set to: 20.x or higher
```

### "CORS error on API calls"
```
Backend → .env
CORS_ORIGIN=https://yourdomain.com

Add frontend domain, not localhost
```

### "Database migrations fail"
```
Railway Shell → Run:
pnpm run db:push --force

Risk: Can drop tables
Use only if needed
```

### "Timeout on API requests"
```
Check Railway logs for slow queries
Optimize database indexes
Increase Railway plan
```

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations tested locally
- [ ] Frontend API URL correct
- [ ] Backend CORS configured
- [ ] JWT secrets generated
- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] Error logging setup
- [ ] Health checks passing
- [ ] Documentation updated

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Optional: Auto-deploy on push

```yaml
name: Deploy
on:
  push:
    branches: [M]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - run: pnpm run typecheck
```

---

## 📞 Support

**Vercel Issues**: https://vercel.com/support
**Railway Issues**: https://railway.app/support
**PaikarMart Issues**: Create GitHub issue

---

**Last Updated**: 2026-05-12
**Status**: Production Ready ✅
