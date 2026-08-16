const COMBINING_DIACRITICS_RANGE_START = 0x300;
const COMBINING_DIACRITICS_RANGE_END = 0x36f;
const COMBINING_DIACRITICS_PATTERN = new RegExp(
  `[${String.fromCodePoint(COMBINING_DIACRITICS_RANGE_START)}-${String.fromCodePoint(COMBINING_DIACRITICS_RANGE_END)}]`,
  'g',
);

export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS_PATTERN, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);

  return slug || 'vaga';
}
