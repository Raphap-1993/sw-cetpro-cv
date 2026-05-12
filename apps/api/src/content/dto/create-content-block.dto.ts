import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateContentBlockDto {
  @IsString()
  page!: string;

  @IsString()
  key!: string;

  @IsIn(["HERO", "SECTION", "CTA", "TEXT", "IMAGE", "FAQ"])
  type!: "HERO" | "SECTION" | "CTA" | "TEXT" | "IMAGE" | "FAQ";

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

