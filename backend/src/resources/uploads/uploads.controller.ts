import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { PresignedUploadResponseDto } from './dto/presigned-upload-response.dto';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presign')
  @ApiOperation({
    summary:
      'Get a presigned S3 PUT URL for uploading a generated post image',
  })
  presign(
    @Body() dto: PresignUploadDto,
  ): Promise<PresignedUploadResponseDto> {
    return this.uploadsService.presignUpload(dto);
  }
}
