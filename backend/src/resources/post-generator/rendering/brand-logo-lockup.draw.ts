import type { SKRSContext2D } from '@napi-rs/canvas';
import { BRAND_COLORS } from './brand-colors.constant';
import { drawBrandMark } from './brand-mark.draw';
import { buildFontDeclaration, FontWeight } from './fonts.constant';

const WORDMARK_FIRST_PART = 'Trabalha';
const WORDMARK_SECOND_PART = 'RN';

export function drawBrandLogoLockup(
  ctx: SKRSContext2D,
  anchorX: number,
  baselineY: number,
  fontSize: number,
  markRadius: number,
  centered: boolean,
): void {
  ctx.font = buildFontDeclaration(FontWeight.BOLD, fontSize);
  const firstPartWidth = ctx.measureText(WORDMARK_FIRST_PART).width;
  const secondPartWidth = ctx.measureText(WORDMARK_SECOND_PART).width;
  const gapAfterMark = markRadius * 0.55;
  const totalWidth =
    markRadius * 2 + gapAfterMark + firstPartWidth + secondPartWidth;
  const startX = centered ? anchorX - totalWidth / 2 : anchorX;

  drawBrandMark(
    ctx,
    startX + markRadius,
    baselineY - fontSize * 0.36,
    markRadius,
  );

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const wordmarkX = startX + markRadius * 2 + gapAfterMark;
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.fillText(WORDMARK_FIRST_PART, wordmarkX, baselineY);
  ctx.fillStyle = BRAND_COLORS.yellow;
  ctx.fillText(WORDMARK_SECOND_PART, wordmarkX + firstPartWidth, baselineY);
}
