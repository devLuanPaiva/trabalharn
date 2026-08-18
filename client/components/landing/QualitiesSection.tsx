interface Quality {
  emoji: string;
  title: string;
  description: string;
}

const QUALITIES: Quality[] = [
  {
    emoji: '📍',
    title: 'Feito pro Rio Grande do Norte',
    description: 'Vagas em Natal, Mossoró, Parnamirim e no interior — não só na capital.',
  },
  {
    emoji: '⚡',
    title: 'Sempre atualizado',
    description: 'Vagas novas com frequência, direto das empresas que estão contratando.',
  },
  {
    emoji: '📱',
    title: 'Direto do seu celular',
    description: 'Veja a função, o salário e como se candidatar sem precisar baixar nada.',
  },
  {
    emoji: '✅',
    title: 'Sem pegadinha',
    description: 'Mostramos só o que a empresa informou — sem letra miúda escondida.',
  },
  {
    emoji: '🆓',
    title: 'Grátis pra quem procura emprego',
    description: 'Nunca cobramos nada de quem está buscando uma vaga.',
  },
  {
    emoji: '💬',
    title: 'Gente de verdade por trás da página',
    description: 'Dá pra falar com a gente pelo Instagram sempre que precisar.',
  },
];

export function QualitiesSection() {
  return (
    <section id="qualidades" className="mx-auto max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <h2 className="text-3xl font-bold text-brand-ink">Por que usar o TrabalhaRN</h2>
        <p className="mt-2 text-brand-muted">Uma página feita pra quem procura emprego de verdade no RN.</p>
      </header>

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {QUALITIES.map((quality) => (
          <li key={quality.title} className="rounded-2xl border border-brand-divider bg-white p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-2xl">
              {quality.emoji}
            </span>
            <h3 className="mt-4 font-bold text-brand-ink">{quality.title}</h3>
            <p className="mt-2 text-sm text-brand-muted">{quality.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
