import { getContactChannels } from '@/lib/site/contact';

interface EmployerStep {
  title: string;
  description: string;
}

const EMPLOYER_STEPS: EmployerStep[] = [
  {
    title: 'Envie os dados da vaga',
    description: 'Cargo, cidade, salário, horário e como o candidato deve se candidatar.',
  },
  {
    title: 'A gente publica pra você',
    description: 'A vaga entra no feed do Instagram e na lista de vagas do site.',
  },
  {
    title: 'Os candidatos chegam até você',
    description: 'Quem se interessar aplica direto pelo canal que a empresa informou.',
  },
];

export function EmployerCtaSection() {
  const { instagram } = getContactChannels();

  return (
    <section id="empresas" className="bg-brand-ink text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">Sua empresa está contratando no RN?</h2>
          <p className="mt-2 text-white/80">
            Anuncie a vaga com a gente e alcance quem está procurando emprego na sua cidade.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {EMPLOYER_STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-white/15 p-6">
              <span className="text-sm font-bold text-brand-yellow">Passo {index + 1}</span>
              <h3 className="mt-2 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-white/70">{step.description}</p>
            </li>
          ))}
        </ol>

        <a
          href={instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-yellow/90"
        >
          Anunciar vaga pelo Instagram
        </a>
      </div>
    </section>
  );
}
