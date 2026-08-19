import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandWordmark } from './BrandWordmark';

describe('BrandWordmark', () => {
  it('renders the wordmark text', () => {
    render(<BrandWordmark tone="light" />);

    expect(screen.getByText('Trabalha')).toBeInTheDocument();
    expect(screen.getByText('RN')).toBeInTheDocument();
  });

  it('never renders the "RN" accent in yellow on the light tone, since yellow text fails contrast on white', () => {
    render(<BrandWordmark tone="light" />);

    expect(screen.getByText('RN')).not.toHaveClass('text-brand-yellow');
  });

  it('uses the yellow accent on the dark tone, matching the established brand header pattern', () => {
    render(<BrandWordmark tone="dark" />);

    expect(screen.getByText('RN')).toHaveClass('text-brand-yellow');
  });
});
