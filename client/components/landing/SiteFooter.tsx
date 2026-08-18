import { BrandWordmark } from '@/components/brand/BrandWordmark';
import { getContactChannels } from '@/lib/site/contact';

export function SiteFooter() {
  const { instagram } = getContactChannels();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <BrandWordmark tone="dark" />
        <p className="text-white/80">Vagas de emprego no Rio Grande do Norte.</p>
        <a
          href={instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white hover:text-brand-yellow"
        >
          {instagram.label}
        </a>
      </div>
      <div className="border-t border-white/15 px-6 py-4 text-center text-xs text-white/70">
        © {currentYear} TrabalhaRN. Todos os direitos reservados.
      </div>
    </footer>
  );
}
