import type { SKRSContext2D } from '@napi-rs/canvas';
import { BRAND_COLORS } from './brand-colors.constant';
import { fillRoundedRectangle } from './canvas-shape.util';

const FULL_TURN = Math.PI * 2;
const REFERENCE_RADIUS = 290;
const SUNBEAM_ANGLES_DEGREES = [-150, -120, -90, -60, -30];

export function drawBrandMark(
  ctx: SKRSContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  withoutDisc = false,
): void {
  const scale = radius / REFERENCE_RADIUS;
  ctx.save();
  ctx.translate(centerX - 300 * scale, centerY - 300 * scale);
  ctx.scale(scale, scale);

  if (!withoutDisc) {
    ctx.fillStyle = BRAND_COLORS.white;
    ctx.beginPath();
    ctx.arc(300, 300, REFERENCE_RADIUS, 0, FULL_TURN);
    ctx.fill();
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(300, 300, REFERENCE_RADIUS, 0, FULL_TURN);
  ctx.clip();

  drawSunbeams(ctx);
  drawSunDisc(ctx);
  drawSeaBase(ctx);
  drawDuneOverlay(ctx);
  drawBriefcaseHandle(ctx);
  drawBriefcaseBody(ctx);

  ctx.restore();
  ctx.restore();
}

function drawSunbeams(ctx: SKRSContext2D): void {
  ctx.strokeStyle = BRAND_COLORS.yellow;
  ctx.lineWidth = 17;
  ctx.lineCap = 'round';
  SUNBEAM_ANGLES_DEGREES.forEach((angleDegrees) => {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(
      300 + 138 * Math.cos(angleRadians),
      186 + 138 * Math.sin(angleRadians),
    );
    ctx.lineTo(
      300 + 171 * Math.cos(angleRadians),
      186 + 171 * Math.sin(angleRadians),
    );
    ctx.stroke();
  });
}

function drawSunDisc(ctx: SKRSContext2D): void {
  ctx.fillStyle = BRAND_COLORS.yellow;
  ctx.beginPath();
  ctx.arc(300, 186, 118, 0, FULL_TURN);
  ctx.fill();
}

function drawSeaBase(ctx: SKRSContext2D): void {
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.beginPath();
  ctx.moveTo(0, 474);
  ctx.bezierCurveTo(70, 442, 142, 444, 212, 468);
  ctx.bezierCurveTo(292, 495, 362, 444, 452, 453);
  ctx.bezierCurveTo(522, 460, 572, 481, 600, 472);
  ctx.lineTo(600, 600);
  ctx.lineTo(0, 600);
  ctx.closePath();
  ctx.fill();
}

function drawDuneOverlay(ctx: SKRSContext2D): void {
  ctx.fillStyle = BRAND_COLORS.yellow;
  ctx.beginPath();
  ctx.moveTo(0, 520);
  ctx.bezierCurveTo(92, 476, 162, 538, 252, 522);
  ctx.bezierCurveTo(342, 506, 402, 542, 472, 516);
  ctx.bezierCurveTo(532, 494, 572, 516, 600, 507);
  ctx.lineTo(600, 600);
  ctx.lineTo(0, 600);
  ctx.closePath();
  ctx.fill();
}

function drawBriefcaseHandle(ctx: SKRSContext2D): void {
  ctx.strokeStyle = BRAND_COLORS.blue;
  ctx.lineWidth = 26;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(253, 266);
  ctx.lineTo(253, 234);
  ctx.arcTo(253, 210, 277, 210, 24);
  ctx.lineTo(323, 210);
  ctx.arcTo(347, 210, 347, 234, 24);
  ctx.lineTo(347, 266);
  ctx.stroke();
}

function drawBriefcaseBody(ctx: SKRSContext2D): void {
  ctx.fillStyle = BRAND_COLORS.blue;
  fillRoundedRectangle(ctx, 158, 260, 284, 192, 30);
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.fillRect(158, 328, 284, 27);
  ctx.fillStyle = BRAND_COLORS.yellow;
  fillRoundedRectangle(ctx, 272, 316, 56, 51, 13);
}
