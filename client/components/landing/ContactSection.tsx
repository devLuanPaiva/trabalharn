import { ContactChannel, getContactChannels } from '@/lib/site/contact';

export function ContactSection() {
  const { instagram, whatsapp, email } = getContactChannels();
  const channels: ContactChannel[] = [instagram, whatsapp, email].filter(
    (channel): channel is ContactChannel => channel !== null,
  );

  return (
    <section id="contato" className="mx-auto max-w-6xl bg-white px-6 py-16">
      <header className="max-w-2xl">
        <h2 className="text-3xl font-bold text-brand-ink">Fala com a gente</h2>
        <p className="mt-2 text-brand-muted">Dúvidas, vagas ou parcerias — escolha o canal que preferir.</p>
      </header>

      <ul className="mt-8 flex flex-wrap gap-4">
        {channels.map((channel) => (
          <li key={channel.href}>
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand-divider bg-white px-5 py-3 text-sm font-medium text-brand-ink transition-colors hover:border-brand-green hover:text-brand-green"
            >
              {channel.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
