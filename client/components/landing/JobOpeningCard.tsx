import { JobOpening } from '@/lib/job-openings/types';

interface JobOpeningCardProps {
  jobOpening: JobOpening;
}

export function JobOpeningCard({ jobOpening }: JobOpeningCardProps) {
  const { title, companyName, location, contractType, wage, postUrl } = jobOpening;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-brand-divider bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <h3 className="text-lg font-bold text-brand-ink">{title}</h3>
        <p className="text-sm text-brand-muted">{companyName ?? 'Empresa não informada'}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {location && (
          <span className="rounded-full bg-brand-green/10 px-3 py-1 text-brand-ink">📍 {location}</span>
        )}
        {contractType && (
          <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-brand-ink">💼 {contractType}</span>
        )}
        {wage && <span className="rounded-full bg-brand-yellow/20 px-3 py-1 text-brand-ink">💰 {wage}</span>}
      </div>

      <a
        href={postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center rounded-full bg-brand-green px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-green/90"
      >
        Candidatar-se
      </a>
    </article>
  );
}
