import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString, IsUrl, IsDateString } from "class-validator";

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

function trimOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

export class CreateBlogPostDto {
  @Transform(({ value }) => trimString(value))
  @IsString()
  title!: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  slug!: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  category!: string;

  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsString()
  excerpt?: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  body!: string;

  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsUrl({ require_protocol: true })
  coverImageUrl?: string;

  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsString()
  seoDescription?: string;

  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status!: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
