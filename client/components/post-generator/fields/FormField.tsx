'use client';

import { ChangeEvent } from 'react';
import { FieldLabel } from './FieldLabel';
import { FIELD_INPUT_CLASS_NAME } from './input-class-name';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  type?: 'text' | 'number';
  min?: number;
  listId?: string;
}

export function FormField({ id, label, value, onChange, hint, type = 'text', min, listId }: FormFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange(event.target.value);
  }

  return (
    <label htmlFor={id} className="mb-3 block">
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      <input
        id={id}
        type={type}
        min={min}
        list={listId}
        value={value}
        onChange={handleChange}
        className={FIELD_INPUT_CLASS_NAME}
      />
    </label>
  );
}
