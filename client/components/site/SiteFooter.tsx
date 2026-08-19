import Link from 'next/link';
import { BrandWordmark } from '@/components/brand/BrandWordmark';
import { getContactChannels } from '@/lib/site/contact';
import { LEGAL_LINKS } from '@/lib/site/legal-links';

export function SiteFooter() {
  const { instagram } = getContactChannels();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-ink text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <BrandWordmark tone="dark" />
          <p className="max-w-md text-white/80">
            Divulgamos vagas publicadas em outros portais, sempre com a fonte citada — não somos a empresa
            contratante nem coletamos dados de quem visita a página.
          </p>
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white hover:text-brand-yellow"
          >
            {instagram.label}
          </a>
        </div>
        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/15 pt-6 text-white/80">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/15 px-6 py-4 text-center text-xs text-white/70">
        © {currentYear} TrabalhaRN. Todos os direitos reservados.
      </div>
    </footer>
  );
}
