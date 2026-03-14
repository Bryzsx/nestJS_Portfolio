import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
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

const databaseUrl = process.env.DATABASE_URL;

const typeOrmConfig: any = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: true,
    }
  : {
      type: 'better-sqlite3',
      database: 'portfolio.db',
      autoLoadEntities: true,
      synchronize: true,
    };

@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule {}
