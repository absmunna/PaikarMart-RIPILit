@echo off
echo ========================================
echo  PaikarMart - Replit Cleanup Script
echo ========================================
echo.

echo [1/5] Deleting Replit-specific files...
if exist ".replit" del /f ".replit" && echo   - .replit deleted
if exist ".replitignore" del /f ".replitignore" && echo   - .replitignore deleted
if exist "replit.md" del /f "replit.md" && echo   - replit.md deleted
if exist "replit.nix" del /f "replit.nix" && echo   - replit.nix deleted
if exist "DEPLOY_AUDIT_2026-05-05.md" del /f "DEPLOY_AUDIT_2026-05-05.md" && echo   - DEPLOY_AUDIT_2026-05-05.md deleted
if exist "README_BACKUP.md" del /f "README_BACKUP.md" && echo   - README_BACKUP.md deleted
if exist "paikarmart_pre_phase1_backup.tar.gz" del /f "paikarmart_pre_phase1_backup.tar.gz" && echo   - backup.tar.gz deleted
if exist "attached_assets" rmdir /s /q "attached_assets" && echo   - attached_assets/ deleted
if exist ".github\workflows\webpack.yml" del /f ".github\workflows\webpack.yml" && echo   - webpack.yml deleted
echo   Done.
echo.

echo [2/5] Fixing pnpm-workspace.yaml (removing Replit exclusions)...
powershell -Command "(Get-Content 'pnpm-workspace.yaml') | Where-Object { $_ -notmatch \"'@replit/\*'\" -and $_ -notmatch 'stripe-replit-sync' } | Set-Content 'pnpm-workspace.yaml'"
echo   Done.
echo.

echo [3/5] Fixing vite.config.ts (removing Replit plugins)...
powershell -Command ^
  "$content = Get-Content 'artifacts/paikarmart/vite.config.ts' -Raw;" ^
  "$content = $content -replace 'import runtimeErrorOverlay from \`"@replit/vite-plugin-runtime-error-modal\`";\r?\n', '';" ^
  "$content = $content -replace '    runtimeErrorOverlay\(\),\r?\n', '';" ^
  "$content = $content -replace '    \.\.\.\(process\.env\.NODE_ENV !== \`"production\`" &&\r?\n    process\.env\.REPL_ID !== undefined\r?\n      \? \[\r?\n.*?await import\(\`"@replit/vite-plugin-cartographer\`"\).*?\r?\n.*?\r?\n.*?\r?\n.*?await import\(\`"@replit/vite-plugin-dev-banner\`"\).*?\r?\n.*?\r?\n.*?\r?\n.*?\r?\n      \] : \[\]\),\r?\n', '', 'Singleline';" ^
  "Set-Content 'artifacts/paikarmart/vite.config.ts' $content"
echo   Done.
echo.

echo [4/5] Creating .env.example...
(
echo # Database
echo DATABASE_URL=postgresql://user:password@localhost:5432/paikarmart
echo.
echo # Server
echo PORT=3000
echo NODE_ENV=production
echo.
echo # Frontend ^(Vite^)
echo VITE_API_URL=http://localhost:3000
) > .env.example
echo   Done.
echo.

echo [5/5] Creating clean README.md...
(
echo # PaikarMart
echo.
echo Multi-vendor eCommerce platform for Bangladesh.
echo.
echo ## Stack
echo.
echo - **Frontend**: React + Vite + TailwindCSS v4
echo - **Backend**: Express 5 + TypeScript
echo - **Database**: PostgreSQL + Drizzle ORM
echo - **Monorepo**: pnpm workspaces
echo - **Validation**: Zod + drizzle-zod
echo.
echo ## Structure
echo.
echo ```
echo PaikarMart-RIPILit/
echo ^|-- artifacts/
echo ^|   ^|-- api-server/     # Express API
echo ^|   ^`-- paikarmart/     # React frontend
echo ^|-- lib/
echo ^|   ^|-- api-spec/       # OpenAPI spec
echo ^|   ^|-- api-client-react/ # Generated React Query hooks
echo ^|   ^|-- api-zod/        # Generated Zod schemas
echo ^|   ^`-- db/             # Drizzle ORM schema
echo ^`-- scripts/            # Utility scripts
echo ```
echo.
echo ## Setup
echo.
echo ```bash
echo # Install dependencies
echo pnpm install
echo.
echo # Copy env file
echo cp .env.example .env
echo # Fill in your DATABASE_URL
echo.
echo # Push DB schema
echo pnpm --filter @workspace/db run push
echo.
echo # Run dev
echo pnpm --filter @workspace/api-server run dev
echo pnpm --filter @workspace/paikarmart run dev
echo ```
echo.
echo ## Deploy
echo.
echo - **Frontend**: Vercel ^(connect GitHub, set root to `artifacts/paikarmart`^)
echo - **Backend**: Railway / Render / VPS
) > README.md
echo   Done.
echo.

echo ========================================
echo  Cleanup complete!
echo  Now run:
echo    git add -A
echo    git commit -m "chore: remove Replit files, fix vite config"
echo    git push origin M
echo ========================================
pause
