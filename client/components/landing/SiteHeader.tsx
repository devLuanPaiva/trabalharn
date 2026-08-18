'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BrandWordmark } from '@/components/brand/BrandWordmark';

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '#qualidades', label: 'Por que o TrabalhaRN' },
  { href: '#vagas', label: 'Vagas' },
  { href: '#empresas', label: 'Para empresas' },
  { href: '#contato', label: 'Contato' },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-divider bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <Image src="/brand/simbolo-sem-fundo.png" alt="" width={36} height={36} priority />
          <BrandWordmark tone="light" />
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-ink md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-brand-green">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#vagas"
            className="hidden rounded-full bg-brand-green px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-green/90 md:inline-flex"
          >
            Ver vagas
          </a>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="site-mobile-nav"
            aria-label="Abrir menu"
            className="inline-flex items-center justify-center rounded-lg border border-brand-divider p-2 text-lg md:hidden"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="site-mobile-nav" className="border-t border-brand-divider bg-white px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium text-brand-ink">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
