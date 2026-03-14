import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogRepo: Repository<BlogPost>,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: BlogPost[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.blogRepo.findAndCount({
      where: { published: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.blogRepo.findOneBy({ slug });
    if (!post) {
      throw new NotFoundException(`Blog post "${slug}" not found`);
    }
    return post;
  }

  async create(dto: CreateBlogPostDto): Promise<BlogPost> {
    const slug = dto.slug || this.generateSlug(dto.title);

    const existing = await this.blogRepo.findOneBy({ slug });
    if (existing) {
      throw new ConflictException(`A post with slug "${slug}" already exists`);
    }

    const post = this.blogRepo.create({ ...dto, slug });
    return this.blogRepo.save(post);
  }

  async update(slug: string, dto: UpdateBlogPostDto): Promise<BlogPost> {
    const post = await this.findBySlug(slug);

    if (dto.slug && dto.slug !== slug) {
      const conflict = await this.blogRepo.findOneBy({ slug: dto.slug });
      if (conflict) {
        throw new ConflictException(`A post with slug "${dto.slug}" already exists`);
      }
    }

    Object.assign(post, dto);
    return this.blogRepo.save(post);
  }

  async remove(slug: string): Promise<void> {
    const post = await this.findBySlug(slug);
    await this.blogRepo.remove(post);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
