import { createHash } from 'crypto';

export interface IbgeMunicipio {
  id: number;
  nome: string;
}

const COMBINING_DIACRITICS_RANGE = { start: 0x0300, end: 0x036f };

function stripDiacritics(value: string): string {
  return Array.from(value.normalize('NFD'))
    .filter((char) => {
      const codePoint = char.codePointAt(0) ?? 0;
      return (
        codePoint < COMBINING_DIACRITICS_RANGE.start ||
        codePoint > COMBINING_DIACRITICS_RANGE.end
      );
    })
    .join('');
}

export function normalizeMunicipalityName(name: string): string {
  return stripDiacritics(name).trim().toLowerCase();
}

export function isRnMunicipality(
  cityName: string | undefined,
  municipios: IbgeMunicipio[],
): boolean {
  if (!cityName) {
    return false;
  }
  const normalized = normalizeMunicipalityName(cityName);
  return municipios.some(
    (municipio) => normalizeMunicipalityName(municipio.nome) === normalized,
  );
}

export function stripHtml(html: string | undefined | null): string {
  if (!html) {
    return '';
  }
  return html
    .replace(/<\/(p|li|div|br)>/gi, '\n')
    .replace(/<li>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isShoutingCase(value: string): boolean {
  return value === value.toUpperCase() && /[a-z]/i.test(value);
}

/**
 * Job portals mix already well-cased city names ("Pau dos Ferros") with
 * SHOUTING ones ("NATAL"). Only the latter need fixing — re-title-casing an
 * already-correct name would wrongly capitalize words like "dos".
 */
export function normalizeCityCasing(value: string): string {
  const trimmed = value.trim();
  if (!isShoutingCase(trimmed)) {
    return trimmed;
  }
  return trimmed
    .toLowerCase()
    .replace(/(^|\s|\/)\S/g, (match) => match.toUpperCase());
}

export function computeJobOpeningHash(
  source: string,
  externalId: string,
): string {
  return createHash('sha256').update(`${source}:${externalId}`).digest('hex');
}

const WORKPLACE_TYPE_LABELS: Record<string, string> = {
  'on-site': 'Presencial',
  presencial: 'Presencial',
  remote: 'Remoto',
  remoto: 'Remoto',
  hybrid: 'Híbrido',
  híbrido: 'Híbrido',
  hibrido: 'Híbrido',
};

export function translateWorkplaceType(
  rawValue: string | undefined,
): string | undefined {
  if (!rawValue) {
    return undefined;
  }
  const normalized = rawValue.trim().toLowerCase();
  return WORKPLACE_TYPE_LABELS[normalized] ?? rawValue;
}
