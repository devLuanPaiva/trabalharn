import { PresignUploadDto } from './dto/presign-upload.dto';
import { PresignedUploadResponseDto } from './dto/presigned-upload-response.dto';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

describe('UploadsController', () => {
  function buildServiceMock() {
    return {
      presignUpload: jest.fn(),
    } as unknown as jest.Mocked<UploadsService>;
  }

  it('delegates presigning to the service', async () => {
    const service = buildServiceMock();
    const dto: PresignUploadDto = {
      key: 'posts/story/908125.png',
      contentType: 'image/png',
    };
    const response: PresignedUploadResponseDto = {
      uploadUrl: 'https://trabalharn.s3.us-east-1.amazonaws.com/posts/story/908125.png?sig=abc',
      publicUrl: 'https://trabalharn.s3.us-east-1.amazonaws.com/posts/story/908125.png',
    };
    service.presignUpload.mockResolvedValue(response);
    const controller = new UploadsController(service);

    const result = await controller.presign(dto);

    expect(service.presignUpload).toHaveBeenCalledWith(dto);
    expect(result).toBe(response);
  });
});
