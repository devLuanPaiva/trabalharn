'use client';

import { usePostGeneratorForm } from '@/hooks/usePostGeneratorForm';
import { BrandLogoHeader } from './BrandLogoHeader';
import { FormPanel } from './FormPanel';
import { PreviewPanel } from './PreviewPanel';

export function PostGeneratorPage() {
  const { formState, updateField, generatedPost, activeFormat, setActiveFormat, isGenerating, errorMessage } =
    usePostGeneratorForm();

  return (
    <div className="min-h-screen bg-[#F2F5F3] text-brand-ink">
      <BrandLogoHeader />
      <main className="mx-auto grid max-w-[1240px] grid-cols-1 gap-5.5 px-5 py-6 lg:grid-cols-2">
        <FormPanel formState={formState} updateField={updateField} caption={generatedPost?.caption ?? ''} />
        <PreviewPanel
          generatedPost={generatedPost}
          activeFormat={activeFormat}
          onSelectFormat={setActiveFormat}
          isGenerating={isGenerating}
          errorMessage={errorMessage}
          jobTitle={formState.jobTitle}
        />
      </main>
      <footer className="mx-auto max-w-[1240px] px-5 pb-10 text-[13px] text-brand-muted">
        As imagens saem em PNG no tamanho exato para o feed e para os stories, geradas pelo servidor do TrabalhaRN.
      </footer>
    </div>
  );
}
