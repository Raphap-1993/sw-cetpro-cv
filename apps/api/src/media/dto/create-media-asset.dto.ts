import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString, IsUrl } from "class-validator";

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

function toOptionalTrimmedString(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

export class CreateMediaAssetDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  title!: string;

  @IsOptional()
  @Transform(({ value }) => toOptionalTrimmedString(value))
  @IsString()
  altText?: string;

  @Transform(({ value }) => toTrimmedString(value))
  @IsUrl({
    require_protocol: true
  })
  url!: string;

  @IsOptional()
  @IsIn(["IMAGE", "DOCUMENT", "VIDEO", "OTHER"])
  type?: "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER";

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}
