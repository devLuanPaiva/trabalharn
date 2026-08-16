'use client';

import { JobPostingFormState } from '@/lib/post-generator/types';
import { FormField } from './fields/FormField';

interface ApplicationFieldsProps {
  formState: JobPostingFormState;
  updateField: <Field extends keyof JobPostingFormState>(
    field: Field,
    value: JobPostingFormState[Field],
  ) => void;
}

export function ApplicationFields({ formState, updateField }: ApplicationFieldsProps) {
  return (
    <div>
      <FormField
        id="applicationInstructions"
        label="Como se candidatar"
        value={formState.applicationInstructions}
        onChange={(value) => updateField('applicationInstructions', value)}
      />
      <FormField
        id="storyFooterText"
        label="Rodapé do story"
        hint="(só aparece no story)"
        value={formState.storyFooterText}
        onChange={(value) => updateField('storyFooterText', value)}
      />
    </div>
  );
}
