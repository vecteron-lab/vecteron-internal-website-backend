# Vecteron internal website CMS backend

NestJS backend for the Vecteron internal website CMS.

## Stack

- NestJS
- PostgreSQL
- Prisma ORM
- pnpm

## Getting started

See [local setup](docs/local-setup.md).

## Project structure

API features should be organized by folder:

```text
src/
  feature-name/
    dto/
    feature-name.controller.ts
    feature-name.module.ts
    feature-name.service.ts
```

Current foundation:

```text
src/
  health/
  prisma/
  app.module.ts
  main.ts
prisma/
  schema.prisma
```

## Team docs

- [Local setup](docs/local-setup.md)
- [Coding best practices](docs/coding-best-practices.md)
- [Naming conventions](docs/naming-conventions.md)
- [Task management](docs/task-management.md)

## Commands

- `pnpm start:dev`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test`
- `pnpm prisma:generate`
- `pnpm prisma:migrate`
