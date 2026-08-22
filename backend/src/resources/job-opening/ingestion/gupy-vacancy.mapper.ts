import { CreateJobOpeningDto } from '../dto/create-job-opening.dto';
import { JobPostingDto } from '../../post-generator/dto/job-posting.dto';
import {
  computeJobOpeningHash,
  IbgeMunicipio,
  isRnMunicipality,
  normalizeCityCasing,
  stripHtml,
  translateWorkplaceType,
} from './shared.util';
import { GupyVacanciesResponse, GupyVacancy } from './gupy.types';

const GUPY_SOURCE = 'gupy';
const RN_STATE_NAME = 'Rio Grande do Norte';
const RN_STATE_CODE = 'RN';
const MAX_VACANCY_AGE_DAYS = 30;
const UNKNOWN_SALARY_LABEL = 'A combinar';
const STORY_FOOTER_TEXT = 'Siga @trabalharn e não perca as vagas';

const GUPY_CONTRACT_TYPE_LABELS: Record<string, string> = {
  vacancy_type_effective: 'CLT',
  vacancy_legal_entity: 'PJ',
  vacancy_type_talent_pool: 'Banco de Talentos',
};

export interface MappedGupyVacancy {
  jobOpening: CreateJobOpeningDto;
  jobPosting: JobPostingDto;
}

export function mapGupyContractType(
  vacancyType: string | undefined,
): string | undefined {
  return vacancyType ? GUPY_CONTRACT_TYPE_LABELS[vacancyType] : undefined;
}

export function buildGupyLocation(vacancy: GupyVacancy): string {
  const city = vacancy.city ? normalizeCityCasing(vacancy.city) : '';
  return [city, RN_STATE_CODE].filter(Boolean).join(', ');
}

const URL_HOST_PATTERN = /^[a-z][a-z0-9+.-]*:\/\/([^/?#]+)/i;

export function extractUrlHost(url: string | undefined): string {
  const match = url ? URL_HOST_PATTERN.exec(url) : null;
  return match ? match[1] : '';
}

export function buildGupyCareersDomain(vacancy: GupyVacancy): string {
  return extractUrlHost(vacancy.careerPageUrl);
}

export function isGupyVacancyRecent(
  publishedDate: string | undefined,
  referenceDate: Date,
  maxAgeDays: number = MAX_VACANCY_AGE_DAYS,
): boolean {
  if (!publishedDate) {
    return false;
  }
  const published = new Date(publishedDate);
  if (Number.isNaN(published.getTime())) {
    return false;
  }
  const ageInMs = referenceDate.getTime() - published.getTime();
  const maxAgeInMs = maxAgeDays * 24 * 60 * 60 * 1000;
  return ageInMs >= 0 && ageInMs <= maxAgeInMs;
}

export function hasDisclosedGupyCompany(vacancy: GupyVacancy): boolean {
  const name = vacancy.careerPageName?.trim().toLowerCase() ?? '';
  return name.length > 0 && !name.includes('confidencial');
}

export function isGupyVacancyInRn(
  vacancy: GupyVacancy,
  municipios: IbgeMunicipio[],
): boolean {
  return (
    vacancy.state === RN_STATE_NAME &&
    isRnMunicipality(vacancy.city, municipios)
  );
}

export function mapGupyVacancyToJobOpening(
  vacancy: GupyVacancy,
): CreateJobOpeningDto {
  const externalId = String(vacancy.id).slice(0, 120);
  const hash = computeJobOpeningHash(GUPY_SOURCE, externalId);

  return {
    title: vacancy.name.trim().slice(0, 255),
    description: stripHtml(vacancy.description) || undefined,
    wage: UNKNOWN_SALARY_LABEL,
    workingHours: translateWorkplaceType(vacancy.workplaceType)?.slice(0, 120),
    contractType: mapGupyContractType(vacancy.type)?.slice(0, 60),
    location: buildGupyLocation(vacancy).slice(0, 160) || undefined,
    companyName: vacancy.careerPageName?.slice(0, 160),
    source: GUPY_SOURCE,
    externalId,
    postUrl: vacancy.jobUrl,
    hash,
    publishedAt: vacancy.publishedDate
      ? new Date(vacancy.publishedDate)
      : undefined,
  };
}

export function mapGupyVacancyToJobPosting(
  vacancy: GupyVacancy,
): JobPostingDto {
  return {
    jobTitle: vacancy.name.trim().slice(0, 80),
    companyName: vacancy.careerPageName?.slice(0, 80),
    city: buildGupyLocation(vacancy).slice(0, 60) || undefined,
    contractType: mapGupyContractType(vacancy.type)?.slice(0, 40),
    salary: UNKNOWN_SALARY_LABEL,
    workplaceType: translateWorkplaceType(vacancy.workplaceType)?.slice(0, 60),
    vacancyCount: 1,
    applicationInstructions: buildGupyCareersDomain(vacancy).slice(0, 140),
    storyFooterText: STORY_FOOTER_TEXT,
  };
}

export function filterAndMapRnGupyVacancies(
  response: GupyVacanciesResponse,
  municipios: IbgeMunicipio[],
  referenceDate: Date = new Date(),
): MappedGupyVacancy[] {
  const vacancies = response.data ?? [];

  return vacancies
    .filter((vacancy) => isGupyVacancyInRn(vacancy, municipios))
    .filter((vacancy) =>
      isGupyVacancyRecent(vacancy.publishedDate, referenceDate),
    )
    .filter(hasDisclosedGupyCompany)
    .map((vacancy) => ({
      jobOpening: mapGupyVacancyToJobOpening(vacancy),
      jobPosting: mapGupyVacancyToJobPosting(vacancy),
    }));
}
