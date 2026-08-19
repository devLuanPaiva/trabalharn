import { Body, Controller, Post } from '@nestjs/common';
import { GeneratedPostResponseDto } from './dto/generated-post-response.dto';
import { JobPostingDto } from './dto/job-posting.dto';
import { PostGeneratorService } from './post-generator.service';
import { toPngDataUrl } from './utils/png-data-url.util';

@Controller('post-generator')
export class PostGeneratorController {
  constructor(private readonly postGeneratorService: PostGeneratorService) {}

  @Post('generate')
  generate(@Body() jobPosting: JobPostingDto): GeneratedPostResponseDto {
    const result = this.postGeneratorService.generatePost(jobPosting);
    return {
      feedImageBase64: toPngDataUrl(result.feedImage),
      storyImageBase64: toPngDataUrl(result.storyImage),
      caption: result.caption,
    };
  }
}
