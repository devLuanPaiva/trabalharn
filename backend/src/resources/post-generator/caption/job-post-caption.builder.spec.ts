import { buildJobPostCaption } from './job-post-caption.builder';
import { JobPostingData } from '../types/job-posting-data.type';

function buildJobPosting(
  overrides: Partial<JobPostingData> = {},
): JobPostingData {
  return { jobTitle: 'Auxiliar Administrativo', ...overrides };
}

describe('buildJobPostCaption', () => {
  it('builds the full caption following the brand template', () => {
    const caption = buildJobPostCaption(
      buildJobPosting({
        companyName: 'Supermercado Nordestão',
        city: 'Natal / RN',
        contractType: 'CLT',
        vacancyCount: 3,
        salary: 'R$ 1.800 + benefícios',
        workSchedule: 'Seg a sex, 8h às 17h',
        requirements: ['Ensino médio completo', 'Pacote Office intermediário'],
        applicationInstructions: 'Envie o currículo para vagas@empresa.com.br',
      }),
    );

    expect(caption).toBe(
      [
        '📢 VAGA DE EMPREGO — AUXILIAR ADMINISTRATIVO',
        '🏢 Supermercado Nordestão',
        '📍 Natal / RN',
        '💼 CLT — 3 vagas',
        '💰 R$ 1.800 + benefícios',
        '⏰ Seg a sex, 8h às 17h',
        '',
        '✅ Requisitos:',
        '• Ensino médio completo',
        '• Pacote Office intermediário',
        '',
        '📩 Envie o currículo para vagas@empresa.com.br',
        '',
        '#TrabalhaRN #VagasRN #EmpregoRN #RioGrandeDoNorte #Natal',
      ].join('\n'),
    );
  });

  it('omits the vacancy suffix when there is only one vacancy', () => {
    const caption = buildJobPostCaption(
      buildJobPosting({ contractType: 'CLT', vacancyCount: 1 }),
    );

    expect(caption).toContain('💼 CLT\n');
  });

  it('omits optional lines and blocks that were not informed', () => {
    const caption = buildJobPostCaption(buildJobPosting());

    expect(caption).toBe(
      [
        '📢 VAGA DE EMPREGO — AUXILIAR ADMINISTRATIVO',
        '',
        '#TrabalhaRN #VagasRN #EmpregoRN #RioGrandeDoNorte',
      ].join('\n'),
    );
  });

  it('derives the city hashtag from the part before the slash, stripping spaces', () => {
    const caption = buildJobPostCaption(
      buildJobPosting({ city: 'Currais Novos / RN' }),
    );

    expect(caption.endsWith('#RioGrandeDoNorte #CurraisNovos')).toBe(true);
  });

  it('caps requirements at 5 items, matching the generated image', () => {
    const caption = buildJobPostCaption(
      buildJobPosting({ requirements: ['1', '2', '3', '4', '5', '6'] }),
    );

    expect(caption).not.toContain('• 6');
    expect(caption).toContain('• 5');
  });
});
