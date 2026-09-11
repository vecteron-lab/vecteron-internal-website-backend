import 'dotenv/config';

export function configuration() {
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;
  if (!databaseUrl || !/^postgres(ql)?:\/\//.test(databaseUrl)) throw new Error('DATABASE_URL must be a PostgreSQL URL');
  if (!jwtSecret || jwtSecret.length < 32 || jwtSecret.startsWith('replace-with-')) throw new Error('Set JWT_SECRET to a random secret of at least 32 characters');
  const port = Number(process.env.PORT || 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535');
  const origins = (process.env.FRONTEND_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean);
  if (!origins.length || origins.some(v => { try { return new URL(v).origin !== v; } catch { return true; } })) throw new Error('FRONTEND_ORIGINS must contain explicit origins without trailing slashes');
  return { databaseUrl, jwtSecret, port, origins, swagger: process.env.SWAGGER_ENABLED === 'true' };
}
