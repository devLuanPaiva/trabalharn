'use client';

import { useEffect, useRef, useState } from 'react';
import { generateJobPost } from '@/lib/post-generator/api';
import { INITIAL_JOB_POSTING_FORM_STATE } from '@/lib/post-generator/constants';
import { toJobPostingRequest } from '@/lib/post-generator/job-posting-mapper';
import { GeneratedPost, JobPostingFormState, PostPreviewFormat } from '@/lib/post-generator/types';

const GENERATE_DEBOUNCE_MS = 500;
const GENERIC_ERROR_MESSAGE = 'Não foi possível gerar a arte. Tente novamente em instantes.';

export function usePostGeneratorForm() {
  const [formState, setFormState] = useState<JobPostingFormState>(INITIAL_JOB_POSTING_FORM_STATE);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [activeFormat, setActiveFormat] = useState<PostPreviewFormat>('feed');
  const [isGenerating, setIsGenerating] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const latestRequestId = useRef(0);

  function updateField<Field extends keyof JobPostingFormState>(
    field: Field,
    value: JobPostingFormState[Field],
  ): void {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  useEffect(() => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    const timeoutId = setTimeout(() => {
      setIsGenerating(true);
      setErrorMessage(null);

      const payload = toJobPostingRequest(formState);
      if (!payload.jobTitle) {
        setIsGenerating(false);
        return;
      }

      generateJobPost(payload)
        .then((result) => {
          if (latestRequestId.current === requestId) {
            setGeneratedPost(result);
          }
        })
        .catch((error: unknown) => {
          if (latestRequestId.current === requestId) {
            setErrorMessage(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE);
          }
        })
        .finally(() => {
          if (latestRequestId.current === requestId) {
            setIsGenerating(false);
          }
        });
    }, GENERATE_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [formState]);

  return {
    formState,
    updateField,
    generatedPost,
    activeFormat,
    setActiveFormat,
    isGenerating,
    errorMessage,
  };
}
