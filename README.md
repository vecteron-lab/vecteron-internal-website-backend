# Vecteron website backend

Standalone NestJS + TypeScript API with PostgreSQL, Swagger and Postman. The public website and admin UI belong in the separate frontend repository.

## Local setup

Requires Node.js 22 or newer, npm, and PostgreSQL 17 (or Docker Compose).

1. Run `npm ci`.
2. Copy `.env.example` to `.env`; configure your database and frontend origins.
3. Generate a secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and set `JWT_SECRET` in `.env`.
4. Run `docker compose up -d db`, or provision PostgreSQL yourself and update `DATABASE_URL`.
5. Run `npm run migration:run`.
6. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the environment or `.env`, then run `npm run admin:create`. Passwords require at least 12 characters and at most 72 UTF-8 bytes. Remove these values after creation. Existing accounts are never overwritten.
7. Run `npm run start:dev`.

API: `http://localhost:3001/api/v1`. Swagger: `http://localhost:3001/docs`; OpenAPI JSON: `http://localhost:3001/docs-json`. Documentation is only served when `SWAGGER_ENABLED=true`.

## API contract

| Method | Path (after `/api/v1`) | Purpose |
| --- | --- | --- |
| GET | `/health` | Database readiness |
| GET | `/content?kind=portfolio` or `?kind=services` | Published content |
| GET | `/content/:slug` | Published content detail |
| POST | `/contact-requests` | Submit name, email, subject, message |
| POST | `/admin/auth/login` | Email/password login |
| GET | `/admin/auth/session` | Check admin authentication |
| GET / POST | `/admin/content` | List all content / create |
| GET / PATCH / DELETE | `/admin/content/:id` | Read / edit / delete |
| GET | `/admin/contact-requests` | Read contact submissions |
| PATCH | `/admin/contact-requests/:id` | Set status: `new`, `in_progress`, `resolved` |

All admin endpoints except login require `Authorization: Bearer <accessToken>`. Login returns `accessToken`, `tokenType`, `expiresIn` (900 seconds). Keep tokens in frontend memory, prompt for login after expiry, and discard them on logout. There is no public registration, refresh token or server-side logout endpoint. Deactivating an account in the database blocks existing tokens on subsequent requests. Initial accounts share one privilege level.

Lists accept `page` (default 1) and `limit` (default 20, maximum 100), returning `{ items, total, page, limit }`. Public reads never return drafts. Slugs are globally unique. Content creation requires `kind`, `title`, `slug`, `summary`, `body`; `published` defaults to false. Bodies are plain text: escape content when rendering. Uploads and rich HTML are outside this foundation.

```ts
const response = await fetch(`${backendUrl}/api/v1/content?kind=services`);
if (!response.ok) throw new Error('Unable to load services');
const { items } = await response.json();
```

Set `FRONTEND_ORIGINS` to exact frontend origins, comma separated, without trailing slashes. CORS is a browser policy; admin authorization is enforced independently. Unknown input fields are rejected. Errors use Nest's `{ statusCode, message, error }` shape; validation messages are arrays. Creates return 201; reads, login and updates 200; deletes 204. Errors: input 400, authentication 401, missing record 404, duplicate slug 409, rate limit 429.

## Validation and deployment

- Run `npm run typecheck`, `npm run build`, `npm test`.
- Import `postman/Vecteron.postman_collection.json`. Set `baseUrl`, `adminEmail`, `adminPassword` locally. Login saves `accessToken`. Do not commit exported credentials or tokens.
- CI runs tests against disposable PostgreSQL. Set `TEST_DATABASE_URL` to an empty test database to run migration/persistence tests locally; otherwise that suite is skipped.
- Production: `npm ci`, `npm run build`, apply migrations once, then `npm start`. Compiled migrations: `npx typeorm migration:run -d dist/database/data-source.js`. Automatic schema synchronization is disabled.
- Deploy behind HTTPS and configure database TLS according to your provider. Keep Swagger disabled unless intentionally exposed. The Compose database credentials are for local development only.
- Rate limits use in-process storage: 100/minute globally, 5/minute login, 3/minute contact submissions. Add shared throttling storage before multiple replicas. Configure reverse proxy trust for the actual hosting topology before relying on per-client IP limits.

## Collaboration and scope

See [requirements and open decisions](docs/requirements.md). Use feature branches and reviewed pull requests into `main`; include API contract, migration and validation notes. Coordinate contract changes with the frontend team. Maintainers must configure collaborator access and branch protection on GitHub.

References: [NestJS authentication](https://docs.nestjs.com/security/authentication), [TypeORM migrations](https://typeorm.io/docs/migrations/executing/).
