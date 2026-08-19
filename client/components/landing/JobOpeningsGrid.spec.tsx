import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JobOpening } from '@/lib/job-openings/types';
import { JobOpeningsGrid } from './JobOpeningsGrid';

function buildJobOpening(overrides: Partial<JobOpening>): JobOpening {
  return {
    id: '1',
    title: 'Atendente de loja',
    description: null,
    requirements: null,
    wage: null,
    workingHours: null,
    contractType: null,
    location: null,
    companyName: null,
    source: 'solides',
    postUrl: 'https://example.com/vagas/1',
    publishedAt: null,
    ...overrides,
  };
}

describe('JobOpeningsGrid', () => {
  it('shows an empty state message when there are no job openings', () => {
    render(<JobOpeningsGrid jobOpenings={[]} />);

    expect(screen.getByText('Nenhuma vaga publicada no momento. Volte em breve!')).toBeInTheDocument();
  });

  it('renders one card per job opening', () => {
    render(
      <JobOpeningsGrid
        jobOpenings={[
          buildJobOpening({ id: '1', title: 'Atendente de loja' }),
          buildJobOpening({ id: '2', title: 'Motorista entregador' }),
        ]}
      />,
    );

    expect(screen.getByText('Atendente de loja')).toBeInTheDocument();
    expect(screen.getByText('Motorista entregador')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Candidatar-se' })).toHaveLength(2);
  });
});
