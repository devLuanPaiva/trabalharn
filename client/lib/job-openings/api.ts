import { JobOpening, PaginatedResult } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';
const JOB_OPENINGS_REVALIDATE_SECONDS = 300;
const DEFAULT_FEATURED_LIMIT = 6;

export interface FetchFeaturedJobOpeningsOptions {
  limit?: number;
}

export async function fetchFeaturedJobOpenings(
  options: FetchFeaturedJobOpeningsOptions = {},
): Promise<JobOpening[]> {
  const { limit = DEFAULT_FEATURED_LIMIT } = options;

  const url = new URL('/job-openings', API_BASE_URL);
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url, {
    next: { revalidate: JOB_OPENINGS_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to load job openings (status ${response.status})`);
  }

  const result = (await response.json()) as PaginatedResult<JobOpening>;
  return result.items;
}
