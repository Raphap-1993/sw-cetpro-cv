import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

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

function toOptionalInteger(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? value : parsed;
}

export class CreatePublicDocumentDto {
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
  summary?: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  mediaAssetId!: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  linkedPageKey!: string;

  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsString()
  linkedSectionKey?: string;

  @IsOptional()
  @Transform(({ value }) => toOptionalInteger(value))
  @IsInt()
  @Min(0)
  position?: number;

  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status!: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}
