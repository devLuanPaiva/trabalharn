import type { Metadata } from 'next';
import { TermsOfServicePage } from '@/components/legal/TermsOfServicePage';

export const metadata: Metadata = {
  title: 'TrabalhaRN — Termos e Serviços',
  description: 'Regras de uso do TrabalhaRN e responsabilidade sobre as vagas divulgadas.',
};

export default function Page() {
  return <TermsOfServicePage />;
}
