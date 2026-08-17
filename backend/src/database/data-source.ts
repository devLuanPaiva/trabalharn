import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { buildPostgresConnectionOptions } from './typeorm-options.factory';

loadEnv();

export default new DataSource(
  buildPostgresConnectionOptions({
    DB_HOST: process.env.DB_HOST ?? '',
    DB_PORT: Number(process.env.DB_PORT ?? 5432),
    DB_USERNAME: process.env.DB_USERNAME ?? '',
    DB_PASSWORD: process.env.DB_PASSWORD ?? '',
    DB_DATABASE: process.env.DB_DATABASE ?? '',
    DB_SSL: process.env.DB_SSL,
  }),
);
