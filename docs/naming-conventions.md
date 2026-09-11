# Naming conventions

## Files and folders

- Use kebab-case for folders and files.
- Name feature folders after the API resource, for example `content`, `users`, or `contact-requests`.
- Use NestJS suffixes consistently:
  - `*.module.ts`
  - `*.controller.ts`
  - `*.service.ts`
  - `*.dto.ts`
  - `*.spec.ts`

Examples:

```text
src/
  content/
    dto/
      create-content.dto.ts
      update-content.dto.ts
    content.controller.ts
    content.module.ts
    content.service.ts
    content.service.spec.ts
  contact-requests/
    dto/
      create-contact-request.dto.ts
      update-contact-request-status.dto.ts
    contact-requests.controller.ts
    contact-requests.module.ts
    contact-requests.service.ts
```

## Classes

- Use PascalCase for classes.
- Use clear NestJS class suffixes:
  - `ContentModule`
  - `ContentController`
  - `ContentService`
  - `CreateContentDto`

Examples:

```ts
export class ContentModule {}
export class ContentController {}
export class ContentService {}
export class CreateContentDto {}
export class UpdateContactRequestStatusDto {}
```

## Variables and functions

- Use camelCase for variables, functions, and methods.
- Use descriptive names over abbreviations.
- Use uppercase snake case for environment variables, for example `DATABASE_URL`.

Examples:

```ts
const contentSlug = 'about-vecteron';
const contactRequestId = 'request-id';

function buildContentSummary(body: string) {
  return body.slice(0, 160);
}

async function findPublishedContent() {
  return [];
}
```

Environment variable examples:

```text
DATABASE_URL=postgresql://vecteron:vecteron_local@localhost:5432/vecteron
FRONTEND_ORIGINS=http://localhost:3000,http://localhost:5173
SWAGGER_ENABLED=true
```

## API routes

- Use plural nouns for resources, for example `/content-items` or `/contact-requests`.
- Use kebab-case in route segments.
- Keep admin routes grouped under `/admin` when they require internal access.

Examples:

```text
GET /api/v1/content-items
POST /api/v1/contact-requests
GET /api/v1/admin/content-items
PATCH /api/v1/admin/contact-requests/:id
```

## Prisma models

- Use PascalCase for model names.
- Use camelCase for fields.
- Use plural table names through `@@map` when the database table needs a specific name.

Examples:

```prisma
model ContentItem {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("content_items")
}
```
