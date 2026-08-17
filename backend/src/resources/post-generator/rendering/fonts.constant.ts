import { join } from 'path';

export enum FontWeight {
  MEDIUM = 500,
  BOLD = 700,
}

export const BRAND_FONT_FAMILY_NAME = 'Poppins';

export const BRAND_FONT_STACK = `${BRAND_FONT_FAMILY_NAME}, "Trebuchet MS", Arial, sans-serif`;

export const BRAND_FONT_ASSET_PATHS: Record<FontWeight, string> = {
  [FontWeight.MEDIUM]: join(
    __dirname,
    'assets',
    'fonts',
    'poppins-medium.woff2',
  ),
  [FontWeight.BOLD]: join(__dirname, 'assets', 'fonts', 'poppins-bold.woff2'),
};

export function buildFontDeclaration(
  weight: FontWeight,
  sizeInPixels: number,
): string {
  return `${weight} ${sizeInPixels}px ${BRAND_FONT_STACK}`;
}
