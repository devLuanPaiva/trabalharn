import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@/components/legal/PrivacyPolicyPage';

export const metadata: Metadata = {
  title: 'TrabalhaRN — Política de Privacidade',
  description: 'Como o TrabalhaRN trata dados pessoais de quem visita a página.',
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
