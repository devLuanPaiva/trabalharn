import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { JobPostingDto } from './job-posting.dto';

async function validateJobPosting(payload: Record<string, unknown>) {
  const jobPosting = plainToInstance(JobPostingDto, payload);
  return validate(jobPosting);
}

describe('JobPostingDto', () => {
  it('passes with only the required jobTitle field', async () => {
    const errors = await validateJobPosting({ jobTitle: 'Vendedor' });

    expect(errors).toHaveLength(0);
  });

  it('fails when jobTitle is missing', async () => {
    const errors = await validateJobPosting({});

    expect(errors.some((error) => error.property === 'jobTitle')).toBe(true);
  });

  it('fails when jobTitle exceeds the max length', async () => {
    const errors = await validateJobPosting({ jobTitle: 'a'.repeat(81) });

    expect(errors.some((error) => error.property === 'jobTitle')).toBe(true);
  });

  it('fails when requirements has more than 5 items', async () => {
    const errors = await validateJobPosting({
      jobTitle: 'Vendedor',
      requirements: ['1', '2', '3', '4', '5', '6'],
    });

    expect(errors.some((error) => error.property === 'requirements')).toBe(
      true,
    );
  });

  it('fails when vacancyCount is not a positive integer', async () => {
    const errors = await validateJobPosting({
      jobTitle: 'Vendedor',
      vacancyCount: 0,
    });

    expect(errors.some((error) => error.property === 'vacancyCount')).toBe(
      true,
    );
  });

  it('accepts a fully populated valid payload', async () => {
    const errors = await validateJobPosting({
      jobTitle: 'Auxiliar Administrativo',
      companyName: 'Supermercado Nordestão',
      city: 'Natal / RN',
      contractType: 'CLT',
      salary: 'R$ 1.800',
      workSchedule: 'Seg a sex, 8h às 17h',
      vacancyCount: 3,
      requirements: ['Ensino médio completo'],
      applicationInstructions: 'Envie o currículo',
      storyFooterText: 'Siga @trabalharn',
    });

    expect(errors).toHaveLength(0);
  });
});
