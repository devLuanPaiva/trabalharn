import {
  drawTrackedText,
  fitTextToLines,
  measureTrackedTextWidth,
  truncateTextToWidth,
  wrapTextIntoLines,
} from './text-layout.util';
import { FontWeight } from './fonts.constant';

function parseFontSize(fontDeclaration: string): number {
  const match = /(\d+)px/.exec(fontDeclaration);
  return match ? Number(match[1]) : 16;
}

function createFakeContext2D() {
  const fillTextCalls: Array<{ text: string; x: number; y: number }> = [];
  const ctx = {
    font: '500 16px Poppins',
    fillText(text: string, x: number, y: number) {
      fillTextCalls.push({ text, x, y });
    },
    measureText(text: string) {
      const charWidth = parseFontSize(ctx.font) / 2;
      return { width: text.length * charWidth };
    },
  };
  return { ctx, fillTextCalls };
}

describe('measureTrackedTextWidth', () => {
  it('sums character widths plus letter spacing, without trailing spacing', () => {
    const { ctx } = createFakeContext2D();
    ctx.font = '500 20px Poppins';

    const width = measureTrackedTextWidth(ctx as any, 'ABC', 2);

    expect(width).toBe(3 * (10 + 2) - 2);
  });

  it('returns 0 for an empty string', () => {
    const { ctx } = createFakeContext2D();

    expect(measureTrackedTextWidth(ctx as any, '', 2)).toBe(0);
  });
});

describe('drawTrackedText', () => {
  it('draws each character advancing by its measured width plus spacing', () => {
    const { ctx, fillTextCalls } = createFakeContext2D();
    ctx.font = '500 20px Poppins';

    drawTrackedText(ctx as any, 'AB', 100, 50, 2);

    expect(fillTextCalls).toEqual([
      { text: 'A', x: 100, y: 50 },
      { text: 'B', x: 112, y: 50 },
    ]);
  });
});

describe('wrapTextIntoLines', () => {
  it('keeps words on the same line while they fit the max width', () => {
    const { ctx } = createFakeContext2D();
    ctx.font = '500 20px Poppins';

    const lines = wrapTextIntoLines(ctx as any, 'ab cd ef gh', 60);

    expect(lines).toEqual(['ab cd', 'ef gh']);
  });

  it('never drops the first word even if it alone exceeds the max width', () => {
    const { ctx } = createFakeContext2D();
    ctx.font = '500 20px Poppins';

    const lines = wrapTextIntoLines(
      ctx as any,
      'supercalifragilisticexpialidocious',
      10,
    );

    expect(lines).toEqual(['supercalifragilisticexpialidocious']);
  });

  it('ignores repeated whitespace between words', () => {
    const { ctx } = createFakeContext2D();

    const lines = wrapTextIntoLines(ctx as any, '  ab   cd  ', 1000);

    expect(lines).toEqual(['ab cd']);
  });
});

describe('truncateTextToWidth', () => {
  it('returns the original text unchanged when it already fits', () => {
    const { ctx } = createFakeContext2D();
    ctx.font = '500 20px Poppins';

    expect(truncateTextToWidth(ctx as any, 'ab', 100)).toBe('ab');
  });

  it('truncates and appends an ellipsis when the text overflows', () => {
    const { ctx } = createFakeContext2D();
    ctx.font = '500 20px Poppins';

    const result = truncateTextToWidth(ctx as any, 'abcdefgh', 50);

    expect(result.endsWith('…')).toBe(true);
    expect(ctx.measureText(result).width).toBeLessThanOrEqual(50);
  });
});

describe('fitTextToLines', () => {
  it('keeps the starting size when the text already fits within maxLines', () => {
    const { ctx } = createFakeContext2D();

    const fitted = fitTextToLines(
      ctx as any,
      'ab',
      200,
      2,
      FontWeight.BOLD,
      40,
      20,
    );

    expect(fitted.size).toBe(40);
    expect(fitted.lines).toEqual(['ab']);
  });

  it('shrinks the font size until the text fits within maxLines', () => {
    const { ctx } = createFakeContext2D();

    const fitted = fitTextToLines(
      ctx as any,
      'palavra palavra palavra palavra',
      120,
      2,
      FontWeight.BOLD,
      40,
      20,
    );

    expect(fitted.size).toBeLessThan(40);
    expect(fitted.lines.length).toBeLessThanOrEqual(2);
  });

  it('truncates the last line with an ellipsis when even the min size overflows', () => {
    const { ctx } = createFakeContext2D();

    const fitted = fitTextToLines(
      ctx as any,
      'palavra palavra palavra palavra palavra palavra palavra',
      80,
      1,
      FontWeight.BOLD,
      40,
      38,
    );

    expect(fitted.size).toBe(38);
    expect(fitted.lines).toHaveLength(1);
    expect(fitted.lines[0].endsWith('…')).toBe(true);
  });
});
