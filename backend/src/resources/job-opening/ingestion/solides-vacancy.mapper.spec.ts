import {
  buildLocation,
  buildSolidesCareersDomain,
  buildSolidesCareersUrl,
  computeJobOpeningHash,
  filterAndMapRnVacancies,
  formatSalary,
  hasDisclosedCompany,
  isRnMunicipality,
  mapSolidesVacancyToJobOpening,
  mapSolidesVacancyToJobPosting,
  normalizeCityCasing,
  normalizeMunicipalityName,
  stripHtml,
} from './solides-vacancy.mapper';
import {
  IbgeMunicipio,
  SolidesSalary,
  SolidesVacancy,
  SolidesVacanciesResponse,
} from './solides.types';

const RN_MUNICIPIOS: IbgeMunicipio[] = [
  { id: 2402006, nome: 'Caicó' },
  { id: 2408102, nome: 'Natal' },
  { id: 2408003, nome: 'Mossoró' },
  { id: 2408201, nome: 'Assú' },
];

function buildVacancy(overrides: Partial<SolidesVacancy> = {}): SolidesVacancy {
  return {
    id: 904705,
    title: 'Estagiário de Telefonia',
    description: '<p><strong>Objetivo</strong></p><ul><li>Item um</li></ul>',
    currentState: 'em_andamento',
    companyName: 'ELEVE SOLUCOES EMPRESARIAIS LTDA',
    state: { id: 11, name: 'Rio Grande do Norte', code: 'RN' },
    city: { id: 1164, name: 'Natal', state_id: 11 },
    redirectLink:
      'https://elevesolucoes.solides.jobs/vacancies/904705?origem=portal',
    slug: 'elevesolucoes',
    jobType: 'presencial',
    openPositions: 1,
    availablePositions: 1,
    salary: {
      type: 'simple',
      showRangeToApplicant: false,
      initialRange: null,
      finalRange: null,
      negotiable: false,
    },
    recruitmentContractType: [{ id: 167694, name: 'Estágio' }],
    hardSkills: [{ id: 1, name: 'Boa comunicação' }],
    createdAt: '2026-08-17',
    ...overrides,
  };
}

describe('normalizeMunicipalityName', () => {
  it('lowercases and strips diacritics', () => {
    expect(normalizeMunicipalityName('Caicó')).toBe('caico');
    expect(normalizeMunicipalityName('NATAL')).toBe('natal');
    expect(normalizeMunicipalityName('  Assú ')).toBe('assu');
  });
});

describe('isRnMunicipality', () => {
  it('matches regardless of case and diacritics', () => {
    expect(isRnMunicipality('NATAL', RN_MUNICIPIOS)).toBe(true);
    expect(isRnMunicipality('caico', RN_MUNICIPIOS)).toBe(true);
    expect(isRnMunicipality('Assu', RN_MUNICIPIOS)).toBe(true);
  });

  it('returns false for a city outside the list', () => {
    expect(isRnMunicipality('Fortaleza', RN_MUNICIPIOS)).toBe(false);
  });

  it('returns false when the city name is missing', () => {
    expect(isRnMunicipality(undefined, RN_MUNICIPIOS)).toBe(false);
  });
});

describe('stripHtml', () => {
  it('converts list items to bullet lines and removes tags', () => {
    const html =
      '<p><strong>Objetivo</strong></p><ul><li>Item um</li><li>Item dois</li></ul>';
    expect(stripHtml(html)).toBe('Objetivo\n- Item um\n- Item dois');
  });

  it('decodes common HTML entities', () => {
    expect(stripHtml('Cafe com leite &amp; pao')).toBe('Cafe com leite & pao');
    expect(stripHtml('R$ 1.000&nbsp;fixo')).toBe('R$ 1.000 fixo');
    expect(stripHtml('Vaga d&#39;A empresa')).toBe("Vaga d'A empresa");
  });

  it('returns an empty string for null/undefined input', () => {
    expect(stripHtml(null)).toBe('');
    expect(stripHtml(undefined)).toBe('');
  });
});

describe('formatSalary', () => {
  it('returns "A combinar" when negotiable', () => {
    const salary: SolidesSalary = {
      type: 'simple',
      showRangeToApplicant: true,
      initialRange: 1000,
      finalRange: 2000,
      negotiable: true,
    };
    expect(formatSalary(salary)).toBe('A combinar');
  });

  it('returns "A combinar" when the range is not disclosed to applicants', () => {
    const salary: SolidesSalary = {
      type: 'simple',
      showRangeToApplicant: false,
      initialRange: null,
      finalRange: null,
      negotiable: false,
    };
    expect(formatSalary(salary)).toBe('A combinar');
  });

  it('returns "A combinar" when both bounds are zero', () => {
    const salary: SolidesSalary = {
      type: 'simple',
      showRangeToApplicant: true,
      initialRange: 0,
      finalRange: 0,
      negotiable: false,
    };
    expect(formatSalary(salary)).toBe('A combinar');
  });

  it('formats a single value when initial and final ranges match', () => {
    const salary: SolidesSalary = {
      type: 'simple',
      showRangeToApplicant: true,
      initialRange: 875.85,
      finalRange: 875.85,
      negotiable: false,
    };
    expect(formatSalary(salary)).toBe('R$ 875,85');
  });

  it('formats only the final value when the initial range is zero', () => {
    const salary: SolidesSalary = {
      type: 'simple',
      showRangeToApplicant: true,
      initialRange: 0,
      finalRange: 1621,
      negotiable: false,
    };
    expect(formatSalary(salary)).toBe('R$ 1.621,00');
  });

  it('formats a range when initial and final differ', () => {
    const salary: SolidesSalary = {
      type: 'simple',
      showRangeToApplicant: true,
      initialRange: 1500,
      finalRange: 2000,
      negotiable: false,
    };
    expect(formatSalary(salary)).toBe('R$ 1.500,00 - R$ 2.000,00');
  });
});

describe('normalizeCityCasing / buildLocation', () => {
  it('fixes a SHOUTING city name', () => {
    expect(normalizeCityCasing('NATAL')).toBe('Natal');
    expect(normalizeCityCasing('PAU DOS FERROS')).toBe('Pau Dos Ferros');
  });

  it('leaves an already well-cased city name untouched', () => {
    expect(normalizeCityCasing('Pau dos Ferros')).toBe('Pau dos Ferros');
    expect(normalizeCityCasing('Mossoró')).toBe('Mossoró');
  });

  it('builds "City, UF" from the vacancy location, fixing SHOUTING names', () => {
    const shouting = buildVacancy({
      city: { name: 'NATAL', state_id: 0 },
      state: { name: 'Rio Grande do Norte', code: 'RN' },
    });
    expect(buildLocation(shouting)).toBe('Natal, RN');

    const alreadyCased = buildVacancy({
      city: { name: 'Pau dos Ferros', state_id: 0 },
      state: { name: 'Rio Grande do Norte', code: 'RN' },
    });
    expect(buildLocation(alreadyCased)).toBe('Pau dos Ferros, RN');
  });
});

describe('computeJobOpeningHash', () => {
  it('produces a deterministic 64-char hex digest', () => {
    const hash = computeJobOpeningHash('solides', '1');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(computeJobOpeningHash('solides', '1')).toBe(hash);
  });

  it('produces different hashes for different external ids', () => {
    const hashA = computeJobOpeningHash('solides', '1');
    const hashB = computeJobOpeningHash('solides', '2');
    expect(hashA).not.toBe(hashB);
  });
});

describe('buildSolidesCareersUrl', () => {
  it('builds the company subdomain when a slug is present', () => {
    const vacancy = buildVacancy({ slug: 'elevesolucoes' });
    expect(buildSolidesCareersUrl(vacancy)).toBe(
      'https://elevesolucoes.vagas.solides.com.br',
    );
  });

  it('falls back to the generic domain when there is no slug', () => {
    const vacancy = buildVacancy({ slug: null });
    expect(buildSolidesCareersUrl(vacancy)).toBe('https://vagas.solides.com.br');
  });
});

describe('buildSolidesCareersDomain', () => {
  it('strips the protocol for display in captions/art', () => {
    const vacancy = buildVacancy({ slug: 'elevesolucoes' });
    expect(buildSolidesCareersDomain(vacancy)).toBe(
      'elevesolucoes.vagas.solides.com.br',
    );
  });

  it('strips the protocol from the fallback domain too', () => {
    const vacancy = buildVacancy({ slug: null });
    expect(buildSolidesCareersDomain(vacancy)).toBe('vagas.solides.com.br');
  });
});

describe('hasDisclosedCompany', () => {
  it('accepts a real company name', () => {
    expect(hasDisclosedCompany(buildVacancy({ companyName: 'Multigiro' }))).toBe(
      true,
    );
  });

  it.each([
    'Empresa confidencial',
    'CONFIDENCIAL',
    'confidencial',
    '',
    '   ',
  ])('rejects a confidential or blank company name: %s', (companyName) => {
    expect(hasDisclosedCompany(buildVacancy({ companyName }))).toBe(false);
  });

  it('rejects a missing companyName', () => {
    expect(
      hasDisclosedCompany(
        buildVacancy({ companyName: undefined as unknown as string }),
      ),
    ).toBe(false);
  });
});

describe('mapSolidesVacancyToJobOpening', () => {
  it('maps a vacancy into a CreateJobOpeningDto shape', () => {
    const vacancy = buildVacancy();

    const result = mapSolidesVacancyToJobOpening(vacancy);

    expect(result.title).toBe('Estagiário de Telefonia');
    expect(result.source).toBe('solides');
    expect(result.externalId).toBe('904705');
    expect(result.postUrl).toBe('https://elevesolucoes.vagas.solides.com.br');
    expect(result.hash).toBe(computeJobOpeningHash('solides', '904705'));
    expect(result.wage).toBe('A combinar');
    expect(result.workingHours).toBe('presencial');
    expect(result.contractType).toBe('Estágio');
    expect(result.location).toBe('Natal, RN');
    expect(result.requirements).toBe('Boa comunicação');
    expect(result.description).toContain('Objetivo');
    expect(result.publishedAt).toEqual(new Date('2026-08-17'));
  });

  it('coerces a string vacancy id and omits empty optional fields', () => {
    const vacancy = buildVacancy({
      id: 'Quo801Kj52',
      hardSkills: [],
      description: '',
      createdAt: undefined,
    });

    const result = mapSolidesVacancyToJobOpening(vacancy);

    expect(result.externalId).toBe('Quo801Kj52');
    expect(result.requirements).toBeUndefined();
    expect(result.description).toBeUndefined();
    expect(result.publishedAt).toBeUndefined();
  });
});

describe('mapSolidesVacancyToJobPosting', () => {
  it('maps a vacancy into a JobPostingDto shape, truncated to its constraints', () => {
    const vacancy = buildVacancy({
      title: 'X'.repeat(120),
      hardSkills: Array.from({ length: 8 }, (_, i) => ({
        name: `Requisito ${i} `.repeat(20),
      })),
      availablePositions: 5000,
    });

    const result = mapSolidesVacancyToJobPosting(vacancy);

    expect(result.jobTitle.length).toBeLessThanOrEqual(80);
    expect(result.requirements).toHaveLength(5);
    result.requirements?.forEach((requirement) => {
      expect(requirement.length).toBeLessThanOrEqual(100);
    });
    expect(result.vacancyCount).toBe(999);
    expect(result.applicationInstructions).toBe(
      'elevesolucoes.vagas.solides.com.br',
    );
    expect(result.storyFooterText).toBe('Siga @trabalharn e não perca as vagas');
  });

  it('clamps vacancyCount to at least 1 when positions are missing', () => {
    const vacancy = buildVacancy({
      availablePositions: undefined,
      openPositions: undefined,
    });

    const result = mapSolidesVacancyToJobPosting(vacancy);

    expect(result.vacancyCount).toBe(1);
  });
});

describe('filterAndMapRnVacancies', () => {
  function buildResponse(
    vacancies: SolidesVacancy[],
  ): SolidesVacanciesResponse {
    return {
      success: true,
      errors: [],
      data: {
        totalPages: 1,
        currentPage: 1,
        count: vacancies.length,
        data: vacancies,
      },
    };
  }

  it('keeps only vacancies in an RN state with a known RN municipality', () => {
    const validVacancy = buildVacancy();
    const wrongState = buildVacancy({
      id: 2,
      state: { name: 'Ceará', code: 'CE' },
      city: { name: 'Fortaleza', state_id: 0 },
    });
    const unknownCity = buildVacancy({
      id: 3,
      city: { name: 'Cidade Inexistente', state_id: 0 },
    });

    const result = filterAndMapRnVacancies(
      buildResponse([validVacancy, wrongState, unknownCity]),
      RN_MUNICIPIOS,
    );

    expect(result).toHaveLength(1);
    expect(result[0].jobOpening.externalId).toBe('904705');
    expect(result[0].jobPosting.jobTitle).toBe('Estagiário de Telefonia');
  });

  it('drops vacancies with a confidential or missing company name', () => {
    const disclosed = buildVacancy();
    const confidential = buildVacancy({
      id: 4,
      companyName: 'Empresa confidencial',
    });
    const blank = buildVacancy({ id: 5, companyName: '' });

    const result = filterAndMapRnVacancies(
      buildResponse([disclosed, confidential, blank]),
      RN_MUNICIPIOS,
    );

    expect(result).toHaveLength(1);
    expect(result[0].jobOpening.externalId).toBe('904705');
  });

  it('returns an empty array when there are no vacancies', () => {
    const result = filterAndMapRnVacancies(buildResponse([]), RN_MUNICIPIOS);
    expect(result).toEqual([]);
  });
});
