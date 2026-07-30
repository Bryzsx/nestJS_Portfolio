import { DataSource } from 'typeorm';

const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = databaseUrl
  ? new DataSource({
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/database/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
    })
  : new DataSource({
      type: 'better-sqlite3',
      database: 'portfolio.db',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/database/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
    });
