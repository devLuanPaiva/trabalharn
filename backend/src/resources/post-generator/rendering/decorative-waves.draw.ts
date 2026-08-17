import type { SKRSContext2D } from '@napi-rs/canvas';
import { BRAND_COLORS } from './brand-colors.constant';

export function drawDecorativeWaves(
  ctx: SKRSContext2D,
  canvasWidth: number,
  canvasHeight: number,
  topOffset: number,
): void {
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.beginPath();
  ctx.moveTo(0, topOffset + 45);
  ctx.bezierCurveTo(
    canvasWidth * 0.17,
    topOffset + 8,
    canvasWidth * 0.35,
    topOffset + 18,
    canvasWidth * 0.52,
    topOffset + 48,
  );
  ctx.bezierCurveTo(
    canvasWidth * 0.7,
    topOffset + 80,
    canvasWidth * 0.84,
    topOffset + 14,
    canvasWidth,
    topOffset + 32,
  );
  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.lineTo(0, canvasHeight);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = BRAND_COLORS.yellow;
  ctx.beginPath();
  ctx.moveTo(0, topOffset + 108);
  ctx.bezierCurveTo(
    canvasWidth * 0.2,
    topOffset + 60,
    canvasWidth * 0.41,
    topOffset + 130,
    canvasWidth * 0.62,
    topOffset + 112,
  );
  ctx.bezierCurveTo(
    canvasWidth * 0.81,
    topOffset + 96,
    canvasWidth * 0.9,
    topOffset + 136,
    canvasWidth,
    topOffset + 118,
  );
  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.lineTo(0, canvasHeight);
  ctx.closePath();
  ctx.fill();
}
