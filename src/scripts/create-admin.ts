import { hash } from 'bcryptjs';
import { isEmail } from 'class-validator';
import dataSource from '../database/data-source';
import { Admin } from '../database/entities';

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !isEmail(email) || !password || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters, at most 72 UTF-8 bytes)');
  await dataSource.initialize();
  try {
    const repo = dataSource.getRepository(Admin);
    if (await repo.existsBy({ email })) throw new Error('Admin already exists; no changes made');
    await repo.save(repo.create({ email, passwordHash: await hash(password, 12) }));
    console.log('Admin created successfully');
  } finally { await dataSource.destroy(); }
}
main().catch(() => { console.error('Admin creation failed. Check credentials, database, migrations, and whether the account already exists.'); process.exitCode = 1; });
