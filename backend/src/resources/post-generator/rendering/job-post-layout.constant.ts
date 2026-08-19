import { PostFormat } from '../types/post-format.enum';

export const CARD_TOP_BY_FORMAT: Record<PostFormat, number> = {
  [PostFormat.FEED]: 168,
  [PostFormat.STORY]: 560,
};

export const CARD_BOTTOM_BY_FORMAT: Record<PostFormat, number> = {
  [PostFormat.FEED]: 1204,
  [PostFormat.STORY]: 1626,
};

export const CONTENT_LEFT = 120;
export const CONTENT_WIDTH = 840;

export const TITLE_START_FONT_SIZE_BY_FORMAT: Record<PostFormat, number> = {
  [PostFormat.FEED]: 76,
  [PostFormat.STORY]: 82,
};

export const TITLE_MIN_FONT_SIZE = 44;
export const TITLE_SHRINK_STEP = 8;
export const TITLE_SHRINK_FLOOR = 48;

export const SPACING_UNIT_MIN = 13;
export const SPACING_UNIT_MAX = 44;
export const MAX_SHRINK_ITERATIONS = 12;

export const DEFAULT_APPLICATION_INSTRUCTIONS =
  'Envie seu currículo pela nossa página';
export const MAX_REQUIREMENTS_SHOWN = 5;
