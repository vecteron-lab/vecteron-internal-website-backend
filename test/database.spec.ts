import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { databaseOptions } from '../src/database/data-source';
import { Content, ContentKind } from '../src/database/entities';

// Only use an empty, disposable database; CI provides one for this test.
const databaseTest = process.env.TEST_DATABASE_URL ? describe : describe.skip;
databaseTest('PostgreSQL migration and persistence', () => {
  let db: DataSource;
  beforeAll(async () => {
    db = new DataSource({ ...databaseOptions, url: process.env.TEST_DATABASE_URL });
    await db.initialize();
    await db.runMigrations();
  });
  afterAll(async () => { if (db?.isInitialized) await db.destroy(); });
  it('creates the schema and persists draft content', async () => {
    const repo = db.getRepository(Content);
    const item = await repo.save(repo.create({ kind: ContentKind.Portfolio, slug: `test-${Date.now()}`, title: 'Test', summary: 'Summary', body: 'Body' }));
    try {
      expect(item.published).toBe(false);
      expect(await repo.findOneBy({ id: item.id, published: true })).toBeNull();
      await repo.update(item.id, { published: true });
      expect(await repo.findOneBy({ id: item.id, published: true })).not.toBeNull();
    } finally { await repo.delete(item.id); }
  });
});
