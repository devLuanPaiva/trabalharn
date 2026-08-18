import { JobOpening } from '@/lib/job-openings/types';
import { JobOpeningCard } from './JobOpeningCard';
import { JobOpeningsStatusMessage } from './JobOpeningsStatusMessage';

const EMPTY_STATE_MESSAGE = 'Nenhuma vaga publicada no momento. Volte em breve!';

interface JobOpeningsGridProps {
  jobOpenings: JobOpening[];
}

export function JobOpeningsGrid({ jobOpenings }: JobOpeningsGridProps) {
  if (jobOpenings.length === 0) {
    return <JobOpeningsStatusMessage message={EMPTY_STATE_MESSAGE} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {jobOpenings.map((jobOpening) => (
        <JobOpeningCard key={jobOpening.id} jobOpening={jobOpening} />
      ))}
    </div>
  );
}
