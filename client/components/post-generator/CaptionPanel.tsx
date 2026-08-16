'use client';

import { useState } from 'react';
import { copyTextToClipboard } from '@/lib/post-generator/clipboard';

interface CaptionPanelProps {
  caption: string;
}

const COPIED_FEEDBACK_DURATION_MS = 1800;

export function CaptionPanel({ caption }: CaptionPanelProps) {
  const [wasCopied, setWasCopied] = useState(false);

  async function handleCopyClick(): Promise<void> {
    await copyTextToClipboard(caption);
    setWasCopied(true);
    setTimeout(() => setWasCopied(false), COPIED_FEEDBACK_DURATION_MS);
  }

  return (
    <div className="mt-6">
      <h2 className="mb-4 text-[15px] font-bold uppercase tracking-[2px] text-brand-green">Legenda pronta</h2>
      <textarea
        readOnly
        rows={9}
        value={caption}
        className="w-full resize-y rounded-[10px] border-[1.5px] border-brand-divider px-3.5 py-2.5 text-[15px] text-brand-ink"
      />
      <button
        type="button"
        onClick={handleCopyClick}
        className="mt-4 min-w-[150px] rounded-[11px] bg-brand-yellow px-4 py-3 text-sm font-bold text-brand-ink"
      >
        {wasCopied ? 'Legenda copiada!' : 'Copiar legenda'}
      </button>
    </div>
  );
}
