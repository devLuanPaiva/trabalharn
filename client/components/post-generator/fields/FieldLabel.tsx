interface FieldLabelProps {
  htmlFor: string;
  label: string;
  hint?: string;
}

export function FieldLabel({ htmlFor, label, hint }: FieldLabelProps) {
  return (
    <span
      id={`${htmlFor}-label`}
      className="mb-1.5 block text-[12.5px] font-bold uppercase tracking-wide text-brand-muted"
    >
      {label}
      {hint && <span className="ml-1 font-medium normal-case tracking-normal text-gray-400">{hint}</span>}
    </span>
  );
}
