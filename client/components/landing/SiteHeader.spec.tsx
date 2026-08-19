import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('keeps the mobile navigation collapsed until the menu button is opened', () => {
    render(<SiteHeader />);

    expect(document.getElementById('site-mobile-nav')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the mobile navigation when the menu button is clicked', () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));

    expect(document.getElementById('site-mobile-nav')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the mobile navigation after a link is clicked', () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const mobileNav = document.getElementById('site-mobile-nav') as HTMLElement;
    fireEvent.click(within(mobileNav).getByRole('link', { name: 'Vagas' }));

    expect(document.getElementById('site-mobile-nav')).not.toBeInTheDocument();
  });
});
