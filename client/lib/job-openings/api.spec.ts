import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchFeaturedJobOpenings } from './api';

describe('fetchFeaturedJobOpenings', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the job openings endpoint with the given limit and returns the items', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [{ id: '1', title: 'Vendedor' }],
        total: 1,
        page: 1,
        limit: 3,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const jobOpenings = await fetchFeaturedJobOpenings({ limit: 3 });

    expect(jobOpenings).toEqual([{ id: '1', title: 'Vendedor' }]);
    const requestedUrl = fetchMock.mock.calls[0][0] as URL;
    expect(requestedUrl.pathname).toBe('/job-openings');
    expect(requestedUrl.searchParams.get('limit')).toBe('3');
  });

  it('defaults to a limit of 6 when none is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], total: 0, page: 1, limit: 6 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchFeaturedJobOpenings();

    const requestedUrl = fetchMock.mock.calls[0][0] as URL;
    expect(requestedUrl.searchParams.get('limit')).toBe('6');
  });

  it('throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );

    await expect(fetchFeaturedJobOpenings()).rejects.toThrow('status 500');
  });
});
