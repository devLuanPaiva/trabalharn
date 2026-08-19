import Link from 'next/link';
import { SiteFooter } from '@/components/site/SiteFooter';
import { StaticPageHeader } from '@/components/site/StaticPageHeader';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F2F5F3] text-brand-ink">
      <StaticPageHeader />
      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-[15px] font-bold uppercase tracking-[2px] text-brand-green">Erro 404</p>
        <h1 className="mt-2 text-[26px] font-bold text-brand-ink">Página não encontrada</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-ink/80">
          O endereço que você tentou acessar não existe ou foi movido. Volte para o início e continue sua busca por
          vagas no RN.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-brand-green px-6 py-3 text-[14px] font-bold text-white transition hover:opacity-90"
        >
          Voltar para o início
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
