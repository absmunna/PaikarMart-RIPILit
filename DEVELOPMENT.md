# 🛠️ PaikarMart Development Guide

## Quick Start

### Prerequisites
```bash
Node.js >= 20
pnpm >= 9
PostgreSQL >= 14
git
```

### Setup

1. **Clone Repository**
```bash
git clone https://github.com/absmunna/PaikarMart-RIPILit.git
cd PaikarMart-RIPILit
```

2. **Install Dependencies**
```bash
pnpm install --frozen-lockfile
```

3. **Setup Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

4. **Database Setup**
```bash
# Start PostgreSQL
# Then run migrations
pnpm run db:push

# Seed database (optional)
pnpm run db:seed
```

5. **Run Development Servers**
```bash
# Terminal 1: Frontend
pnpm --filter @workspace/paikarmart run dev
# Runs on http://localhost:5173

# Terminal 2: Backend
pnpm --filter @workspace/api-server run dev
# Runs on http://localhost:3000
```

---

## Project Structure

```
PaikarMart-RIPILit/
├── artifacts/
│   ├── api-server/           Backend API
│   │   ├── src/
│   │   │   ├── app.ts       Express app
│   │   │   ├── index.ts     Entry point
│   │   │   ├── routes/      API routes
│   │   │   ├── middleware/  Middlewares
│   │   │   └── lib/         Utils
│   │   ├── build.mjs        Build script
│   │   └── package.json
│   └── paikarmart/           Frontend App
│       ├── src/
│       │   ├── pages/       Route pages
│       │   ├── components/  React components
│       │   ├── hooks/       Custom hooks
│       │   ├── context/     Context providers
│       │   ├── App.tsx      Root component
│       │   └── main.tsx     Entry point
│       └── vite.config.ts
├── lib/                      Shared Libraries
│   ├── api-zod/            Validation schemas
│   ├── api-client-react/   React API client
│   ├── db/                 Database layer
│   └── api-spec/           API specification
└── pnpm-workspace.yaml     Monorepo config
```

---

## Common Commands

### Development
```bash
# Frontend dev server
pnpm --filter @workspace/paikarmart run dev

# Backend dev server
pnpm --filter @workspace/api-server run dev

# Build all
pnpm run build

# Type checking
pnpm run typecheck
```

### Database
```bash
# Run migrations
pnpm run db:push

# Force migrations
pnpm run db:push-force

# Seed data
pnpm run db:seed

# Generate migrations
pnpm run db:generate
```

### Testing
```bash
# Run tests (when available)
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage
pnpm run test:coverage
```

---

## Frontend Development

### File Structure
```
src/
├── components/          Reusable React components
├── pages/              Route page components
├── hooks/              Custom React hooks
├── context/            React context/providers
├── config/             App configuration
├── features/           Feature modules
├── lib/                Utility functions
├── routes/             Routing configuration
├── seller/             Seller features
├── styles/             Global styles
├── App.tsx            Root component
└── main.tsx           Entry point
```

### Creating Components

```typescript
// src/components/MyComponent.tsx
import React from 'react';

interface Props {
  title: string;
  onClick?: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onClick }) => {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
    </div>
  );
};
```

### Using API Client

```typescript
import { useProducts } from '@workspace/api-client-react';

function ProductList() {
  const { data: products, isLoading, error } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {products?.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

---

## Backend Development

### File Structure
```
src/
├── routes/            API route handlers
├── middleware/        Express middlewares
├── lib/              Utility functions
├── app.ts            Express configuration
└── index.ts          Server entry point
```

### Creating API Routes

```typescript
// src/routes/products.ts
import { Router } from 'express';
import { CreateProductSchema } from '@workspace/api-zod';

const router = Router();

router.get('/', async (req, res) => {
  // GET /api/products
  const products = await db.select().from(productsTable);
  res.json({ success: true, data: products });
});

router.post('/', async (req, res) => {
  // POST /api/products
  const validated = CreateProductSchema.parse(req.body);
  // Create product...
  res.status(201).json({ success: true, data: product });
});

export default router;
```

### Database Queries

```typescript
import { db } from '@workspace/db';
import { productsTable } from '@workspace/db/schema';

// Select all
const products = await db.select().from(productsTable);

// Select with where
const active = await db
  .select()
  .from(productsTable)
  .where(eq(productsTable.active, true));

// Insert
const newProduct = await db
  .insert(productsTable)
  .values({ name: 'Product', price: 99.99 })
  .returning();

// Update
const updated = await db
  .update(productsTable)
  .set({ price: 89.99 })
  .where(eq(productsTable.id, productId));

// Delete
await db
  .delete(productsTable)
  .where(eq(productsTable.id, productId));
```

---

## Git Workflow

### Feature Branch
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-feature
```

### Commit Conventions
```
feat: new feature
fix: bug fix
refactor: code refactoring
style: formatting changes
docs: documentation
test: tests
chore: maintenance
```

---

## Debugging

### Frontend
```bash
# Browser DevTools
F12 or Cmd+Option+I

# React DevTools
Chrome/Firefox extension

# Network debugging
Application tab → Local Storage
Console tab → Check errors
```

### Backend
```bash
# Node debugger
node --inspect ./dist/index.mjs
# Open: chrome://inspect

# Logs
check console output

# Database
psql $DATABASE_URL
select * from products;
```

---

## Performance Tips

### Frontend
- Use React DevTools Profiler
- Check bundle size: `pnpm run build --analyze`
- Lazy load routes with React.lazy()
- Memoize expensive components

### Backend
- Add database indexes
- Cache frequently accessed data
- Use connection pooling
- Monitor query performance

---

## Troubleshooting

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### "Cannot find module @workspace/api-zod"
```bash
# Reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### "Database connection failed"
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Check database exists
psql $DATABASE_URL -c "select 1"
```

### "Port 3000 already in use"
```bash
# Use different port
PORT=3001 pnpm run dev
```

---

## Resources

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Express Docs](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Zod Validation](https://zod.dev/)
- [pnpm Docs](https://pnpm.io/)

---

**Last Updated**: 2026-05-12
**Status**: Ready for Development ✅
