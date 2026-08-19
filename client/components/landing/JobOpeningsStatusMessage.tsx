interface JobOpeningsStatusMessageProps {
  message: string;
}

export function JobOpeningsStatusMessage({ message }: JobOpeningsStatusMessageProps) {
  return (
    <p className="rounded-2xl border border-dashed border-brand-divider bg-white px-6 py-10 text-center text-brand-muted">
      {message}
    </p>
  );
}
