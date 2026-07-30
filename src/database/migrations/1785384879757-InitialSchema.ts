import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1785384879757 implements MigrationInterface {
  name = 'InitialSchema1785384879757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "profile" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "title" varchar NOT NULL,
        "bio" text NOT NULL,
        "avatarUrl" varchar,
        "resumeUrl" varchar,
        "location" varchar,
        "email" varchar,
        "githubUrl" varchar,
        "linkedinUrl" varchar,
        "websiteUrl" varchar,
        "hireable" boolean DEFAULT false,
        "hirePlatforms" text,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "project" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "techStack" text NOT NULL,
        "githubUrl" varchar,
        "liveUrl" varchar,
        "imageUrl" varchar,
        "featured" boolean DEFAULT false,
        "order" integer DEFAULT 0,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "skill" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "category" varchar NOT NULL,
        "proficiency" integer,
        "icon" varchar,
        "order" integer DEFAULT 0,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "experience" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "company" varchar NOT NULL,
        "role" varchar NOT NULL,
        "description" text,
        "startDate" date NOT NULL,
        "endDate" date,
        "current" boolean DEFAULT false,
        "location" varchar,
        "companyUrl" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "education" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "institution" varchar NOT NULL,
        "degree" varchar NOT NULL,
        "field" varchar,
        "startYear" integer NOT NULL,
        "endYear" integer,
        "gpa" varchar,
        "logo" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "certification" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "issuer" varchar NOT NULL,
        "date" date NOT NULL,
        "expiryDate" date,
        "credentialUrl" varchar,
        "logo" varchar,
        "description" text,
        "order" integer DEFAULT 0,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "contact" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "subject" varchar NOT NULL,
        "message" text NOT NULL,
        "read" boolean DEFAULT false,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "blog_post" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "title" varchar NOT NULL,
        "slug" varchar NOT NULL,
        "content" text NOT NULL,
        "excerpt" text,
        "coverImage" varchar,
        "published" boolean DEFAULT false,
        "tags" text,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "blog_post"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "contact"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "certification"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "education"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "experience"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "skill"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "profile"`);
  }
}
