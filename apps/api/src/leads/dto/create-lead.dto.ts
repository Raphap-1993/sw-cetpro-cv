import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength
} from "class-validator";

export class CreateLeadDto {
  @IsString()
  @MinLength(3)
  fullName!: string;

  @IsString()
  @MinLength(6)
  @Matches(/^[0-9+\-\s()]{6,20}$/)
  phone!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  programId?: string;
}
