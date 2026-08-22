import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { UploadsService } from './uploads.service';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

describe('UploadsService', () => {
  function buildConfigServiceMock(
    overrides: Record<string, string | undefined> = {},
  ) {
    const values: Record<string, string | undefined> = {
      AWS_REGION: 'us-east-1',
      AWS_S3_BUCKET: 'trabalharn',
      AWS_ACCESS_KEY_ID: 'AKIA_TEST',
      AWS_SECRET_ACCESS_KEY: 'secret',
      ...overrides,
    };
    return {
      get: jest.fn((key: string) => values[key]),
    } as unknown as jest.Mocked<ConfigService>;
  }

  function buildDto(
    overrides: Partial<PresignUploadDto> = {},
  ): PresignUploadDto {
    return {
      key: 'posts/feed/908125.png',
      contentType: 'image/png',
      ...overrides,
    };
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a presigned upload URL and the matching public URL', async () => {
    const configService = buildConfigServiceMock();
    (getSignedUrl as jest.Mock).mockResolvedValue(
      'https://trabalharn.s3.us-east-1.amazonaws.com/posts/feed/908125.png?X-Amz-Signature=abc',
    );
    const service = new UploadsService(configService);

    const result = await service.presignUpload(buildDto());

    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        input: expect.objectContaining({
          Bucket: 'trabalharn',
          Key: 'posts/feed/908125.png',
          ContentType: 'image/png',
        }),
      }),
      { expiresIn: 300 },
    );
    expect(result).toEqual({
      uploadUrl:
        'https://trabalharn.s3.us-east-1.amazonaws.com/posts/feed/908125.png?X-Amz-Signature=abc',
      publicUrl:
        'https://trabalharn.s3.us-east-1.amazonaws.com/posts/feed/908125.png',
    });
  });

  it('throws when AWS credentials are not configured', async () => {
    const configService = buildConfigServiceMock({
      AWS_ACCESS_KEY_ID: undefined,
    });
    const service = new UploadsService(configService);

    await expect(service.presignUpload(buildDto())).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
    expect(getSignedUrl).not.toHaveBeenCalled();
  });
});
