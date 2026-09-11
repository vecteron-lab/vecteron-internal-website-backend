import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1788393600000 implements MigrationInterface {
  async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE admins (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email varchar NOT NULL UNIQUE,
      "passwordHash" varchar NOT NULL, active boolean NOT NULL DEFAULT true,
      "createdAt" timestamptz NOT NULL DEFAULT now())`);
    await q.query(`CREATE TABLE content (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), kind varchar NOT NULL CHECK (kind IN ('portfolio','services')),
      title varchar NOT NULL, slug varchar NOT NULL UNIQUE, summary text NOT NULL, body text NOT NULL,
      published boolean NOT NULL DEFAULT false, "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now())`);
    await q.query(`CREATE INDEX content_public_idx ON content (kind, published, "createdAt" DESC)`);
    await q.query(`CREATE TABLE contact_requests (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar NOT NULL, email varchar NOT NULL,
      subject varchar NOT NULL, message text NOT NULL,
      status varchar NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved')),
      "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now())`);
  }
  async down(q: QueryRunner): Promise<void> {
    await q.query('DROP TABLE contact_requests');
    await q.query('DROP TABLE content');
    await q.query('DROP TABLE admins');
  }
}
