import type { SKRSContext2D } from '@napi-rs/canvas';
import { buildFontDeclaration, FontWeight } from './fonts.constant';

export interface FittedText {
  size: number;
  lines: string[];
}

export function measureTrackedTextWidth(
  ctx: SKRSContext2D,
  text: string,
  letterSpacing: number,
): number {
  let width = 0;
  for (const character of text) {
    width += ctx.measureText(character).width + letterSpacing;
  }
  return text.length ? width - letterSpacing : 0;
}

export function drawTrackedText(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
): void {
  let cursorX = x;
  for (const character of text) {
    ctx.fillText(character, cursorX, y);
    cursorX += ctx.measureText(character).width + letterSpacing;
  }
}

export function wrapTextIntoLines(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidateLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(candidateLine).width <= maxWidth || !currentLine) {
      currentLine = candidateLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function truncateTextToWidth(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
): string {
  let truncated = String(text);
  if (ctx.measureText(truncated).width <= maxWidth) {
    return truncated;
  }
  while (
    truncated.length > 1 &&
    ctx.measureText(`${truncated}…`).width > maxWidth
  ) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
}

export function fitTextToLines(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
  weight: FontWeight,
  startSize: number,
  minSize: number,
): FittedText {
  for (let size = startSize; size >= minSize; size -= 2) {
    ctx.font = buildFontDeclaration(weight, size);
    const lines = wrapTextIntoLines(ctx, text, maxWidth);
    if (lines.length <= maxLines) {
      return { size, lines };
    }
  }

  ctx.font = buildFontDeclaration(weight, minSize);
  const lines = wrapTextIntoLines(ctx, text, maxWidth).slice(0, maxLines);
  let lastLine = lines[maxLines - 1] ?? '';
  while (
    lastLine.length > 3 &&
    ctx.measureText(`${lastLine}…`).width > maxWidth
  ) {
    lastLine = lastLine.slice(0, -1);
  }
  if (lines.length) {
    lines[lines.length - 1] = `${lastLine}…`;
  }
  return { size: minSize, lines };
}
