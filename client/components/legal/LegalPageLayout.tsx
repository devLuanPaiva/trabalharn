import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/SiteFooter';
import { StaticPageHeader } from '@/components/site/StaticPageHeader';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F2F5F3] text-brand-ink">
      <StaticPageHeader subtitle={title} />
      <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-10">
        <article className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(10,50,25,0.1)] sm:p-10">
          <h1 className="text-[26px] font-bold text-brand-ink">{title}</h1>
          <p className="mt-1.5 text-[13px] text-brand-muted">Última atualização: {lastUpdated}</p>
          <div className="mt-8 space-y-8">{children}</div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
