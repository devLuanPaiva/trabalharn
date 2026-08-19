import Image from 'next/image';
import { getContactChannels } from '@/lib/site/contact';

export function HeroSection() {
  const { instagram } = getContactChannels();

  return (
    <section id="top" className="bg-brand-green">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 text-center md:flex-row md:text-left">
        <div className="flex-1">
          <span className="inline-block rounded-full bg-brand-yellow px-4 py-1 text-xs font-bold uppercase tracking-wide text-brand-ink">
            Rio Grande do Norte
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
            Vagas de emprego de verdade, perto de você.
          </h1>
          <p className="mt-4 max-w-xl text-2xl font-medium text-white">
            O TrabalhaRN reúne oportunidades reais em Natal, Mossoró, Parnamirim e em todo o Rio Grande do Norte —
            direto no seu celular, sem enrolação.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
            <a
              href="#vagas"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-green transition-colors hover:bg-white/90"
            >
              Ver vagas abertas
            </a>
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Seguir no Instagram
            </a>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Image src="/brand/simbolo-disco-branco.png" alt="Símbolo do TrabalhaRN" width={220} height={220} priority />
        </div>
      </div>
    </section>
  );
}
