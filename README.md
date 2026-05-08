# PaikarMart

Multi-vendor eCommerce platform for Bangladesh.

## Stack

- **Frontend**: React + Vite + TailwindCSS v4
- **Backend**: Express 5 + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Monorepo**: pnpm workspaces
- **Validation**: Zod + drizzle-zod

## Structure

```
PaikarMart-RIPILit/
|-- artifacts/
|   |-- api-server/     # Express API
|   `-- paikarmart/     # React frontend
|-- lib/
|   |-- api-spec/       # OpenAPI spec
|   |-- api-client-react/ # Generated React Query hooks
|   |-- api-zod/        # Generated Zod schemas
|   `-- db/             # Drizzle ORM schema
`-- scripts/            # Utility scripts
```

## Setup

```bash
# Install dependencies
pnpm install

# Copy env file
cp .env.example .env
# Fill in your DATABASE_URL

# Push DB schema
pnpm --filter @workspace/db run push

# Run dev
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/paikarmart run dev
```

## Deploy

- **Frontend**: Vercel (connect GitHub, set root to `artifacts/paikarmart`)
- **Backend**: Railway / Render / VPS
