import { fetchFeaturedJobOpenings } from '@/lib/job-openings/api';
import { JobOpeningsGrid } from './JobOpeningsGrid';
import { JobOpeningsStatusMessage } from './JobOpeningsStatusMessage';

const FEATURED_JOB_OPENINGS_LIMIT = 6;
const LOAD_FAILURE_MESSAGE = 'Não foi possível carregar as vagas agora. Tente novamente em instantes.';

export async function JobOpeningsSection() {
  const jobOpenings = await fetchFeaturedJobOpenings({ limit: FEATURED_JOB_OPENINGS_LIMIT }).catch(() => null);

  return (
    <section id="vagas" className="mx-auto max-w-6xl bg-white px-6 py-16">
      <header className="mb-10 max-w-2xl">
        <h2 className="text-3xl font-bold text-brand-ink">Vagas em destaque</h2>
        <p className="mt-2 text-brand-muted">Atualizado direto das empresas parceiras no Rio Grande do Norte.</p>
      </header>

      {jobOpenings === null ? (
        <JobOpeningsStatusMessage message={LOAD_FAILURE_MESSAGE} />
      ) : (
        <JobOpeningsGrid jobOpenings={jobOpenings} />
      )}
    </section>
  );
}
