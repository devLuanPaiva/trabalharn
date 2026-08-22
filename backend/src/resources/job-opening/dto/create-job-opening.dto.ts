import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateJobOpeningDto {
  @ApiProperty({ maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({ maxLength: 120, example: 'R$ 1.800,00' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  wage?: string;

  @ApiPropertyOptional({ maxLength: 120, example: '44h semanais' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  workingHours?: string;

  @ApiPropertyOptional({ maxLength: 60, example: 'CLT' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  contractType?: string;

  @ApiPropertyOptional({ maxLength: 160, example: 'Natal, RN' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  location?: string;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(160)
  companyEmail?: string;

  @ApiPropertyOptional({ maxLength: 160, example: '(84) 99999-0000' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  companyContact?: string;

  @ApiProperty({ maxLength: 80, example: 'gupy' })
  @IsString()
  @MaxLength(80)
  source: string;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  externalId?: string;

  @ApiProperty({ maxLength: 2048 })
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  postUrl: string;

  @ApiProperty({
    maxLength: 64,
    description:
      'Fingerprint used to identify and deduplicate a job opening coming from the source portal',
  })
  @IsString()
  @MaxLength(64)
  hash: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedAt?: Date;

  @ApiPropertyOptional({
    maxLength: 120,
    description: 'Facebook Graph API post id, set after publishing to the page',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  facebookPostId?: string;

  @ApiPropertyOptional({
    maxLength: 120,
    description:
      'Instagram Graph API media id, set after publishing to the account',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  instagramMediaId?: string;

  @ApiPropertyOptional({
    description:
      'Snapshot of the JobPostingDto sent to /post-generator/generate, replayed later by the publish queue',
  })
  @IsOptional()
  @IsObject()
  postGeneratorPayload?: Record<string, unknown>;
}
