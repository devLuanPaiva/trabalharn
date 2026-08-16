import { Module } from '@nestjs/common';
import { PostGeneratorFontRepository } from './fonts/post-generator-font.repository';
import { PostGeneratorController } from './post-generator.controller';
import { PostGeneratorService } from './post-generator.service';
import { JobPostImageRenderer } from './rendering/job-post-image.renderer';

@Module({
  controllers: [PostGeneratorController],
  providers: [
    PostGeneratorService,
    JobPostImageRenderer,
    PostGeneratorFontRepository,
  ],
})
export class PostGeneratorModule {}
