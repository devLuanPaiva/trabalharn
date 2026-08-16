'use client';

import { CONTRACT_TYPE_OPTIONS } from '@/lib/post-generator/constants';
import { JobPostingFormState } from '@/lib/post-generator/types';
import { FormField } from './fields/FormField';

interface JobDetailsFieldsProps {
  formState: JobPostingFormState;
  updateField: <Field extends keyof JobPostingFormState>(
    field: Field,
    value: JobPostingFormState[Field],
  ) => void;
}

const CONTRACT_TYPE_LIST_ID = 'contract-type-options';

export function JobDetailsFields({ formState, updateField }: JobDetailsFieldsProps) {
  return (
    <div>
      <FormField
        id="jobTitle"
        label="Cargo"
        hint="(aparece em destaque)"
        value={formState.jobTitle}
        onChange={(value) => updateField('jobTitle', value)}
      />
      <FormField
        id="companyName"
        label="Empresa"
        hint="(opcional)"
        value={formState.companyName}
        onChange={(value) => updateField('companyName', value)}
      />
      <div className="grid grid-cols-2 gap-x-3.5">
        <FormField id="city" label="Cidade" value={formState.city} onChange={(value) => updateField('city', value)} />
        <FormField
          id="contractType"
          label="Contrato"
          listId={CONTRACT_TYPE_LIST_ID}
          value={formState.contractType}
          onChange={(value) => updateField('contractType', value)}
        />
        <FormField id="salary" label="Salário" value={formState.salary} onChange={(value) => updateField('salary', value)} />
        <FormField
          id="workSchedule"
          label="Horário"
          hint="(opcional)"
          value={formState.workSchedule}
          onChange={(value) => updateField('workSchedule', value)}
        />
      </div>
      <FormField
        id="vacancyCount"
        label="Quantidade de vagas"
        type="number"
        min={1}
        value={formState.vacancyCount}
        onChange={(value) => updateField('vacancyCount', value)}
      />
      <datalist id={CONTRACT_TYPE_LIST_ID}>
        {CONTRACT_TYPE_OPTIONS.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </div>
  );
}
