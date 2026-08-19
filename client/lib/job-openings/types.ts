export interface JobOpening {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  wage: string | null;
  workingHours: string | null;
  contractType: string | null;
  location: string | null;
  companyName: string | null;
  source: string;
  postUrl: string;
  publishedAt: string | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
