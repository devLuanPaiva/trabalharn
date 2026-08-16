import { JobPostingFormState } from './types';

export const MAX_VISIBLE_REQUIREMENTS = 5;

export const CONTRACT_TYPE_OPTIONS = [
  'CLT',
  'Estágio',
  'PJ',
  'Temporário',
  'Jovem Aprendiz',
  'Freelancer',
  'Trainee',
];

export const INITIAL_JOB_POSTING_FORM_STATE: JobPostingFormState = {
  jobTitle: 'Auxiliar Administrativo',
  companyName: 'Supermercado Nordestão',
  city: 'Natal / RN',
  contractType: 'CLT',
  salary: 'R$ 1.800 + benefícios',
  workSchedule: 'Seg a sex, 8h às 17h',
  vacancyCount: '3',
  requirementsText:
    'Ensino médio completo\nExperiência mínima de 6 meses na área\nPacote Office intermediário',
  applicationInstructions: 'Envie o currículo para vagas@empresa.com.br',
  storyFooterText: 'Siga @trabalharn e veja vagas todos os dias',
};
