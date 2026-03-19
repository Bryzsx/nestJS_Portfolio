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
        title: 'Backend & Cybersecurity-Focused IT Professional',
        bio: 'BSIT graduate specializing in secure backend development and cybersecurity. I build production-ready web applications with Python, Flask, and NestJS, applying a security-first mindset from CTF competitions, vulnerability assessment, and hands-on network analysis work.',
        avatarUrl: '/images/profile.png',
        githubUrl: 'https://github.com/Bryzsx',
        linkedinUrl: 'https://www.linkedin.com/in/bryce-corvera-520863321',
        email: 'bryce.corvera21@gmail.com',
        phone: '0939-266-5563',
        resumeUrl: '/resume.pdf',
        availableForWork: true,
        hirePlatforms: [
          { name: 'OnlineJobs.ph', url: 'https://www.onlinejobs.ph/jobseekers/info/3637372' },
          { name: 'Virtual Coworker', url: '#' },
          { name: 'LinkedIn', url: 'https://www.linkedin.com/in/bryce-corvera-520863321' },
        ],
        location: 'Butuan City, Philippines',
        birthDate: 'July 21, 2002',
        age: '23 y/o',
        citizenship: 'Filipino',
        role: 'Web Developer',
      }),
    );
  }

  private async seedSkills() {
    const skills = [
      { name: 'Python (Primary)', category: SkillCategory.WEB_BACKEND, proficiency: 90 },
      { name: 'Flask (Primary)', category: SkillCategory.WEB_BACKEND, proficiency: 85 },
      { name: 'NestJS (Primary)', category: SkillCategory.WEB_BACKEND, proficiency: 70 },
      { name: 'Django', category: SkillCategory.WEB_BACKEND, proficiency: 70 },
      { name: 'HTML', category: SkillCategory.WEB_BACKEND, proficiency: 95 },
      { name: 'CSS', category: SkillCategory.WEB_BACKEND, proficiency: 90 },
      { name: 'Network Analysis', category: SkillCategory.CYBERSECURITY, proficiency: 75 },
      { name: 'Vulnerability Assessment', category: SkillCategory.CYBERSECURITY, proficiency: 70 },
      { name: 'Penetration Testing', category: SkillCategory.CYBERSECURITY, proficiency: 65 },
      { name: 'CTF', category: SkillCategory.CYBERSECURITY, proficiency: 70 },
      { name: 'Ubuntu', category: SkillCategory.LINUX, proficiency: 80 },
      { name: 'Kali Linux', category: SkillCategory.LINUX, proficiency: 75 },
      { name: 'Tailscale', category: SkillCategory.SERVER, proficiency: 70 },
      { name: 'Remote Server Admin', category: SkillCategory.SERVER, proficiency: 70 },
      { name: 'MySQL', category: SkillCategory.SEO_DATABASE, proficiency: 80 },
      { name: 'SQLite', category: SkillCategory.SEO_DATABASE, proficiency: 75 },
      { name: 'SEO', category: SkillCategory.SEO_DATABASE, proficiency: 70 },
      { name: 'PythonAnywhere', category: SkillCategory.CLOUD, proficiency: 75 },
      { name: 'Critical Thinking', category: SkillCategory.SOFT, proficiency: 90 },
      { name: 'Problem Solving', category: SkillCategory.SOFT, proficiency: 90 },
      { name: 'Team Collaboration', category: SkillCategory.SOFT, proficiency: 85 },
      { name: 'Adaptability', category: SkillCategory.SOFT, proficiency: 85 },
      { name: 'Technical Communication', category: SkillCategory.SOFT, proficiency: 80 },
    ];

    for (const skill of skills) {
      await this.skillRepo.save(this.skillRepo.create(skill));
    }
  }

  private async seedExperience() {
    const entries = [
      {
        company: 'DOTr Region 13',
        role: 'IT Intern / Developer',
        description:
          'Developed and deployed a Face Recognition Biometric System to streamline identity verification and secure access. Configured and managed remote server access using Ubuntu and Tailscale to ensure secure, cross-platform network connectivity for the biometric system.',
        startDate: '2025-12',
        endDate: '2026-03',
        type: ExperienceType.WORK,
        achievement: 'Deployed a Face Recognition Biometric System in a government IT environment.',
        images: ['/images/dotr-group.png', '/images/dotr-team.png', '/images/dotr-training.png'],
      },
      {
        company: 'DICT',
        role: 'Hack4Gov Cybersecurity Competitor',
        description:
          'Secured 9th place in the regional Hack4Gov cybersecurity hackathon. Applied digital forensics, cryptography fundamentals, and network analysis tools to solve defensive strategy scenarios in a timed, competitive environment.',
        startDate: '2025-10',
        endDate: null,
        type: ExperienceType.WORK,
        achievement: '9th Place Finisher — regional cybersecurity competition by DICT.',
        images: ['/images/hack4gov-team.png', '/images/hack4gov-stage.png', '/images/hack4gov-certs.png'],
      },
      {
        company: 'ACLC Butuan / Cypeer',
        role: 'Cypeer Cybersecurity Outreach — Libertad NHS',
        description:
          'Volunteer — conducted a community outreach program at Libertad National High School educating Grade 10 students about cybersecurity awareness and digital safety as part of ACLC Butuan\'s Cypeer organization.',
        startDate: '2025-02',
        endDate: null,
        type: ExperienceType.WORK,
        achievement: 'Community outreach educating students on cybersecurity awareness and digital safety.',
        images: ['/images/cypeer-1.png', '/images/cypeer-2.png', '/images/cypeer-3.png', '/images/cypeer-4.png'],
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
          'Identity verification and secure access system deployed at DOTr Region 13 and used for daily access control.',
        techStack: ['Python', 'OpenCV', 'Ubuntu', 'Tailscale'],
        featured: true,
        order: 1,
        images: ['/images/bio-dashboard.png', '/images/bio-login.png', '/images/bio-scanning.png', '/images/bio-recognized.png'],
      },
      {
        title: 'SMART Home Automation',
        description:
          'Miniature smart home model with automated lighting and gate control via voice commands, demonstrating IoT and Python backend integration.',
        techStack: ['Raspberry Pi 4', 'Python (Flask)', 'Alexa Echo Dot', 'Servo Motor', 'LED Lights'],
        featured: true,
        order: 2,
        images: ['/images/smart-home.png'],
      },
      {
        title: 'Wonder Table',
        description:
          'An Android-based Augmented Reality learning tool for periodic elements with quiz modes and 3D AR visualization, published in an international multidisciplinary research journal.',
        techStack: ['Unity', 'C#', 'AR Foundation', 'Android'],
        featured: true,
        order: 3,
        images: ['/images/wonder-home.png', '/images/wonder-quiz.png', '/images/wonder-question.png', '/images/wonder-ar.png'],
      },
      {
        title: 'PawFect — Pet Adoption App',
        description:
          'A full-stack mobile application for pet adoption that connects shelters and pet owners with potential adopters, mirroring real adoption workflows with authentication, listings, and approve/reject request management.',
        techStack: ['TypeScript', 'React Native', 'Python', 'REST API', 'Mobile UI/UX'],
        featured: true,
        order: 4,
        images: ['/images/Pawfect1.jpg', '/images/Pawfect2.jpg', '/images/Pawfect3.jpg', '/images/Pawfect4.jpg'],
      },
      {
        title: 'Portfolio Website',
        description:
          'Personal portfolio site — Flask on PythonAnywhere and NestJS on Vercel.',
        techStack: ['Python (Flask)', 'HTML/CSS', 'JavaScript'],
        featured: true,
        order: 5,
        images: [],
        liveUrl: 'https://zupzed.pythonanywhere.com/',
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
        school: 'ACLC Butuan College',
        location: 'Butuan City, Philippines',
        startYear: 2020,
        endYear: 2026,
        order: 1,
      },
      {
        degree: 'Senior High School',
        school: 'Agusan National High School',
        location: 'Butuan City, Philippines',
        startYear: 2019,
        endYear: 2020,
        order: 2,
      },
      {
        degree: 'Junior High School',
        school: 'Butuan Christian Community School',
        location: 'Butuan City, Philippines',
        startYear: 2015,
        endYear: 2018,
        order: 3,
      },
      {
        degree: 'Elementary Education',
        school: 'Butuan Christian Community School',
        location: 'Butuan City, Philippines',
        startYear: 2009,
        endYear: 2015,
        order: 4,
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
