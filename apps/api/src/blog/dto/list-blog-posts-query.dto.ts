import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString } from "class-validator";

function trimOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

export class ListBlogPostsQueryDto {
  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsString()
  q?: string;
}
