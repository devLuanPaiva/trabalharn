import type { SKRSContext2D } from '@napi-rs/canvas';

export function traceRoundedRectanglePath(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadius: number,
): void {
  const radius = Math.min(cornerRadius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export function fillRoundedRectangle(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadius: number,
): void {
  traceRoundedRectanglePath(ctx, x, y, width, height, cornerRadius);
  ctx.fill();
}
