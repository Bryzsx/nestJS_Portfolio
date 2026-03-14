import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPost } from './blog-post.entity';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'List published blog posts with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.blogService.findAll(page, limit);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a blog post by slug' })
  findBySlug(@Param('slug') slug: string): Promise<BlogPost> {
    return this.blogService.findBySlug(slug);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Create a blog post (requires API key)' })
  create(@Body() dto: CreateBlogPostDto): Promise<BlogPost> {
    return this.blogService.create(dto);
  }

  @Patch(':slug')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Update a blog post (requires API key)' })
  update(
    @Param('slug') slug: string,
    @Body() dto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    return this.blogService.update(slug, dto);
  }

  @Delete(':slug')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Delete a blog post (requires API key)' })
  remove(@Param('slug') slug: string): Promise<void> {
    return this.blogService.remove(slug);
  }
}
