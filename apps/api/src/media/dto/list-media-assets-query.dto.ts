import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString } from "class-validator";

function toOptionalTrimmedString(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

export class ListMediaAssetsQueryDto {
  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @IsOptional()
  @IsIn(["IMAGE", "DOCUMENT", "VIDEO", "OTHER"])
  type?: "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER";

  @IsOptional()
  @Transform(({ value }) => toOptionalTrimmedString(value))
  @IsString()
  q?: string;
}
