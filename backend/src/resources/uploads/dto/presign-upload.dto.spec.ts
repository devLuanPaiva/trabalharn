import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PresignUploadDto } from './presign-upload.dto';

describe('PresignUploadDto', () => {
  function build(overrides: Partial<PresignUploadDto> = {}) {
    return plainToInstance(PresignUploadDto, {
      key: 'posts/feed/908125.png',
      contentType: 'image/png',
      ...overrides,
    });
  }

  it('accepts a valid feed/story key with an allowed content type', async () => {
    const errors = await validate(build());
    expect(errors).toHaveLength(0);
  });

  it('accepts a story key', async () => {
    const errors = await validate(build({ key: 'posts/story/908125.jpg' }));
    expect(errors).toHaveLength(0);
  });

  it.each([
    'posts/logs/908125.png',
    'posts/feed/../../secrets.png',
    'posts/feed/908125.gif',
    'other/908125.png',
  ])('rejects an out-of-scope or unsupported key: %s', async (key) => {
    const errors = await validate(build({ key }));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects a content type outside the allowed list', async () => {
    const errors = await validate(build({ contentType: 'image/gif' }));
    expect(errors.length).toBeGreaterThan(0);
  });
});
