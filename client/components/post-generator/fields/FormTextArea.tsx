'use client';

import { ChangeEvent } from 'react';
import { FieldLabel } from './FieldLabel';
import { FIELD_INPUT_CLASS_NAME } from './input-class-name';

interface FormTextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
}

export function FormTextArea({ id, label, value, onChange, hint, rows = 4 }: FormTextAreaProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    onChange(event.target.value);
  }

  return (
    <label htmlFor={id} className="mb-3 block">
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        rows={rows}
        className={`${FIELD_INPUT_CLASS_NAME} resize-y`}
      />
    </label>
  );
}
