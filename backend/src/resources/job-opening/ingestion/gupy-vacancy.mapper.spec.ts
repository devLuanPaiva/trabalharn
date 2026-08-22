import {
  buildGupyCareersDomain,
  buildGupyLocation,
  extractUrlHost,
  filterAndMapRnGupyVacancies,
  hasDisclosedGupyCompany,
  isGupyVacancyInRn,
  isGupyVacancyRecent,
  mapGupyContractType,
  mapGupyVacancyToJobOpening,
  mapGupyVacancyToJobPosting,
} from './gupy-vacancy.mapper';
import {
  computeJobOpeningHash,
  IbgeMunicipio,
  translateWorkplaceType,
} from './shared.util';
import { GupyVacanciesResponse, GupyVacancy } from './gupy.types';

const RN_MUNICIPIOS: IbgeMunicipio[] = [
  { id: 2408102, nome: 'Natal' },
  { id: 2408003, nome: 'Mossoró' },
  { id: 2408409, nome: 'Parnamirim' },
  { id: 2413359, nome: 'Tirol' },
];

const REFERENCE_DATE = new Date('2026-08-22T12:00:00.000Z');

function buildGupyVacancy(overrides: Partial<GupyVacancy> = {}): GupyVacancy {
  return {
    id: 11064641,
    companyId: 638,
    name: ' BANCO DE TALENTOS | LE BISCUIT | GERENTE DE LOJA - RIO GRANDE DO NORTE',
    description: '<p>Requisitos</p><ul><li>Ensino médio completo</li></ul>',
    careerPageId: 185804,
    careerPageName: 'Le biscuit',
    careerPageUrl: 'https://lebiscuit.gupy.io/eyJzb3VyY2UiOiJndXB5X3BvcnRhbCJ9',
    type: 'vacancy_type_talent_pool',
    publishedDate: '2026-08-15T15:06:50.199Z',
    city: 'Natal',
    state: 'Rio Grande do Norte',
    country: 'Brasil',
    jobUrl:
      'https://lebiscuit.gupy.io/job/eyJqb2JJZCI6MTEwNjQ2NDEsInNvdXJjZSI6Imd1cHlfcG9ydGFsIn0=?jobBoardSource=gupy_portal',
    workplaceType: 'on-site',
    ...overrides,
  };
}

function buildGupyResponse(vacancies: GupyVacancy[]): GupyVacanciesResponse {
  return {
    data: vacancies,
    pagination: { total: vacancies.length, limit: 12, offset: 0 },
  };
}

describe('mapGupyContractType', () => {
  it('maps each known Gupy vacancy type to a TrabalhaRN label', () => {
    expect(mapGupyContractType('vacancy_type_effective')).toBe('CLT');
    expect(mapGupyContractType('vacancy_legal_entity')).toBe('PJ');
    expect(mapGupyContractType('vacancy_type_talent_pool')).toBe(
      'Banco de Talentos',
    );
  });

  it('returns undefined for an unknown or missing type', () => {
    expect(mapGupyContractType('something_else')).toBeUndefined();
    expect(mapGupyContractType(undefined)).toBeUndefined();
  });
});

describe('buildGupyLocation', () => {
  it('appends the RN state code to the city', () => {
    expect(buildGupyLocation(buildGupyVacancy({ city: 'Natal' }))).toBe(
      'Natal, RN',
    );
  });

  it('fixes a SHOUTING city name', () => {
    expect(buildGupyLocation(buildGupyVacancy({ city: 'NATAL' }))).toBe(
      'Natal, RN',
    );
  });
});

describe('extractUrlHost', () => {
  it('extracts the bare host from a URL', () => {
    expect(
      extractUrlHost(
        'https://lebiscuit.gupy.io/eyJzb3VyY2UiOiJndXB5X3BvcnRhbCJ9',
      ),
    ).toBe('lebiscuit.gupy.io');
  });

  it('drops the path, query string and port', () => {
    expect(extractUrlHost('https://freitas.gupy.io:8443/job/abc?x=1#y')).toBe(
      'freitas.gupy.io:8443',
    );
  });

  it('returns an empty string for a malformed or missing URL', () => {
    expect(extractUrlHost('not-a-url')).toBe('');
    expect(extractUrlHost(undefined)).toBe('');
  });
});

describe('buildGupyCareersDomain', () => {
  it('extracts the bare host from the obfuscated careers URL', () => {
    const vacancy = buildGupyVacancy({
      careerPageUrl:
        'https://lebiscuit.gupy.io/eyJzb3VyY2UiOiJndXB5X3BvcnRhbCJ9',
    });
    expect(buildGupyCareersDomain(vacancy)).toBe('lebiscuit.gupy.io');
  });

  it('returns an empty string for a malformed URL', () => {
    const vacancy = buildGupyVacancy({ careerPageUrl: 'not-a-url' });
    expect(buildGupyCareersDomain(vacancy)).toBe('');
  });
});

describe('isGupyVacancyRecent', () => {
  it('accepts a vacancy published today', () => {
    expect(
      isGupyVacancyRecent('2026-08-22T00:00:00.000Z', REFERENCE_DATE),
    ).toBe(true);
  });

  it('accepts a vacancy published exactly 30 days ago', () => {
    expect(
      isGupyVacancyRecent('2026-07-23T12:00:00.000Z', REFERENCE_DATE),
    ).toBe(true);
  });

  it('rejects a vacancy published more than 30 days ago', () => {
    expect(
      isGupyVacancyRecent('2026-07-22T00:00:00.000Z', REFERENCE_DATE),
    ).toBe(false);
  });

  it('rejects a vacancy published in the future', () => {
    expect(
      isGupyVacancyRecent('2026-08-23T00:00:00.000Z', REFERENCE_DATE),
    ).toBe(false);
  });

  it('rejects a missing or invalid publishedDate', () => {
    expect(isGupyVacancyRecent(undefined, REFERENCE_DATE)).toBe(false);
    expect(isGupyVacancyRecent('not-a-date', REFERENCE_DATE)).toBe(false);
  });
});

describe('hasDisclosedGupyCompany', () => {
  it('accepts a real company name', () => {
    expect(
      hasDisclosedGupyCompany(
        buildGupyVacancy({ careerPageName: 'Le biscuit' }),
      ),
    ).toBe(true);
  });

  it.each(['Empresa confidencial', 'CONFIDENCIAL', '', '   '])(
    'rejects a confidential or blank company name: %s',
    (careerPageName) => {
      expect(
        hasDisclosedGupyCompany(buildGupyVacancy({ careerPageName })),
      ).toBe(false);
    },
  );
});

describe('isGupyVacancyInRn', () => {
  it('accepts a vacancy in an RN city', () => {
    const vacancy = buildGupyVacancy({
      state: 'Rio Grande do Norte',
      city: 'Mossoró',
    });
    expect(isGupyVacancyInRn(vacancy, RN_MUNICIPIOS)).toBe(true);
  });

  it('rejects a vacancy whose state name is not Rio Grande do Norte', () => {
    const vacancy = buildGupyVacancy({ state: 'Ceará', city: 'Fortaleza' });
    expect(isGupyVacancyInRn(vacancy, RN_MUNICIPIOS)).toBe(false);
  });

  it('rejects a vacancy whose city is not a known RN municipality', () => {
    const vacancy = buildGupyVacancy({
      state: 'Rio Grande do Norte',
      city: 'Cidade Inexistente',
    });
    expect(isGupyVacancyInRn(vacancy, RN_MUNICIPIOS)).toBe(false);
  });
});

describe('mapGupyVacancyToJobOpening', () => {
  it('maps a vacancy into a CreateJobOpeningDto shape', () => {
    const vacancy = buildGupyVacancy();

    const result = mapGupyVacancyToJobOpening(vacancy);

    expect(result.title).toBe(
      'BANCO DE TALENTOS | LE BISCUIT | GERENTE DE LOJA - RIO GRANDE DO NORTE',
    );
    expect(result.description).toBe('Requisitos\n- Ensino médio completo');
    expect(result.wage).toBe('A combinar');
    expect(result.workingHours).toBe('Presencial');
    expect(result.contractType).toBe('Banco de Talentos');
    expect(result.location).toBe('Natal, RN');
    expect(result.companyName).toBe('Le biscuit');
    expect(result.source).toBe('gupy');
    expect(result.externalId).toBe('11064641');
    expect(result.postUrl).toBe(vacancy.jobUrl);
    expect(result.hash).toBe(computeJobOpeningHash('gupy', '11064641'));
    expect(result.publishedAt).toEqual(new Date('2026-08-15T15:06:50.199Z'));
    expect(result.requirements).toBeUndefined();
  });
});

describe('mapGupyVacancyToJobPosting', () => {
  it('maps a vacancy into a JobPostingDto shape', () => {
    const vacancy = buildGupyVacancy();

    const result = mapGupyVacancyToJobPosting(vacancy);

    expect(result.jobTitle).toBe(
      'BANCO DE TALENTOS | LE BISCUIT | GERENTE DE LOJA - RIO GRANDE DO NORTE',
    );
    expect(result.companyName).toBe('Le biscuit');
    expect(result.city).toBe('Natal, RN');
    expect(result.contractType).toBe('Banco de Talentos');
    expect(result.salary).toBe('A combinar');
    expect(result.workplaceType).toBe('Presencial');
    expect(result.vacancyCount).toBe(1);
    expect(result.applicationInstructions).toBe('lebiscuit.gupy.io');
    expect(result.storyFooterText).toBe(
      'Siga @trabalharn e não perca as vagas',
    );
  });

  it.each([
    ['on-site', 'Presencial'],
    ['remote', 'Remoto'],
    ['hybrid', 'Híbrido'],
  ])(
    'translates the Gupy workplaceType "%s" into "%s"',
    (workplaceType, expectedLabel) => {
      const vacancy = buildGupyVacancy({ workplaceType });

      expect(mapGupyVacancyToJobOpening(vacancy).workingHours).toBe(
        expectedLabel,
      );
      expect(mapGupyVacancyToJobPosting(vacancy).workplaceType).toBe(
        expectedLabel,
      );
    },
  );
});

describe('translateWorkplaceType', () => {
  it('translates a known raw value regardless of casing', () => {
    expect(translateWorkplaceType('on-site')).toBe('Presencial');
    expect(translateWorkplaceType('REMOTE')).toBe('Remoto');
    expect(translateWorkplaceType('Hybrid')).toBe('Híbrido');
  });

  it('passes an unrecognized value through unchanged', () => {
    expect(translateWorkplaceType('flexible')).toBe('flexible');
  });

  it('returns undefined for a missing value', () => {
    expect(translateWorkplaceType(undefined)).toBeUndefined();
  });
});

describe('filterAndMapRnGupyVacancies', () => {
  it('keeps only recent, disclosed vacancies located in an RN municipality', () => {
    const validVacancy = buildGupyVacancy({ id: 1 });
    const wrongState = buildGupyVacancy({
      id: 2,
      state: 'Ceará',
      city: 'Fortaleza',
    });
    const unknownCity = buildGupyVacancy({
      id: 3,
      city: 'Cidade Inexistente',
    });
    const stale = buildGupyVacancy({
      id: 4,
      publishedDate: '2026-03-05T16:53:05.081Z',
    });
    const confidential = buildGupyVacancy({
      id: 5,
      careerPageName: 'Empresa confidencial',
    });

    const result = filterAndMapRnGupyVacancies(
      buildGupyResponse([
        validVacancy,
        wrongState,
        unknownCity,
        stale,
        confidential,
      ]),
      RN_MUNICIPIOS,
      REFERENCE_DATE,
    );

    expect(result).toHaveLength(1);
    expect(result[0].jobOpening.externalId).toBe('1');
  });

  it('returns an empty array when there are no vacancies', () => {
    const result = filterAndMapRnGupyVacancies(
      buildGupyResponse([]),
      RN_MUNICIPIOS,
      REFERENCE_DATE,
    );
    expect(result).toEqual([]);
  });
});
