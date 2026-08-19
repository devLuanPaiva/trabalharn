export interface LegalLink {
  href: string;
  label: string;
}

export const LEGAL_LINKS: LegalLink[] = [
  { href: '/politicas-de-privacidade', label: 'Política de Privacidade' },
  { href: '/termos-e-servicos', label: 'Termos e Serviços' },
  { href: '/exclusao-de-dados', label: 'Exclusão de Dados' },
];
