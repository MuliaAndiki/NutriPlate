# NutriPlate Project Guidelines

## Build And Test

- Package manager: Bun (`bun@1.3.1`) at workspace root.
- Monorepo orchestration: Turbo (`turbo run ...`) from root.
- Root commands:
  - `bun run dev` runs all workspaces in parallel.
  - `bun run build` runs all package builds.
  - `bun run test` runs all package tests.
- Backend (`be`) commands:
  - `bun run dev` (runs `prisma generate` first, then Bun watch server)
  - `bun run test` (bun:test)
- Frontend (`fe`) commands:
  - `bun run dev`
  - `bun run test` (bun:test)
  - `bun run lint`
- Python ML API (`api`) commands:
  - `bun run dev` (uses `../.venv/bin/uvicorn app:app --reload --port 8000`)
  - `bun run test` (`python -m pytest tests/ -v`)

## Architecture

- `be`: Main API service (Elysia + Prisma + PostgreSQL), auth/session, program logic, IoT and ML proxy endpoints.
- `fe`: Next.js App Router PWA client; grouped routes in `src/app/(auth)`, `src/app/(private)`, `src/app/(public)`.
- `api`: FastAPI model service for detection/inference; loads YOLO model at startup.
- `iot`: Arduino firmware for the device side.
- `preprocessing`: training/dataset notebooks and scripts.

## Conventions

- Follow existing package-local style and scripts instead of introducing new tooling.
- Keep backend flow consistent: routes in `be/src/routes`, controllers in `be/src/controllers`, logic in `be/src/service`.
- Frontend code should follow existing modular structure under `fe/src/components`, `fe/src/services/module`, `fe/src/hooks`, `fe/src/utils`.
- Use existing response/auth patterns in backend middleware and route handlers before introducing new abstractions.
- Prefer minimal, focused edits; avoid broad refactors unless requested.

## Workspace Gotchas

- Do not switch package managers (workspace uses Bun and `workspace:^` dependencies).
- After Prisma schema changes in `be/prisma/schema.prisma`, regenerate client before running backend.
- `api` expects a Python virtual environment and model files under `api/models`.
- Root `docker-compose.yaml` is currently empty; do not assume compose-based local orchestration is available.

## Reference Docs

- Root project overview: `readme.md`
- Backend README: `be/README.md`
- Frontend README: `fe/README.md`
