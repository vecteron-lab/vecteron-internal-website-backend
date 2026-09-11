import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Admin, Content, ContactRequest } from './entities';
import { InitialSchema1788393600000 } from './migrations/1788393600000-initial-schema';

export const databaseOptions: PostgresConnectionOptions = {
  type: 'postgres', url: process.env.DATABASE_URL,
  entities: [Admin, Content, ContactRequest], migrations: [InitialSchema1788393600000],
  synchronize: false, migrationsRun: false,
};

export default new DataSource(databaseOptions);
