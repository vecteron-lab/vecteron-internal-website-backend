# Coding best practices

## NestJS structure

Each API feature should live in its own folder under `src`.

```text
src/
  feature-name/
    dto/
    feature-name.controller.ts
    feature-name.module.ts
    feature-name.service.ts
```

Keep controllers focused on HTTP concerns, validation, and response status. Put business logic in services. Use DTOs for request validation and avoid accepting untyped request bodies.

## Database access

Use `PrismaService` for database access. Keep Prisma queries in services, and avoid calling Prisma directly from controllers.

When changing data shape:

1. Update `prisma/schema.prisma`.
2. Create a migration with `pnpm prisma:migrate`.
3. Regenerate the client with `pnpm prisma:generate`.
4. Add or update tests for the behavior.

## API behavior

- Use the global `/api/v1` prefix.
- Validate all incoming request data with DTO classes.
- Keep public and admin endpoints clearly separated.
- Return consistent response shapes from each feature.
- Do not expose secrets, password hashes, tokens, or internal stack traces.

## Team workflow

- Pull the latest changes before starting work each day.
- Create a feature branch from the latest `main`.
- Keep pull requests focused on one feature or fix.
- Include migration notes when the database changes.
- Run `pnpm typecheck`, `pnpm build`, and `pnpm test` before requesting review.

Recommended start-of-work flow:

```bash
git checkout main
git pull origin main
git checkout -b feature/task-name
```

## Branch naming

Name branches after the task you are working on. Use lowercase kebab-case and keep the name short but clear.

Use these prefixes:

- `feature/` for new features.
- `fix/` for bug fixes.
- `chore/` for maintenance, setup, docs, or cleanup.
- `refactor/` for code changes that do not change behavior.

Examples:

```text
feature/create-content-api
feature/admin-login
fix/contact-request-validation
chore/update-local-setup-docs
refactor/prisma-service
```

If the task has an ID, put it before the task name:

```text
feature/123-create-content-api
fix/124-contact-request-validation
```
