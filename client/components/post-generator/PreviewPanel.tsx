'use client';

import { GeneratedPost, PostPreviewFormat } from '@/lib/post-generator/types';
import { DownloadButtons } from './DownloadButtons';
import { PreviewImage } from './PreviewImage';
import { PreviewTabs } from './PreviewTabs';

interface PreviewPanelProps {
  generatedPost: GeneratedPost | null;
  activeFormat: PostPreviewFormat;
  onSelectFormat: (format: PostPreviewFormat) => void;
  isGenerating: boolean;
  errorMessage: string | null;
  jobTitle: string;
}

export function PreviewPanel({
  generatedPost,
  activeFormat,
  onSelectFormat,
  isGenerating,
  errorMessage,
  jobTitle,
}: PreviewPanelProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(10,50,25,0.1)] sm:p-6">
      <h2 className="mb-4 text-[15px] font-bold uppercase tracking-[2px] text-brand-green">Prévia</h2>
      <PreviewTabs activeFormat={activeFormat} onSelect={onSelectFormat} />
      <PreviewImage
        generatedPost={generatedPost}
        activeFormat={activeFormat}
        isGenerating={isGenerating}
        errorMessage={errorMessage}
      />
      <DownloadButtons generatedPost={generatedPost} jobTitle={jobTitle} />
    </section>
  );
}
