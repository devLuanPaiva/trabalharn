import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { PresignedUploadResponseDto } from './dto/presigned-upload-response.dto';

const PRESIGNED_URL_EXPIRY_SECONDS = 300;

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  async presignUpload(
    dto: PresignUploadDto,
  ): Promise<PresignedUploadResponseDto> {
    const region = this.configService.get<string>('AWS_REGION');
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !bucket || !accessKeyId || !secretAccessKey) {
      throw new InternalServerErrorException(
        'AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be configured to presign uploads',
      );
    }

    const client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: dto.key,
      ContentType: dto.contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
    });

    return {
      uploadUrl,
      publicUrl: `https://${bucket}.s3.${region}.amazonaws.com/${dto.key}`,
    };
  }
}
