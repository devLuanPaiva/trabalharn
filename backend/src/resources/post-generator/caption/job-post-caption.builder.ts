import { buildVisibleRequirements } from '../rendering/job-post-content.builder';
import { JobPostingData } from '../types/job-posting-data.type';

const FIXED_HASHTAGS = '#TrabalhaRN #VagasRN #EmpregoRN #RioGrandeDoNorte';

export function buildJobPostCaption(jobPosting: JobPostingData): string {
  const lines: string[] = [];

  lines.push(
    `📢 VAGA DE EMPREGO — ${(jobPosting.jobTitle || '').toUpperCase()}`,
  );

  if (jobPosting.companyName) {
    lines.push(`🏢 ${jobPosting.companyName}`);
  }
  if (jobPosting.city) {
    lines.push(`📍 ${jobPosting.city}`);
  }
  if (jobPosting.contractType) {
    lines.push(
      `💼 ${jobPosting.contractType}${buildVacancySuffix(jobPosting.vacancyCount)}`,
    );
  }
  if (jobPosting.salary) {
    lines.push(`💰 ${jobPosting.salary}`);
  }
  if (jobPosting.workSchedule) {
    lines.push(`⏰ ${jobPosting.workSchedule}`);
  }

  const requirements = buildVisibleRequirements(jobPosting);
  if (requirements.length) {
    lines.push('', '✅ Requisitos:');
    requirements.forEach((requirement) => lines.push(`• ${requirement}`));
  }

  if (jobPosting.applicationInstructions) {
    lines.push('', `📩 ${jobPosting.applicationInstructions}`);
  }

  lines.push('', `${FIXED_HASHTAGS}${buildCityHashtag(jobPosting.city)}`);

  return lines.join('\n');
}

function buildVacancySuffix(vacancyCount: number | undefined): string {
  return vacancyCount && vacancyCount > 1 ? ` — ${vacancyCount} vagas` : '';
}

function buildCityHashtag(city: string | undefined): string {
  // City comes as either "City / UF" or "City, UF" depending on the source
  // (Solides' ingestion mapper joins with ", ").
  const cityTag = (city ?? '')
    .split(/[/,]/)[0]
    .trim()
    .replace(/\s+/g, '');
  return cityTag ? ` #${cityTag}` : '';
}
