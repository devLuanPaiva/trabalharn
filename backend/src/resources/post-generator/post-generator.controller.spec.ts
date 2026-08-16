import { PostGeneratorController } from './post-generator.controller';
import { PostGeneratorService } from './post-generator.service';
import { JobPostingDto } from './dto/job-posting.dto';
import { GeneratedPostResult } from './types/generated-post-result.type';

describe('PostGeneratorController', () => {
  it('maps the generated buffers to base64 PNG data URLs', () => {
    const generatedPost: GeneratedPostResult = {
      feedImage: Buffer.from('feed-bytes'),
      storyImage: Buffer.from('story-bytes'),
      caption: 'legenda pronta',
    };
    const generatePost = jest.fn().mockReturnValue(generatedPost);
    const service = { generatePost } as unknown as PostGeneratorService;
    const controller = new PostGeneratorController(service);
    const jobPosting = new JobPostingDto();
    jobPosting.jobTitle = 'Vendedor';

    const response = controller.generate(jobPosting);

    expect(generatePost).toHaveBeenCalledWith(jobPosting);
    expect(response).toEqual({
      feedImageBase64: `data:image/png;base64,${generatedPost.feedImage.toString('base64')}`,
      storyImageBase64: `data:image/png;base64,${generatedPost.storyImage.toString('base64')}`,
      caption: 'legenda pronta',
    });
  });
});
