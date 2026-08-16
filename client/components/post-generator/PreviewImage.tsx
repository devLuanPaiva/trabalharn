import { GeneratedPost, PostPreviewFormat } from '@/lib/post-generator/types';

interface PreviewImageProps {
  generatedPost: GeneratedPost | null;
  activeFormat: PostPreviewFormat;
  isGenerating: boolean;
  errorMessage: string | null;
}

function pickImageSource(generatedPost: GeneratedPost | null, activeFormat: PostPreviewFormat): string | null {
  if (!generatedPost) {
    return null;
  }
  return activeFormat === 'feed' ? generatedPost.feedImageBase64 : generatedPost.storyImageBase64;
}

export function PreviewImage({ generatedPost, activeFormat, isGenerating, errorMessage }: PreviewImageProps) {
  const imageSource = pickImageSource(generatedPost, activeFormat);

  return (
    <div className="relative flex justify-center rounded-xl bg-[#EDF2EF] p-3.5">
      {imageSource && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSource}
          alt="Prévia da arte de vaga"
          className="max-h-[62vh] w-auto rounded-lg shadow-[0_2px_10px_rgba(10,50,25,0.15)]"
        />
      )}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60 text-sm font-bold text-brand-muted">
          Gerando arte…
        </div>
      )}
      {errorMessage && (
        <div className="absolute inset-x-3 bottom-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
