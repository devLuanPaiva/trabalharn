import { PostFormat } from '../types/post-format.enum';

export const POST_CANVAS_WIDTH = 1080;

export const POST_CANVAS_HEIGHT: Record<PostFormat, number> = {
  [PostFormat.FEED]: 1350,
  [PostFormat.STORY]: 1920,
};

export function getCanvasHeightForFormat(format: PostFormat): number {
  return POST_CANVAS_HEIGHT[format];
}
