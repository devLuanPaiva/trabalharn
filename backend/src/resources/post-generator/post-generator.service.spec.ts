import { PostGeneratorService } from './post-generator.service';
import { JobPostImageRenderer } from './rendering/job-post-image.renderer';
import { PostFormat } from './types/post-format.enum';
import { JobPostingDto } from './dto/job-posting.dto';

describe('PostGeneratorService', () => {
  function buildJobPosting(): JobPostingDto {
    const jobPosting = new JobPostingDto();
    jobPosting.jobTitle = 'Vendedor';
    jobPosting.city = 'Natal / RN';
    return jobPosting;
  }

  it('renders the feed image, the story image, and builds the caption', () => {
    const feedImage = Buffer.from('feed');
    const storyImage = Buffer.from('story');
    const renderToPngBuffer = jest
      .fn()
      .mockImplementation((_jobPosting: JobPostingDto, format: PostFormat) =>
        format === PostFormat.FEED ? feedImage : storyImage,
      );
    const imageRenderer = {
      renderToPngBuffer,
    } as unknown as JobPostImageRenderer;
    const service = new PostGeneratorService(imageRenderer);
    const jobPosting = buildJobPosting();

    const result = service.generatePost(jobPosting);

    expect(renderToPngBuffer).toHaveBeenCalledWith(jobPosting, PostFormat.FEED);
    expect(renderToPngBuffer).toHaveBeenCalledWith(
      jobPosting,
      PostFormat.STORY,
    );
    expect(result.feedImage).toBe(feedImage);
    expect(result.storyImage).toBe(storyImage);
    expect(result.caption).toContain('VENDEDOR');
    expect(result.caption).toContain('#Natal');
  });
});
