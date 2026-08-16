'use client';

import { JobPostingFormState } from '@/lib/post-generator/types';
import { ApplicationFields } from './ApplicationFields';
import { CaptionPanel } from './CaptionPanel';
import { JobDetailsFields } from './JobDetailsFields';
import { RequirementsField } from './RequirementsField';

interface FormPanelProps {
  formState: JobPostingFormState;
  updateField: <Field extends keyof JobPostingFormState>(
    field: Field,
    value: JobPostingFormState[Field],
  ) => void;
  caption: string;
}

export function FormPanel({ formState, updateField, caption }: FormPanelProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(10,50,25,0.1)] sm:p-6">
      <h2 className="mb-4 text-[15px] font-bold uppercase tracking-[2px] text-brand-green">Dados da vaga</h2>
      <JobDetailsFields formState={formState} updateField={updateField} />
      <RequirementsField formState={formState} updateField={updateField} />
      <ApplicationFields formState={formState} updateField={updateField} />
      <CaptionPanel caption={caption} />
    </section>
  );
}
