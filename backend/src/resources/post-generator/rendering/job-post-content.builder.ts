import { JobPostingData } from '../types/job-posting-data.type';
import { BRAND_COLORS } from './brand-colors.constant';
import { JobPostIconName } from './job-post-icons.draw';
import { MAX_REQUIREMENTS_SHOWN } from './job-post-layout.constant';

export interface JobPostBadge {
  label: string;
  backgroundColor: string;
  foregroundColor: string;
}

export interface JobPostDetailRow {
  icon: JobPostIconName;
  label: string;
  value: string;
}

export function buildJobPostBadges(jobPosting: JobPostingData): JobPostBadge[] {
  const badges: JobPostBadge[] = [];
  const vacancyCount = jobPosting.vacancyCount;
  const vacancyLabel =
    vacancyCount && vacancyCount > 1 ? `${vacancyCount} VAGAS` : 'VAGA ABERTA';

  badges.push({
    label: vacancyLabel,
    backgroundColor: BRAND_COLORS.yellow,
    foregroundColor: BRAND_COLORS.ink,
  });

  if (jobPosting.contractType) {
    badges.push({
      label: jobPosting.contractType.toUpperCase(),
      backgroundColor: BRAND_COLORS.blue,
      foregroundColor: BRAND_COLORS.white,
    });
  }

  return badges;
}

export function buildJobPostDetailRows(
  jobPosting: JobPostingData,
): JobPostDetailRow[] {
  const rows: JobPostDetailRow[] = [];

  if (jobPosting.city) {
    rows.push({ icon: 'pin', label: 'LOCAL', value: jobPosting.city });
  }
  if (jobPosting.salary) {
    rows.push({ icon: 'money', label: 'SALÁRIO', value: jobPosting.salary });
  }
  if (jobPosting.workplaceType) {
    rows.push({
      icon: 'case',
      label: 'MODALIDADE',
      value: jobPosting.workplaceType,
    });
  }
  if (jobPosting.workSchedule) {
    rows.push({
      icon: 'clock',
      label: 'HORÁRIO',
      value: jobPosting.workSchedule,
    });
  }

  return rows;
}

export function buildVisibleRequirements(jobPosting: JobPostingData): string[] {
  return (jobPosting.requirements ?? [])
    .map((requirement) => requirement.trim())
    .filter((requirement) => requirement.length > 0)
    .slice(0, MAX_REQUIREMENTS_SHOWN);
}
