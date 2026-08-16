'use client';

import { downloadDataUrl } from '@/lib/post-generator/download';
import { slugify } from '@/lib/post-generator/slugify';
import { GeneratedPost } from '@/lib/post-generator/types';

interface DownloadButtonsProps {
  generatedPost: GeneratedPost | null;
  jobTitle: string;
}

function buildFilename(jobTitle: string, format: 'feed' | 'story'): string {
  return `trabalharn-${slugify(jobTitle)}-${format}.png`;
}

export function DownloadButtons({ generatedPost, jobTitle }: DownloadButtonsProps) {
  const isDisabled = !generatedPost;

  async function handleDownloadFeed(): Promise<void> {
    if (generatedPost) {
      await downloadDataUrl(generatedPost.feedImageBase64, buildFilename(jobTitle, 'feed'));
    }
  }

  async function handleDownloadStory(): Promise<void> {
    if (generatedPost) {
      await downloadDataUrl(generatedPost.storyImageBase64, buildFilename(jobTitle, 'story'));
    }
  }

  async function handleDownloadBoth(): Promise<void> {
    await handleDownloadFeed();
    await handleDownloadStory();
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleDownloadFeed}
        className="min-w-[150px] flex-1 rounded-[11px] bg-brand-green px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        Baixar post
      </button>
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleDownloadStory}
        className="min-w-[150px] flex-1 rounded-[11px] bg-brand-blue px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        Baixar story
      </button>
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleDownloadBoth}
        className="min-w-[150px] flex-1 rounded-[11px] bg-brand-yellow px-4 py-3 text-sm font-bold text-brand-ink disabled:opacity-50"
      >
        Baixar os dois
      </button>
    </div>
  );
}
