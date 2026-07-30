import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as Joi from 'joi';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { ExperienceModule } from './experience/experience.module';
import { ContactModule } from './contact/contact.module';
import { BlogModule } from './blog/blog.module';
import { EducationModule } from './education/education.module';
import { CertificationsModule } from './certifications/certifications.module';
import { SeedModule } from './seed/seed.module';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const isVercel = !!process.env.VERCEL;
const databaseUrl = process.env.DATABASE_URL;
const isDev = process.env.NODE_ENV !== 'production';

const typeOrmConfig: any = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: isDev,
    }
  : {
      type: 'better-sqlite3',
      database: 'portfolio.db',
      autoLoadEntities: true,
      synchronize: isDev,
    };

const staticModule = isVercel
  ? []
  : [
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public'),
        exclude: [
          '/api/{*path}',
          '/profile/{*path}',
          '/profile',
          '/projects/{*path}',
          '/projects',
          '/skills/{*path}',
          '/skills',
          '/experience/{*path}',
          '/experience',
          '/contact/{*path}',
          '/contact',
          '/blog/{*path}',
          '/blog',
          '/education/{*path}',
          '/education',
          '/certifications/{*path}',
          '/certifications',
          '/seed/{*path}',
          '/seed',
          '/health',
        ],
      }),
    ];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        DATABASE_URL: Joi.string().optional().allow(''),
        API_KEY: Joi.string().min(8).required(),
        MAIL_HOST: Joi.string().optional().allow(''),
        MAIL_PORT: Joi.number().default(587),
        MAIL_SECURE: Joi.string().optional().allow(''),
        MAIL_USER: Joi.string().optional().allow(''),
        MAIL_PASS: Joi.string().optional().allow(''),
        MAIL_FROM: Joi.string().optional().allow(''),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 1000, limit: 10 }, { ttl: 60000, limit: 100 }]),
    ...staticModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ProfileModule,
    ProjectsModule,
    SkillsModule,
    ExperienceModule,
    ContactModule,
    BlogModule,
    EducationModule,
    CertificationsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
