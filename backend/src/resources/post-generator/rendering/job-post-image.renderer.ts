import { Injectable } from '@nestjs/common';
import { createCanvas, SKRSContext2D } from '@napi-rs/canvas';
import { PostFormat } from '../types/post-format.enum';
import { JobPostingData } from '../types/job-posting-data.type';
import { PostGeneratorFontRepository } from '../fonts/post-generator-font.repository';
import { BRAND_COLORS } from './brand-colors.constant';
import {
  POST_CANVAS_WIDTH,
  getCanvasHeightForFormat,
} from './canvas-dimensions.constant';
import { fillRoundedRectangle } from './canvas-shape.util';
import { drawDecorativeWaves } from './decorative-waves.draw';
import { drawBrandLogoLockup } from './brand-logo-lockup.draw';
import { JOB_POST_ICON_DRAWERS } from './job-post-icons.draw';
import { buildFontDeclaration, FontWeight } from './fonts.constant';
import {
  FittedText,
  drawTrackedText,
  fitTextToLines,
  measureTrackedTextWidth,
  truncateTextToWidth,
  wrapTextIntoLines,
} from './text-layout.util';
import {
  JobPostDetailRow,
  buildJobPostBadges,
  buildJobPostDetailRows,
  buildVisibleRequirements,
} from './job-post-content.builder';
import {
  CARD_BOTTOM_BY_FORMAT,
  CARD_TOP_BY_FORMAT,
  CONTENT_LEFT,
  CONTENT_WIDTH,
  DEFAULT_APPLICATION_INSTRUCTIONS,
  MAX_SHRINK_ITERATIONS,
  SPACING_UNIT_MAX,
  SPACING_UNIT_MIN,
  TITLE_MIN_FONT_SIZE,
  TITLE_SHRINK_FLOOR,
  TITLE_SHRINK_STEP,
  TITLE_START_FONT_SIZE_BY_FORMAT,
} from './job-post-layout.constant';

const FULL_TURN = Math.PI * 2;

interface ContentBlock {
  height: number;
  spacingWeight: number;
  isRequirementItem?: boolean;
  isDetailRow?: boolean;
  draw: (y: number) => void;
}

@Injectable()
export class JobPostImageRenderer {
  constructor(private readonly fontRepository: PostGeneratorFontRepository) {}

  renderToPngBuffer(jobPosting: JobPostingData, format: PostFormat): Buffer {
    this.fontRepository.registerBrandFonts();

    const width = POST_CANVAS_WIDTH;
    const height = getCanvasHeightForFormat(format);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    paintJobPostCanvas(ctx, jobPosting, format, width, height);

    return canvas.toBuffer('image/png');
  }
}

function paintJobPostCanvas(
  ctx: SKRSContext2D,
  jobPosting: JobPostingData,
  format: PostFormat,
  width: number,
  height: number,
): void {
  const isStory = format === PostFormat.STORY;
  const cardTop = CARD_TOP_BY_FORMAT[format];
  const cardBottom = CARD_BOTTOM_BY_FORMAT[format];

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  paintBackdrop(ctx, width, height, isStory);
  drawDecorativeWaves(
    ctx,
    width,
    height,
    isStory ? height - 190 : height - 140,
  );
  paintHeaderLockup(ctx, isStory);
  paintCard(ctx, cardTop, cardBottom);

  const applicationText =
    jobPosting.applicationInstructions || DEFAULT_APPLICATION_INSTRUCTIONS;
  const applicationBar = fitTextToLines(
    ctx,
    applicationText,
    CONTENT_WIDTH - 4,
    2,
    FontWeight.BOLD,
    36,
    23,
  );
  const barHeight = Math.round(
    84 +
      (applicationBar.lines.length - 1) * (applicationBar.size + 8) +
      applicationBar.size * 0.3 +
      26,
  );
  const barY = cardBottom - 42 - barHeight;
  const contentTop = cardTop + 48;
  const availableHeight = barY - 24 - contentTop;

  const initialBlocks = buildContentBlocks(ctx, jobPosting, format);
  const fittedBlocks = shrinkBlocksToFit(
    ctx,
    initialBlocks,
    availableHeight,
    format,
    jobPosting,
  );
  paintContentBlocks(fittedBlocks, contentTop, availableHeight);

  paintApplicationBar(ctx, barY, barHeight, applicationBar);

  if (isStory && jobPosting.storyFooterText) {
    paintStoryFooter(ctx, jobPosting.storyFooterText);
  }

  ctx.restore();
}

function paintBackdrop(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  isStory: boolean,
): void {
  ctx.fillStyle = BRAND_COLORS.green;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.07;
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.beginPath();
  ctx.arc(width + 40, isStory ? 250 : 110, 260, 0, FULL_TURN);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function paintHeaderLockup(ctx: SKRSContext2D, isStory: boolean): void {
  if (isStory) {
    drawBrandLogoLockup(ctx, 540, 400, 66, 88, true);
  } else {
    drawBrandLogoLockup(ctx, 76, 118, 50, 56, false);
  }
}

function paintCard(
  ctx: SKRSContext2D,
  cardTop: number,
  cardBottom: number,
): void {
  ctx.fillStyle = BRAND_COLORS.white;
  fillRoundedRectangle(ctx, 56, cardTop, 968, cardBottom - cardTop, 46);
}

function buildContentBlocks(
  ctx: SKRSContext2D,
  jobPosting: JobPostingData,
  format: PostFormat,
): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  blocks.push(buildBadgesBlock(ctx, jobPosting));
  blocks.push(
    buildTitleBlock(ctx, jobPosting, TITLE_START_FONT_SIZE_BY_FORMAT[format]),
  );

  if (jobPosting.companyName) {
    blocks.push(buildCompanyBlock(ctx, jobPosting.companyName));
  }

  blocks.push(buildDividerBlock(ctx));

  buildJobPostDetailRows(jobPosting).forEach((row, index) => {
    blocks.push(buildDetailRowBlock(ctx, row, index));
  });

  const requirements = buildVisibleRequirements(jobPosting);
  if (requirements.length) {
    blocks.push(...buildRequirementBlocks(ctx, requirements));
  }

  return blocks;
}

function buildBadgesBlock(
  ctx: SKRSContext2D,
  jobPosting: JobPostingData,
): ContentBlock {
  const badges = buildJobPostBadges(jobPosting);
  return {
    height: 58,
    spacingWeight: 0,
    draw: (y) => {
      let x = CONTENT_LEFT;
      badges.forEach((badge) => {
        ctx.font = buildFontDeclaration(FontWeight.BOLD, 25);
        const badgeWidth = measureTrackedTextWidth(ctx, badge.label, 1.6) + 56;
        ctx.fillStyle = badge.backgroundColor;
        fillRoundedRectangle(ctx, x, y, badgeWidth, 58, 29);
        ctx.fillStyle = badge.foregroundColor;
        drawTrackedText(ctx, badge.label, x + 28, y + 38, 1.6);
        x += badgeWidth + 14;
      });
    },
  };
}

function buildTitleBlock(
  ctx: SKRSContext2D,
  jobPosting: JobPostingData,
  maxFontSize: number,
): ContentBlock {
  const fitted = fitTextToLines(
    ctx,
    jobPosting.jobTitle || 'Título da vaga',
    CONTENT_WIDTH,
    3,
    FontWeight.BOLD,
    maxFontSize,
    TITLE_MIN_FONT_SIZE,
  );
  return {
    height: fitted.lines.length * fitted.size * 1.12,
    spacingWeight: 1.5,
    draw: (y) => {
      ctx.fillStyle = BRAND_COLORS.ink;
      fitted.lines.forEach((line, index) => {
        ctx.font = buildFontDeclaration(FontWeight.BOLD, fitted.size);
        ctx.fillText(
          line,
          CONTENT_LEFT,
          y + fitted.size * 0.82 + index * fitted.size * 1.12,
        );
      });
    },
  };
}

function buildCompanyBlock(
  ctx: SKRSContext2D,
  companyName: string,
): ContentBlock {
  return {
    height: 44,
    spacingWeight: 0.45,
    draw: (y) => {
      ctx.font = buildFontDeclaration(FontWeight.MEDIUM, 36);
      ctx.fillStyle = BRAND_COLORS.mutedText;
      ctx.fillText(
        truncateTextToWidth(ctx, companyName, CONTENT_WIDTH),
        CONTENT_LEFT,
        y + 32,
      );
    },
  };
}

function buildDividerBlock(ctx: SKRSContext2D): ContentBlock {
  return {
    height: 2,
    spacingWeight: 0.9,
    draw: (y) => {
      ctx.fillStyle = BRAND_COLORS.divider;
      ctx.fillRect(CONTENT_LEFT, y, CONTENT_WIDTH, 2);
    },
  };
}

function buildDetailRowBlock(
  ctx: SKRSContext2D,
  row: JobPostDetailRow,
  index: number,
): ContentBlock {
  return {
    height: 68,
    spacingWeight: index === 0 ? 0.9 : 0.32,
    isDetailRow: true,
    draw: (y) => {
      ctx.fillStyle = BRAND_COLORS.blueTint;
      ctx.beginPath();
      ctx.arc(CONTENT_LEFT + 34, y + 34, 34, 0, FULL_TURN);
      ctx.fill();
      JOB_POST_ICON_DRAWERS[row.icon](ctx, CONTENT_LEFT + 34, y + 34, 40);
      ctx.font = buildFontDeclaration(FontWeight.MEDIUM, 21);
      ctx.fillStyle = BRAND_COLORS.mutedText;
      drawTrackedText(ctx, row.label, CONTENT_LEFT + 92, y + 26, 2);
      ctx.font = buildFontDeclaration(FontWeight.BOLD, 34);
      ctx.fillStyle = BRAND_COLORS.ink;
      ctx.fillText(
        truncateTextToWidth(ctx, row.value, CONTENT_WIDTH - 92),
        CONTENT_LEFT + 92,
        y + 62,
      );
    },
  };
}

function buildRequirementBlocks(
  ctx: SKRSContext2D,
  requirements: string[],
): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  blocks.push({
    height: 26,
    spacingWeight: 1.1,
    isRequirementItem: true,
    draw: (y) => {
      ctx.font = buildFontDeclaration(FontWeight.BOLD, 23);
      ctx.fillStyle = BRAND_COLORS.green;
      drawTrackedText(ctx, 'REQUISITOS', CONTENT_LEFT, y + 20, 3);
    },
  });

  requirements.forEach((requirement, index) => {
    ctx.font = buildFontDeclaration(FontWeight.MEDIUM, 29);
    const lines = wrapTextIntoLines(ctx, requirement, CONTENT_WIDTH - 46).slice(
      0,
      2,
    );
    blocks.push({
      height: lines.length * 38,
      spacingWeight: index === 0 ? 0.7 : 0.3,
      isRequirementItem: true,
      draw: (y) => {
        ctx.fillStyle = BRAND_COLORS.yellow;
        ctx.beginPath();
        ctx.arc(CONTENT_LEFT + 9, y + 17, 9, 0, FULL_TURN);
        ctx.fill();
        ctx.fillStyle = BRAND_COLORS.ink;
        ctx.font = buildFontDeclaration(FontWeight.MEDIUM, 29);
        lines.forEach((line, lineIndex) => {
          ctx.fillText(line, CONTENT_LEFT + 40, y + 26 + lineIndex * 38);
        });
      },
    });
  });

  return blocks;
}

function sumBlocksWithMinimumSpacing(blocks: ContentBlock[]): number {
  const totalHeight = blocks.reduce((sum, block) => sum + block.height, 0);
  const totalWeight = blocks.reduce(
    (sum, block) => sum + block.spacingWeight,
    0,
  );
  return totalHeight + totalWeight * 14;
}

function shrinkBlocksToFit(
  ctx: SKRSContext2D,
  blocks: ContentBlock[],
  availableHeight: number,
  format: PostFormat,
  jobPosting: JobPostingData,
): ContentBlock[] {
  let current = blocks;
  let titleMaxFontSize = TITLE_START_FONT_SIZE_BY_FORMAT[format];
  let iterations = 0;

  while (
    sumBlocksWithMinimumSpacing(current) > availableHeight &&
    iterations++ < MAX_SHRINK_ITERATIONS
  ) {
    const lastRequirementIndex = findLastIndex(current, (block) =>
      Boolean(block.isRequirementItem),
    );

    if (lastRequirementIndex >= 0) {
      current = removeBlockAt(current, lastRequirementIndex);
      continue;
    }

    if (titleMaxFontSize > TITLE_SHRINK_FLOOR) {
      titleMaxFontSize -= TITLE_SHRINK_STEP;
      current = replaceBlockAt(
        current,
        1,
        buildTitleBlock(ctx, jobPosting, titleMaxFontSize),
      );
      continue;
    }

    const lastDetailRowIndex = findLastIndex(current, (block) =>
      Boolean(block.isDetailRow),
    );
    if (lastDetailRowIndex >= 0) {
      current = removeBlockAt(current, lastDetailRowIndex);
      continue;
    }

    break;
  }

  return current;
}

function findLastIndex<T>(items: T[], predicate: (item: T) => boolean): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index])) {
      return index;
    }
  }
  return -1;
}

function removeBlockAt(blocks: ContentBlock[], index: number): ContentBlock[] {
  return [...blocks.slice(0, index), ...blocks.slice(index + 1)];
}

function replaceBlockAt(
  blocks: ContentBlock[],
  index: number,
  block: ContentBlock,
): ContentBlock[] {
  return [...blocks.slice(0, index), block, ...blocks.slice(index + 1)];
}

function paintContentBlocks(
  blocks: ContentBlock[],
  top: number,
  availableHeight: number,
): void {
  const totalHeight = blocks.reduce((sum, block) => sum + block.height, 0);
  const totalWeight = blocks.reduce(
    (sum, block) => sum + block.spacingWeight,
    0,
  );

  let spacingUnit =
    totalWeight > 0 ? (availableHeight - totalHeight) / totalWeight : 0;
  spacingUnit = Math.max(
    SPACING_UNIT_MIN,
    Math.min(spacingUnit, SPACING_UNIT_MAX),
  );
  const usedHeight = totalHeight + totalWeight * spacingUnit;

  let y = top + Math.max(0, (availableHeight - usedHeight) * 0.35);
  blocks.forEach((block) => {
    y += block.spacingWeight * spacingUnit;
    block.draw(y);
    y += block.height;
  });
}

function paintApplicationBar(
  ctx: SKRSContext2D,
  barY: number,
  barHeight: number,
  applicationBar: FittedText,
): void {
  ctx.fillStyle = BRAND_COLORS.green;
  fillRoundedRectangle(
    ctx,
    CONTENT_LEFT - 22,
    barY,
    CONTENT_WIDTH + 44,
    barHeight,
    30,
  );

  ctx.font = buildFontDeclaration(FontWeight.BOLD, 22);
  ctx.fillStyle = BRAND_COLORS.yellow;
  drawTrackedText(ctx, 'COMO SE CANDIDATAR', CONTENT_LEFT + 16, barY + 46, 3);

  ctx.fillStyle = BRAND_COLORS.white;
  applicationBar.lines.forEach((line, index) => {
    ctx.font = buildFontDeclaration(FontWeight.BOLD, applicationBar.size);
    ctx.fillText(
      line,
      CONTENT_LEFT + 16,
      barY + 84 + index * (applicationBar.size + 8),
    );
  });
}

function paintStoryFooter(ctx: SKRSContext2D, footerText: string): void {
  ctx.textAlign = 'center';
  ctx.font = buildFontDeclaration(FontWeight.MEDIUM, 34);
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.fillText(truncateTextToWidth(ctx, footerText, 900), 540, 1706);
  ctx.textAlign = 'left';
}
