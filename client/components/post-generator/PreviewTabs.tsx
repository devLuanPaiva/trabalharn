'use client';

import { PostPreviewFormat } from '@/lib/post-generator/types';

interface PreviewTabsProps {
  activeFormat: PostPreviewFormat;
  onSelect: (format: PostPreviewFormat) => void;
}

const TABS: Array<{ format: PostPreviewFormat; label: string }> = [
  { format: 'feed', label: 'Post 1080×1350' },
  { format: 'story', label: 'Story 1080×1920' },
];

export function PreviewTabs({ activeFormat, onSelect }: PreviewTabsProps) {
  return (
    <div role="tablist" className="mb-4 flex gap-2">
      {TABS.map((tab) => {
        const isSelected = tab.format === activeFormat;
        return (
          <button
            key={tab.format}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(tab.format)}
            className={`flex-1 rounded-[10px] border-[1.5px] px-2.5 py-2.5 text-[13px] font-bold transition-colors ${
              isSelected
                ? 'border-brand-green bg-brand-green text-white'
                : 'border-brand-divider bg-white text-brand-muted'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
