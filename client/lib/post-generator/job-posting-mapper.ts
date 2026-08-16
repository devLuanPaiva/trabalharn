import { MAX_VISIBLE_REQUIREMENTS } from './constants';
import { JobPostingFormState, JobPostingRequest } from './types';

export function parseRequirementsText(requirementsText: string): string[] {
  return requirementsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, MAX_VISIBLE_REQUIREMENTS);
}

function parseVacancyCount(vacancyCount: string): number | undefined {
  const parsed = Number.parseInt(vacancyCount, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function trimOrUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function toJobPostingRequest(formState: JobPostingFormState): JobPostingRequest {
  return {
    jobTitle: formState.jobTitle.trim(),
    companyName: trimOrUndefined(formState.companyName),
    city: trimOrUndefined(formState.city),
    contractType: trimOrUndefined(formState.contractType),
    salary: trimOrUndefined(formState.salary),
    workSchedule: trimOrUndefined(formState.workSchedule),
    vacancyCount: parseVacancyCount(formState.vacancyCount),
    requirements: parseRequirementsText(formState.requirementsText),
    applicationInstructions: trimOrUndefined(formState.applicationInstructions),
    storyFooterText: trimOrUndefined(formState.storyFooterText),
  };
}
