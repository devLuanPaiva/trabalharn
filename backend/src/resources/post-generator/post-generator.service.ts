import { Injectable } from '@nestjs/common';
import { buildJobPostCaption } from './caption/job-post-caption.builder';
import { JobPostingDto } from './dto/job-posting.dto';
import { JobPostImageRenderer } from './rendering/job-post-image.renderer';
import { GeneratedPostResult } from './types/generated-post-result.type';
import { PostFormat } from './types/post-format.enum';

@Injectable()
export class PostGeneratorService {
  constructor(private readonly imageRenderer: JobPostImageRenderer) {}

  generatePost(jobPosting: JobPostingDto): GeneratedPostResult {
    return {
      feedImage: this.imageRenderer.renderToPngBuffer(
        jobPosting,
        PostFormat.FEED,
      ),
      storyImage: this.imageRenderer.renderToPngBuffer(
        jobPosting,
        PostFormat.STORY,
      ),
      caption: buildJobPostCaption(jobPosting),
    };
  }
}
