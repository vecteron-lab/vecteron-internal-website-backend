# Local setup

This repository is the NestJS backend for the Vecteron internal website CMS.

## Requirements

- Node.js 22 or newer
- pnpm
- Docker Desktop running, or a local PostgreSQL database

## Setup

1. Pull the latest changes:

   ```bash
   git pull
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

4. Start PostgreSQL:

   ```bash
   docker compose up -d db
   ```

   If this fails with `failed to connect to the docker API`, open Docker Desktop and wait until it says the engine is running. Then run the command again.


5. Generate the Prisma client:

   ```bash
   pnpm prisma:generate
   ```

6. Run database migrations when models have been added:

   ```bash
   pnpm prisma:migrate
   ```

   If Prisma says there are no models or migrations yet, that is fine for the clean starter setup.

7. Start the API:

   ```bash
   pnpm start:dev
   ```

The API runs on `http://localhost:3001/api/v1` by default. Swagger is available at `http://localhost:3001/docs` when `SWAGGER_ENABLED=true`.

## Daily workflow

Before starting work each day, pull the latest changes from the shared branch:

```bash
git checkout main
git pull origin main
```

Then create or update your feature branch from the latest `main`.

If the API fails with `Environment variable not found: DATABASE_URL`, copy `.env.example` to `.env` and restart the API.

If Docker says port `5432` is unavailable, pull the latest setup files. This project maps Docker Postgres to local port `5435` so it does not fight with another local database.

## Useful commands

- `pnpm typecheck` checks TypeScript.
- `pnpm build` compiles the API.
- `pnpm test` runs tests.
- `pnpm prisma:studio` opens Prisma Studio.
