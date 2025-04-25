import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'node:path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '..', '..', 'db.sqlite'),
  synchronize: true,          // ⚠️ sólo en desarrollo
  logging: false,
  entities: [path.join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
});
