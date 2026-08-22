import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Matches } from 'class-validator';

const KEY_PATTERN = /^posts\/(feed|story)\/[\w.-]+\.(png|jpe?g)$/i;

export class PresignUploadDto {
  @ApiProperty({
    description:
      'Object key inside the bucket. Must live under posts/feed/ or posts/story/',
    example: 'posts/feed/908125.png',
  })
  @IsString()
  @Matches(KEY_PATTERN, {
    message: 'key must match posts/(feed|story)/<filename>.(png|jpg|jpeg)',
  })
  key: string;

  @ApiProperty({ example: 'image/png', enum: ['image/png', 'image/jpeg'] })
  @IsIn(['image/png', 'image/jpeg'])
  contentType: string;
}
