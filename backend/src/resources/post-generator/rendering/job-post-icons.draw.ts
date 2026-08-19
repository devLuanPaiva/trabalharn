import type { SKRSContext2D } from '@napi-rs/canvas';
import { BRAND_COLORS } from './brand-colors.constant';
import { fillRoundedRectangle } from './canvas-shape.util';

const FULL_TURN = Math.PI * 2;

export type JobPostIconName = 'pin' | 'money' | 'case' | 'clock';

function drawPinIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.12, size * 0.4, 0, FULL_TURN);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.24, cy + size * 0.1);
  ctx.lineTo(cx + size * 0.24, cy + size * 0.1);
  ctx.lineTo(cx, cy + size * 0.62);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.12, size * 0.15, 0, FULL_TURN);
  ctx.fill();
}

function drawMoneyIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  ctx.fillStyle = BRAND_COLORS.blue;
  fillRoundedRectangle(
    ctx,
    cx - size * 0.5,
    cy - size * 0.33,
    size,
    size * 0.66,
    size * 0.12,
  );
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.17, 0, FULL_TURN);
  ctx.fill();
  ctx.fillRect(cx - size * 0.42, cy - size * 0.25, size * 0.06, size * 0.5);
  ctx.fillRect(cx + size * 0.36, cy - size * 0.25, size * 0.06, size * 0.5);
}

function drawBriefcaseGlyph(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  ctx.strokeStyle = BRAND_COLORS.blue;
  ctx.lineWidth = size * 0.13;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.19, cy - size * 0.26);
  ctx.lineTo(cx - size * 0.19, cy - size * 0.38);
  ctx.lineTo(cx + size * 0.19, cy - size * 0.38);
  ctx.lineTo(cx + size * 0.19, cy - size * 0.26);
  ctx.stroke();
  ctx.fillStyle = BRAND_COLORS.blue;
  fillRoundedRectangle(
    ctx,
    cx - size * 0.48,
    cy - size * 0.24,
    size * 0.96,
    size * 0.62,
    size * 0.12,
  );
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.fillRect(cx - size * 0.48, cy - size * 0.02, size * 0.96, size * 0.08);
}

function drawClockIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
): void {
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.45, 0, FULL_TURN);
  ctx.fill();
  ctx.strokeStyle = BRAND_COLORS.white;
  ctx.lineWidth = size * 0.09;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.24);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + size * 0.17, cy + size * 0.08);
  ctx.stroke();
}

export const JOB_POST_ICON_DRAWERS: Record<
  JobPostIconName,
  (ctx: SKRSContext2D, cx: number, cy: number, size: number) => void
> = {
  pin: drawPinIcon,
  money: drawMoneyIcon,
  case: drawBriefcaseGlyph,
  clock: drawClockIcon,
};
