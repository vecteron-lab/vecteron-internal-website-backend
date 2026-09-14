# Vecteron Internal Website CMS - Backend Task Management

Use this file to track backend tasks for the Vecteron internal website CMS.

Tasks are based on the current backend repo and the website page mockups. Move items from `Backlog` to `In Progress`, `Review`, and `Done` as the team works.

---

# Backlog

## Foundation Next Steps

### CMS-002 - Shared API Helpers

- [ ] Create pagination DTO.
- [ ] Create standard list response shape.
- [ ] Create shared slug validation helper.
- [ ] Add consistent error handling patterns.

## Authentication & Admin Access

### CMS-003 - Admin Authentication

- [ ] Create user model.
- [ ] Create `auth` module, controller, service, and DTO folder.
- [ ] Implement password hashing.
- [ ] Implement JWT login.
- [ ] Add protected `GET /api/v1/admin/auth/session`.
- [ ] Add logout strategy for frontend token clearing.
- [ ] Add Swagger documentation.

### CMS-004 - Roles & Permissions

- [ ] Create role and permission models.
- [ ] Assign roles to users.
- [ ] Add admin route guards.
- [ ] Add permission checks for content management.

## Page CMS

### CMS-005 - Page Management API

- [ ] Create `pages` module, controller, service, and DTO folder.
- [ ] Create page model with title, slug, page type, status, SEO fields, and timestamps.
- [ ] Create page create, update, delete, detail, and list endpoints.
- [ ] Support draft and published states.

### CMS-006 - Page SEO Management

- [ ] Add SEO title.
- [ ] Add SEO description.
- [ ] Add meta keywords.
- [ ] Add OpenGraph image.
- [ ] Add canonical URL.

## Section CMS

### CMS-007 - Section Management API

- [ ] Create `sections` module, controller, service, and DTO folder.
- [ ] Create section model connected to pages.
- [ ] Add section create, update, delete, detail, list, and reorder endpoints.
- [ ] Support hidden and visible states.
- [ ] Store flexible section content as JSON.

### CMS-008 - Section Types From Mockups

- [ ] Hero section.
- [ ] Service grid section.
- [ ] Sector cards section.
- [ ] Impact metrics section.
- [ ] Case study section.
- [ ] Blog preview section.
- [ ] Team or leadership section.
- [ ] FAQ section.
- [ ] CTA section.
- [ ] Contact form section.
- [ ] Footer content section.

## Website Pages From Mockups

### CMS-009 - Homepage Content

- [ ] Manage hero copy and hero media.
- [ ] Manage solution/service cards.
- [ ] Manage industry expertise cards.
- [ ] Manage leadership or team highlights.
- [ ] Manage success stories.
- [ ] Manage latest insights.
- [ ] Manage final CTA.

### CMS-010 - About / Company Page Content

- [ ] Manage company overview.
- [ ] Manage mission and vision content.
- [ ] Manage executive leadership content.
- [ ] Manage company values or capability sections.
- [ ] Manage company timeline or capacity sections.

### CMS-011 - Services / Solutions Page Content

- [ ] Manage service categories.
- [ ] Manage service detail sections.
- [ ] Manage cloud transformation content.
- [ ] Manage cybersecurity content.
- [ ] Manage infrastructure content.
- [ ] Manage AI or data strategy content.

### CMS-012 - Sector / Industry Pages

- [ ] Manage sector list.
- [ ] Manage sector detail pages.
- [ ] Manage sector hero content.
- [ ] Manage sector-specific services.
- [ ] Manage sector case studies.

### CMS-013 - Impact Page Content

- [ ] Manage impact metrics.
- [ ] Manage transformation stories.
- [ ] Manage customer satisfaction content.
- [ ] Manage social impact content.
- [ ] Manage downloadable reports.

### CMS-014 - Blog / Insights Content

- [ ] Create blog post model.
- [ ] Create blog category model.
- [ ] Create blog tag model.
- [ ] Add draft and publish workflow.
- [ ] Add featured image support.
- [ ] Add list, detail, create, update, and delete endpoints.

### CMS-015 - Contact Page & Lead Capture

- [ ] Create contact submission endpoint.
- [ ] Validate contact form input.
- [ ] Save contact messages.
- [ ] Add admin list and detail endpoints.
- [ ] Add status values: new, contacted, qualified, closed.
- [ ] Add mark-as-read endpoint.

## Media Library

### CMS-016 - Media Uploads

- [ ] Create `media` module, controller, service, and DTO folder.
- [ ] Add image upload endpoint.
- [ ] Validate file type and size.
- [ ] Store file metadata.
- [ ] Connect media to pages, sections, blog posts, and team members.

### CMS-017 - Media Library Management

- [ ] List media files.
- [ ] Search media files.
- [ ] Delete media files.
- [ ] Add pagination.

## Navigation & Site Settings

### CMS-018 - Header Navigation

- [ ] Create navigation item model.
- [ ] Add create, update, delete, and reorder endpoints.
- [ ] Support nested menu items if needed.

### CMS-019 - Footer Navigation & Company Info

- [ ] Manage footer links.
- [ ] Manage company address.
- [ ] Manage phone and email.
- [ ] Manage social links.
- [ ] Manage logo and favicon.

## Dashboard & Activity

### CMS-020 - Admin Dashboard

- [ ] Add total pages widget.
- [ ] Add total blog posts widget.
- [ ] Add total media files widget.
- [ ] Add total contact messages widget.
- [ ] Add recent activity feed.

### CMS-021 - Audit Logging

- [ ] Log content create, update, publish, unpublish, and delete actions.
- [ ] Log login activity.
- [ ] Log media uploads and deletes.
- [ ] Add admin audit log list endpoint.

---

# In Progress

<!-- Move tasks here when work starts. -->

---

# Review

### CMS-001 - Prisma Database Models

- [x] Create core Prisma models for pages, sections, media, users, roles, contact messages, blog posts, and audit logs.
- [x] Add enum values for page type, section type, publish status, contact status, and user role.
- [x] Create the first Prisma migration.
- [x] Regenerate Prisma Client.

---

# Done

### CMS-000 - Clean Backend Starter Setup

- [x] Set up NestJS project structure.
- [x] Configure pnpm as the package manager.
- [x] Configure PostgreSQL through Docker Compose.
- [x] Configure Prisma schema and Prisma service.
- [x] Add health module with database readiness check.
- [x] Add local setup documentation.
- [x] Add coding best practices documentation.
- [x] Add naming conventions documentation.
- [x] Add GitHub Actions CI using pnpm.
