import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString } from "class-validator";

function toOptionalTrimmedString(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

export class UploadMediaAssetDto {
  @IsOptional()
  @Transform(({ value }) => toOptionalTrimmedString(value))
  @IsString()
  title?: string;

  @IsOptional()
  @Transform(({ value }) => toOptionalTrimmedString(value))
  @IsString()
  altText?: string;

  @IsOptional()
  @IsIn(["IMAGE", "DOCUMENT", "VIDEO", "OTHER"])
  type?: "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER";

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}
