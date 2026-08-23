export interface SolidesLocationRef {
  id?: number;
  name: string;
  state_id?: number;
  code?: string;
}

export interface SolidesTaggedOption {
  id?: number | string;
  name: string;
  level?: number | null;
}

export interface SolidesSalary {
  type: string;
  showRangeToApplicant: boolean;
  initialRange: number | null;
  finalRange: number | null;
  negotiable: boolean;
}

export interface SolidesVacancy {
  id: number | string;
  title: string;
  description: string;
  currentState: string;
  companyName: string;
  state: SolidesLocationRef;
  city: SolidesLocationRef;
  redirectLink: string;
  slug?: string | null;
  jobType?: string;
  homeOffice?: boolean;
  openPositions?: number;
  availablePositions?: number;
  salary: SolidesSalary;
  recruitmentContractType?: SolidesTaggedOption[];
  hardSkills?: SolidesTaggedOption[];
  createdAt?: string;
}

export interface SolidesVacanciesResponse {
  success: boolean;
  errors: unknown[];
  data: {
    totalPages: number;
    currentPage: number;
    count: number;
    data: SolidesVacancy[];
  };
}

export interface IbgeMunicipio {
  id: number;
  nome: string;
}
