import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";

export class UpsertPageSeoDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  canonicalUrl?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  ogImageUrl?: string;

  @IsOptional()
  @IsString()
  ogTitle?: string;

  @IsOptional()
  @IsString()
  ogDescription?: string;

  @IsOptional()
  @IsBoolean()
  robotsIndex?: boolean;

  @IsOptional()
  @IsBoolean()
  robotsFollow?: boolean;
}
