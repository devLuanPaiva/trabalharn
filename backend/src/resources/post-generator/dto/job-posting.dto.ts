import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class JobPostingDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  jobTitle: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  contractType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  salary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  workSchedule?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  vacancyCount?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  requirements?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(140)
  applicationInstructions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  storyFooterText?: string;
}
