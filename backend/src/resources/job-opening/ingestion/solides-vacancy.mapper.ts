import { CreateJobOpeningDto } from '../dto/create-job-opening.dto';
import { JobPostingDto } from '../../post-generator/dto/job-posting.dto';
import {
  computeJobOpeningHash,
  IbgeMunicipio,
  isRnMunicipality,
  normalizeCityCasing,
  stripHtml,
} from './shared.util';
import {
  SolidesSalary,
  SolidesVacancy,
  SolidesVacanciesResponse,
} from './solides.types';

export {
  computeJobOpeningHash,
  isRnMunicipality,
  normalizeCityCasing,
  normalizeMunicipalityName,
  stripHtml,
} from './shared.util';

const SOLIDES_SOURCE = 'solides';
const STORY_FOOTER_TEXT = 'Siga @trabalharn e não perca as vagas';

export interface MappedVacancy {
  jobOpening: CreateJobOpeningDto;
  jobPosting: JobPostingDto;
}

export function formatSalary(salary: SolidesSalary | undefined): string {
  if (!salary || salary.negotiable) {
    return 'A combinar';
  }
  const { initialRange, finalRange, showRangeToApplicant } = salary;
  if (!showRangeToApplicant || (!initialRange && !finalRange)) {
    return 'A combinar';
  }

  const format = (value: number): string =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (!initialRange || initialRange === finalRange) {
    return format(finalRange as number);
  }
  return `${format(initialRange)} - ${format(finalRange as number)}`;
}

export function buildLocation(vacancy: SolidesVacancy): string {
  const city = vacancy.city?.name ? normalizeCityCasing(vacancy.city.name) : '';
  const stateCode = vacancy.state?.code ?? '';
  return [city, stateCode].filter(Boolean).join(', ');
}

/**
 * The company-specific subdomain doesn't point at the individual vacancy
 * (Solides has no stable public per-vacancy URL under this domain), so this
 * is a link to the company's careers page, not the exact listing.
 */
export function buildSolidesCareersUrl(vacancy: SolidesVacancy): string {
  return vacancy.slug
    ? `https://${vacancy.slug}.vagas.solides.com.br`
    : 'https://vagas.solides.com.br';
}

/**
 * Bare domain (no protocol) for display in captions/art — links aren't
 * clickable on Instagram anyway, so the "https://" is just noise there.
 */
export function buildSolidesCareersDomain(vacancy: SolidesVacancy): string {
  return buildSolidesCareersUrl(vacancy).replace(/^https?:\/\//, '');
}

export function mapSolidesVacancyToJobOpening(
  vacancy: SolidesVacancy,
): CreateJobOpeningDto {
  const externalId = String(vacancy.id).slice(0, 120);
  const postUrl = buildSolidesCareersUrl(vacancy);
  const hash = computeJobOpeningHash(SOLIDES_SOURCE, externalId);
  const contractType = vacancy.recruitmentContractType?.[0]?.name ?? undefined;
  const requirements = vacancy.hardSkills?.length
    ? vacancy.hardSkills.map((skill) => skill.name).join('\n')
    : undefined;

  return {
    title: vacancy.title.slice(0, 255),
    description: stripHtml(vacancy.description) || undefined,
    requirements,
    wage: formatSalary(vacancy.salary).slice(0, 120),
    workingHours: vacancy.jobType?.slice(0, 120),
    contractType: contractType?.slice(0, 60),
    location: buildLocation(vacancy).slice(0, 160) || undefined,
    companyName: vacancy.companyName?.slice(0, 160),
    source: SOLIDES_SOURCE,
    externalId,
    postUrl,
    hash,
    publishedAt: vacancy.createdAt ? new Date(vacancy.createdAt) : undefined,
  };
}

export function mapSolidesVacancyToJobPosting(
  vacancy: SolidesVacancy,
): JobPostingDto {
  const contractType = vacancy.recruitmentContractType?.[0]?.name;
  const vacancyCount = Math.min(
    999,
    Math.max(1, vacancy.availablePositions ?? vacancy.openPositions ?? 1),
  );

  return {
    jobTitle: vacancy.title.slice(0, 80),
    companyName: vacancy.companyName?.slice(0, 80),
    city: buildLocation(vacancy).slice(0, 60) || undefined,
    contractType: contractType?.slice(0, 40),
    salary: formatSalary(vacancy.salary).slice(0, 60),
    workSchedule: vacancy.jobType?.slice(0, 60),
    vacancyCount,
    requirements: vacancy.hardSkills
      ?.slice(0, 5)
      .map((skill) => skill.name.slice(0, 100)),
    applicationInstructions: buildSolidesCareersDomain(vacancy).slice(0, 140),
    storyFooterText: STORY_FOOTER_TEXT,
  };
}

/**
 * A confidential/blank company name means there's no employer to credit or
 * verify — nothing worth publishing under the TrabalhaRN brand.
 */
export function hasDisclosedCompany(vacancy: SolidesVacancy): boolean {
  const name = vacancy.companyName?.trim().toLowerCase() ?? '';
  return name.length > 0 && !name.includes('confidencial');
}

export function filterAndMapRnVacancies(
  response: SolidesVacanciesResponse,
  municipios: IbgeMunicipio[],
): MappedVacancy[] {
  const vacancies = response.data?.data ?? [];

  return vacancies
    .filter((vacancy) => vacancy.state?.code === 'RN')
    .filter((vacancy) => isRnMunicipality(vacancy.city?.name, municipios))
    .filter(hasDisclosedCompany)
    .map((vacancy) => ({
      jobOpening: mapSolidesVacancyToJobOpening(vacancy),
      jobPosting: mapSolidesVacancyToJobPosting(vacancy),
    }));
}
