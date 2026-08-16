'use client';

import { JobPostingFormState } from '@/lib/post-generator/types';
import { FormTextArea } from './fields/FormTextArea';

interface RequirementsFieldProps {
  formState: JobPostingFormState;
  updateField: <Field extends keyof JobPostingFormState>(
    field: Field,
    value: JobPostingFormState[Field],
  ) => void;
}

export function RequirementsField({ formState, updateField }: RequirementsFieldProps) {
  return (
    <FormTextArea
      id="requirementsText"
      label="Requisitos"
      hint="— um por linha, até 5"
      rows={4}
      value={formState.requirementsText}
      onChange={(value) => updateField('requirementsText', value)}
    />
  );
}
