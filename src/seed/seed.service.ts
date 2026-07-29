import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { Project } from '../projects/project.entity';
import { Skill } from '../skills/skill.entity';
import { SkillCategory } from '../skills/skill-category.enum';
import { Experience } from '../experience/experience.entity';
import { ExperienceType } from '../experience/experience-type.enum';
import { Education } from '../education/education.entity';
import { Certification } from '../certifications/certification.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Skill) private skillRepo: Repository<Skill>,
    @InjectRepository(Experience) private experienceRepo: Repository<Experience>,
    @InjectRepository(Education) private educationRepo: Repository<Education>,
    @InjectRepository(Certification) private certRepo: Repository<Certification>,
  ) {}

  async seed(force = false) {
    const projectCount = await this.projectRepo.count();
    if (projectCount > 0 && !force) {
      this.logger.log('Database already seeded, skipping. Use /seed/force to reseed.');
      return { message: 'Already seeded. POST /seed/force to reseed.' };
    }

    await this.clear();
    await this.seedProfile();
    await this.seedSkills();
    await this.seedExperience();
    await this.seedProjects();
    await this.seedEducation();
    await this.seedCertifications();

    this.logger.log('Database seeded successfully!');
    return { message: 'Seeded successfully' };
  }

  private async clear() {
    await this.certRepo.clear();
    await this.educationRepo.clear();
    await this.projectRepo.clear();
    await this.experienceRepo.clear();
    await this.skillRepo.clear();
    await this.profileRepo.clear();
  }

  private async seedProfile() {
    await this.profileRepo.save(
      this.profileRepo.create({
        name: 'Bryce A. Corvera',
        title: 'Full Stack Web Developer',
        bio: 'BSIT graduate and Full Stack Web Developer skilled in Python, NestJS, React, and JavaScript/TypeScript. Experienced in building scalable web apps, APIs, system integrations, and applying cybersecurity practices through projects and CTF competitions.',
        avatarUrl: '/images/profile.png',
        githubUrl: 'https://github.com/Bryzsx',
        linkedinUrl: 'https://www.linkedin.com/in/bryce-corvera-520863321',
        email: 'bryce.corvera21@gmail.com',
        phone: '0939-266-5553',
        resumeUrl: '/resume.pdf',
        availableForWork: true,
        hirePlatforms: [
          { name: 'OnlineJobs.ph', url: 'https://www.onlinejobs.ph/jobseekers/info/3637372' },
          { name: 'Virtual Coworker', url: '#' },
          { name: 'LinkedIn', url: 'https://www.linkedin.com/in/bryce-corvera-520863321' },
        ],
        location: 'Baan Km3 Butuan City',
        birthDate: 'July 21, 2002',
        age: '24 y/o',
        citizenship: 'Filipino',
        role: 'Web Developer',
      }),
    );
  }

  private async seedSkills() {
    const skills = [
      { name: 'Python (Flask, Django)', category: SkillCategory.WEB_BACKEND, proficiency: 90 },
      { name: 'JavaScript / TypeScript', category: SkillCategory.WEB_BACKEND, proficiency: 85 },
      { name: 'NestJS', category: SkillCategory.WEB_BACKEND, proficiency: 75 },
      { name: 'React / Next.js', category: SkillCategory.WEB_BACKEND, proficiency: 70 },
      { name: 'API Design & Development', category: SkillCategory.WEB_BACKEND, proficiency: 85 },
      { name: 'Authentication & Security', category: SkillCategory.WEB_BACKEND, proficiency: 80 },
      { name: 'System Integration', category: SkillCategory.WEB_BACKEND, proficiency: 80 },
      { name: 'HTML & CSS / TailwindCSS', category: SkillCategory.WEB_BACKEND, proficiency: 90 },
      { name: 'Basic PHP', category: SkillCategory.WEB_BACKEND, proficiency: 50 },
      { name: 'Database Design & Management', category: SkillCategory.SEO_DATABASE, proficiency: 85 },
      { name: 'MySQL', category: SkillCategory.SEO_DATABASE, proficiency: 80 },
      { name: 'PostgreSQL', category: SkillCategory.SEO_DATABASE, proficiency: 75 },
      { name: 'Supabase', category: SkillCategory.SEO_DATABASE, proficiency: 70 },
      { name: 'Linux (Ubuntu / Kali)', category: SkillCategory.LINUX, proficiency: 80 },
      { name: 'Server Management', category: SkillCategory.SERVER, proficiency: 75 },
      { name: 'Tailscale', category: SkillCategory.SERVER, proficiency: 70 },
      { name: 'Cybersecurity Fundamentals', category: SkillCategory.CYBERSECURITY, proficiency: 75 },
      { name: 'System Hardening', category: SkillCategory.CYBERSECURITY, proficiency: 70 },
      { name: 'Vulnerability Assessment', category: SkillCategory.CYBERSECURITY, proficiency: 70 },
      { name: 'Deployment Workflows', category: SkillCategory.CLOUD, proficiency: 75 },
      { name: 'Git / GitHub', category: SkillCategory.CLOUD, proficiency: 85 },
      { name: 'Postman', category: SkillCategory.CLOUD, proficiency: 80 },
      { name: 'AI-Assisted Development', category: SkillCategory.OTHER, proficiency: 90 },
      { name: 'Adaptability', category: SkillCategory.SOFT, proficiency: 90 },
      { name: 'Critical Thinking', category: SkillCategory.SOFT, proficiency: 90 },
      { name: 'Problem Solving', category: SkillCategory.SOFT, proficiency: 90 },
      { name: 'Team Collaboration', category: SkillCategory.SOFT, proficiency: 85 },
      { name: 'Technical Communication', category: SkillCategory.SOFT, proficiency: 80 },
    ];

    for (const skill of skills) {
      await this.skillRepo.save(this.skillRepo.create(skill));
    }
  }

  private async seedExperience() {
    const entries = [
      {
        company: 'North Noir',
        role: 'Full-Stack Developer',
        description:
          'Developed and maintained full-stack web application features. Built responsive user interfaces and integrated backend services. Collaborated on deployment, performance optimization, and system maintenance for client-facing applications.',
        startDate: '2021-02',
        endDate: '2022-12',
        type: ExperienceType.WORK,
        achievement: 'Full-stack development of production web applications with end-to-end feature ownership.',
        images: [],
      },
      {
        company: 'DOTr Region 13',
        role: 'IT Intern / Developer',
        description:
          'Developed and deployed a face recognition biometric system for secure identity verification. Built backend services, authentication, and system integrations. Configured and managed remote server access using Ubuntu and Tailscale to ensure secure, cross-platform network connectivity.',
        startDate: '2025-12',
        endDate: '2026-03',
        type: ExperienceType.WORK,
        achievement: 'Deployed a production Face Recognition Biometric System in a government IT environment.',
        images: ['/images/dotr-group.png', '/images/dotr-team.png', '/images/dotr-training.png'],
      },
      {
        company: 'DICT',
        role: 'Hack4Gov Cybersecurity Competitor',
        description:
          'Secured 8th place in the Hack4Gov cybersecurity hackathon, applying digital forensics, cryptography, and network analysis to solve secure system and threat mitigation challenges under time pressure.',
        startDate: '2026-01',
        endDate: null,
        type: ExperienceType.WORK,
        achievement: '8th Place Finisher — Hack4Gov cybersecurity hackathon by DICT.',
        images: ['/images/hack4gov-team.png', '/images/hack4gov-stage.png', '/images/hack4gov-certs.png'],
      },
    ];

    for (const entry of entries) {
      await this.experienceRepo.save(this.experienceRepo.create(entry));
    }
  }

  private async seedProjects() {
    const projects = [
      {
        title: 'Face Recognition Biometric System',
        description:
          'Identity verification and secure access system deployed at DOTr Region 13 and used for daily access control. Deployed in a government office and used for daily access control.',
        techStack: ['Python', 'OpenCV', 'Ubuntu', 'Tailscale'],
        featured: true,
        order: 1,
        images: ['/images/bio-dashboard.png', '/images/bio-login.png', '/images/bio-scanning.png', '/images/bio-recognized.png'],
        liveUrl: '',
        repoUrl: 'https://github.com/Bryzsx/face-recognition-biometric-system',
      },
      {
        title: 'North Noir',
        description:
          'North Noir does motion graphics with custom models. Ruvil, our custom motion graphics model, designs and renders complete motion graphics videos from a single prompt — and the platform around it handles everything else a video needs: script, narration, thumbnails, and five more visual styles.',
        techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        featured: true,
        order: 2,
        images: [],
        liveUrl: 'https://northnoir.com/',
        repoUrl: '',
      },
      {
        title: 'SMART Home Automation',
        description:
          'Miniature smart home model with automated lighting and gate control via voice commands, demonstrating IoT and Python backend integration. Demonstrates IoT control, voice commands, and Python backend integration.',
        techStack: ['Raspberry Pi 4', 'Python (Flask)', 'Alexa Echo Dot', 'Servo Motor', 'LED Lights'],
        featured: true,
        order: 3,
        images: ['/images/smart-home.png'],
        liveUrl: '',
        repoUrl: 'https://github.com/Bryzsx/smart-home-automation',
      },
      {
        title: 'Kainos Tees',
        description:
          'E-commerce storefront for custom apparel — developed with modern frontend tooling and integrated with backend services for product management and checkout.',
        techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
        featured: true,
        order: 4,
        images: [],
        liveUrl: 'https://kainos-tees.vercel.app/',
        repoUrl: '',
      },
      {
        title: 'Wonder Table',
        description:
          'An Android-based Augmented Reality learning tool for periodic elements with quiz modes and 3D AR visualization, published in an international multidisciplinary research journal. Backed by a published research paper in an international journal.',
        techStack: ['Unity', 'C#', 'AR Foundation', 'Android'],
        featured: true,
        order: 5,
        images: ['/images/wonder-home.png', '/images/wonder-quiz.png', '/images/wonder-question.png', '/images/wonder-ar.png'],
        liveUrl: 'https://doi.org/10.62127/aijmr.2026.v04i02.1208',
        repoUrl: 'https://github.com/Bryzsx/wonder-table',
      },
      {
        title: 'NLCF Website',
        description:
          'Church community website featuring event management, sermon archives, and member engagement — built with a focus on clean UI and content management.',
        techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
        featured: true,
        order: 6,
        images: [],
        liveUrl: 'https://nlcf-website.vercel.app/',
        repoUrl: '',
      },
      {
        title: 'PawFect — Pet Adoption App',
        description:
          'A full-stack mobile application for pet adoption that connects shelters and pet owners with potential adopters, mirroring real adoption workflows with authentication, listings, and approve/reject request management. Imitates real-world pet adoption workflows with listings and approvals.',
        techStack: ['TypeScript', 'React Native', 'Python', 'REST API', 'Mobile UI/UX'],
        featured: true,
        order: 7,
        images: ['/images/Pawfect1.jpg', '/images/Pawfect2.jpg', '/images/Pawfect3.jpg', '/images/Pawfect4.jpg'],
        liveUrl: '',
        repoUrl: 'https://github.com/Bryzsx/pawfect-pet-adoption',
      },
      {
        title: 'Portfolio Website',
        description:
          'Personal portfolio site built with NestJS on Vercel — features a dynamic frontend with a NestJS backend, TypeORM database, and responsive design.',
        techStack: ['NestJS', 'TypeScript', 'TypeORM', 'PostgreSQL', 'HTML/CSS/JS'],
        featured: true,
        order: 8,
        images: [],
        liveUrl: 'https://nest-js-portfolio-three.vercel.app/',
        repoUrl: 'https://github.com/Bryzsx/nestJS_Portfolio',
      },
    ];

    for (const project of projects) {
      await this.projectRepo.save(this.projectRepo.create(project));
    }
  }

  private async seedEducation() {
    const entries = [
      {
        degree: 'Bachelor of Science in Information Technology',
        school: 'ACLC College of Butuan',
        location: 'Butuan City, Philippines',
        startYear: 2022,
        endYear: 2026,
        order: 1,
      },
    ];

    for (const entry of entries) {
      await this.educationRepo.save(this.educationRepo.create(entry));
    }
  }

  private async seedCertifications() {
    const certs = [
      {
        title: 'The Complete Full-Stack Web Development Bootcamp',
        platform: 'Udemy',
        instructor: 'Dr. Angela Yu',
        date: 'Sept. 4, 2025',
        hours: '61.5 total hours',
        imageUrl: '/images/cert-udemy.png',
        credentialUrl: '',
        order: 1,
      },
      {
        title:
          'Wonder Table: An Android Based Augmented Reality Learning Tool for Periodic Elements (AIJMR Publication)',
        platform: 'Advanced International Journal of Multidisciplinary Research (AIJMR)',
        instructor: '',
        date: 'Vol. 4, Issue 2 (Mar–Apr 2026)',
        hours: '',
        imageUrl: '/images/aijmr-wonder-table-cert.png',
        credentialUrl: 'https://doi.org/10.62127/aijmr.2026.v04i02.1208',
        order: 2,
      },
      {
        title: 'Cyber Security Sentinel Training',
        platform: 'WorldTech Information Solutions Inc.',
        instructor: 'Robert L. Arquiza & Elizabeth C. Arquiza (Trainers)',
        date: 'June 26–30, 2023',
        hours: '',
        imageUrl: '/images/worldtech-cybersecurity-sentinel.png',
        credentialUrl: '',
        order: 3,
      },
    ];

    for (const cert of certs) {
      await this.certRepo.save(this.certRepo.create(cert));
    }
  }
}
