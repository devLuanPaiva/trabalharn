export type GupyVacancyType =
  | 'vacancy_type_effective'
  | 'vacancy_legal_entity'
  | 'vacancy_type_talent_pool';

export type GupyWorkplaceType = 'on-site' | 'remote' | 'hybrid';

export interface GupyVacancy {
  id: number | string;
  companyId: number;
  name: string;
  description: string;
  careerPageId: number;
  careerPageName: string;
  careerPageLogo?: string | null;
  careerPageUrl: string;
  type: GupyVacancyType | string;
  publishedDate: string;
  applicationDeadline?: string;
  isRemoteWork?: boolean;
  city: string;
  state: string;
  country?: string;
  jobUrl: string;
  workplaceType?: GupyWorkplaceType | string;
  disabilities?: boolean;
  skills?: unknown[];
}

export interface GupyPagination {
  total: number;
  limit: number;
  offset: number;
}

export interface GupyVacanciesResponse {
  data: GupyVacancy[];
  pagination: GupyPagination;
}
