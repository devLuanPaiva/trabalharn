import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JobOpening } from '@/lib/job-openings/types';
import { JobOpeningCard } from './JobOpeningCard';

const BASE_JOB_OPENING: JobOpening = {
  id: '1',
  title: 'Atendente de loja',
  description: null,
  requirements: null,
  wage: 'R$ 1.500,00',
  workingHours: '44h semanais',
  contractType: 'CLT',
  location: 'Natal, RN',
  companyName: 'Loja do Bairro',
  source: 'solides',
  postUrl: 'https://example.com/vagas/1',
  publishedAt: null,
};

describe('JobOpeningCard', () => {
  it('renders the job title, company and badges', () => {
    render(<JobOpeningCard jobOpening={BASE_JOB_OPENING} />);

    expect(screen.getByText('Atendente de loja')).toBeInTheDocument();
    expect(screen.getByText('Loja do Bairro')).toBeInTheDocument();
    expect(screen.getByText(/Natal, RN/)).toBeInTheDocument();
    expect(screen.getByText(/CLT/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 1\.500,00/)).toBeInTheDocument();
  });

  it('links to the original post URL in a new tab', () => {
    render(<JobOpeningCard jobOpening={BASE_JOB_OPENING} />);

    const applyLink = screen.getByRole('link', { name: 'Candidatar-se' });
    expect(applyLink).toHaveAttribute('href', 'https://example.com/vagas/1');
    expect(applyLink).toHaveAttribute('target', '_blank');
    expect(applyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('falls back to a placeholder when the company name is missing', () => {
    render(<JobOpeningCard jobOpening={{ ...BASE_JOB_OPENING, companyName: null }} />);

    expect(screen.getByText('Empresa não informada')).toBeInTheDocument();
  });

  it('omits badges for fields that were not informed', () => {
    render(
      <JobOpeningCard jobOpening={{ ...BASE_JOB_OPENING, location: null, contractType: null, wage: null }} />,
    );

    expect(screen.queryByText(/Natal, RN/)).not.toBeInTheDocument();
    expect(screen.queryByText(/CLT/)).not.toBeInTheDocument();
    expect(screen.queryByText(/R\$/)).not.toBeInTheDocument();
  });
});
