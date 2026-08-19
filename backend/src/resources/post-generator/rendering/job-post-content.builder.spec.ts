import { BRAND_COLORS } from './brand-colors.constant';
import {
  buildJobPostBadges,
  buildJobPostDetailRows,
  buildVisibleRequirements,
} from './job-post-content.builder';
import { JobPostingData } from '../types/job-posting-data.type';

function buildJobPosting(
  overrides: Partial<JobPostingData> = {},
): JobPostingData {
  return { jobTitle: 'Vendedor', ...overrides };
}

describe('buildJobPostBadges', () => {
  it('shows "VAGA ABERTA" when there is a single vacancy', () => {
    const badges = buildJobPostBadges(buildJobPosting({ vacancyCount: 1 }));

    expect(badges[0]).toEqual({
      label: 'VAGA ABERTA',
      backgroundColor: BRAND_COLORS.yellow,
      foregroundColor: BRAND_COLORS.ink,
    });
  });

  it('shows "VAGA ABERTA" when vacancyCount is not informed', () => {
    const badges = buildJobPostBadges(buildJobPosting());

    expect(badges[0].label).toBe('VAGA ABERTA');
  });

  it('shows the vacancy count when there is more than one vacancy', () => {
    const badges = buildJobPostBadges(buildJobPosting({ vacancyCount: 4 }));

    expect(badges[0].label).toBe('4 VAGAS');
  });

  it('adds a contract type badge in upper case when informed', () => {
    const badges = buildJobPostBadges(buildJobPosting({ contractType: 'clt' }));

    expect(badges).toHaveLength(2);
    expect(badges[1]).toEqual({
      label: 'CLT',
      backgroundColor: BRAND_COLORS.blue,
      foregroundColor: BRAND_COLORS.white,
    });
  });

  it('omits the contract type badge when not informed', () => {
    const badges = buildJobPostBadges(buildJobPosting());

    expect(badges).toHaveLength(1);
  });
});

describe('buildJobPostDetailRows', () => {
  it('includes only the rows for fields that were informed, in a fixed order', () => {
    const rows = buildJobPostDetailRows(
      buildJobPosting({ workSchedule: 'Seg a sex', city: 'Mossoró / RN' }),
    );

    expect(rows).toEqual([
      { icon: 'pin', label: 'LOCAL', value: 'Mossoró / RN' },
      { icon: 'clock', label: 'HORÁRIO', value: 'Seg a sex' },
    ]);
  });

  it('returns an empty list when no detail fields were informed', () => {
    expect(buildJobPostDetailRows(buildJobPosting())).toEqual([]);
  });
});

describe('buildVisibleRequirements', () => {
  it('discards empty entries', () => {
    const requirements = buildVisibleRequirements(
      buildJobPosting({ requirements: ['Item 1', '', '  ', 'Item 2'] }),
    );

    expect(requirements).toEqual(['Item 1', 'Item 2']);
  });

  it('caps the list at 5 items', () => {
    const requirements = buildVisibleRequirements(
      buildJobPosting({ requirements: ['1', '2', '3', '4', '5', '6', '7'] }),
    );

    expect(requirements).toEqual(['1', '2', '3', '4', '5']);
  });

  it('returns an empty list when requirements were not informed', () => {
    expect(buildVisibleRequirements(buildJobPosting())).toEqual([]);
  });
});
