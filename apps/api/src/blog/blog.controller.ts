import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { ListBlogPostsQueryDto } from "./dto/list-blog-posts-query.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";
import { BlogService } from "./blog.service";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Get("admin")
  findAll(@Query() query: ListBlogPostsQueryDto) {
    return this.blogService.findAll(query);
  }

  @Public()
  @Get()
  findPublished() {
    return this.blogService.findPublished();
  }

  @Public()
  @Get(":slug")
  findPublishedBySlug(@Param("slug") slug: string) {
    return this.blogService.findPublishedBySlug(slug);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Post()
  create(@Body() dto: CreateBlogPostDto) {
    return this.blogService.create(dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.update(id, dto);
  }

  @Roles("SUPER_ADMIN", "CONTENT_EDITOR")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.blogService.remove(id);
  }
}
