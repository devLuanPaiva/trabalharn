import { JobPostImageRenderer } from './job-post-image.renderer';
import { PostGeneratorFontRepository } from '../fonts/post-generator-font.repository';
import { PostFormat } from '../types/post-format.enum';
import { JobPostingData } from '../types/job-posting-data.type';

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function readPngDimensions(buffer: Buffer): { width: number; height: number } {
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

describe('JobPostImageRenderer', () => {
  const renderer = new JobPostImageRenderer(new PostGeneratorFontRepository());

  const fullJobPosting: JobPostingData = {
    jobTitle: 'Auxiliar Administrativo',
    companyName: 'Supermercado Nordestão',
    city: 'Natal / RN',
    contractType: 'CLT',
    salary: 'R$ 1.800 + benefícios',
    workplaceType: 'Presencial',
    workSchedule: 'Seg a sex, 8h às 17h',
    vacancyCount: 3,
    requirements: [
      'Ensino médio completo',
      'Experiência mínima de 6 meses na área',
      'Pacote Office intermediário',
    ],
    applicationInstructions: 'Envie o currículo para vagas@empresa.com.br',
    storyFooterText: 'Siga @trabalharn e veja vagas todos os dias',
  };

  it('renders a 1080x1350 PNG for the feed format', () => {
    const buffer = renderer.renderToPngBuffer(fullJobPosting, PostFormat.FEED);

    expect(buffer.subarray(0, 8)).toEqual(PNG_SIGNATURE);
    expect(readPngDimensions(buffer)).toEqual({ width: 1080, height: 1350 });
  });

  it('renders a 1080x1920 PNG for the story format', () => {
    const buffer = renderer.renderToPngBuffer(fullJobPosting, PostFormat.STORY);

    expect(buffer.subarray(0, 8)).toEqual(PNG_SIGNATURE);
    expect(readPngDimensions(buffer)).toEqual({ width: 1080, height: 1920 });
  });

  it('renders successfully with only the required jobTitle field', () => {
    const buffer = renderer.renderToPngBuffer(
      { jobTitle: 'Vendedor' },
      PostFormat.FEED,
    );

    expect(buffer.subarray(0, 8)).toEqual(PNG_SIGNATURE);
  });

  it('renders successfully when content overflows and must shrink to fit', () => {
    const overflowingJobPosting: JobPostingData = {
      ...fullJobPosting,
      jobTitle:
        'Cargo com um título extremamente longo que certamente não cabe em uma única linha do cartão',
      requirements: [
        'Requisito número um bem detalhado e extenso para forçar quebras de linha',
        'Requisito número dois também bastante longo para ocupar bastante espaço vertical',
        'Requisito número três',
        'Requisito número quatro',
        'Requisito número cinco',
      ],
    };

    const buffer = renderer.renderToPngBuffer(
      overflowingJobPosting,
      PostFormat.FEED,
    );

    expect(buffer.subarray(0, 8)).toEqual(PNG_SIGNATURE);
  });
});
