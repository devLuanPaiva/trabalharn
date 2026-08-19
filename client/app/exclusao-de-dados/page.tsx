import type { Metadata } from 'next';
import { DataDeletionPage } from '@/components/legal/DataDeletionPage';

export const metadata: Metadata = {
  title: 'TrabalhaRN — Exclusão de Dados',
  description: 'Como pedir a exclusão de dados pessoais compartilhados com o TrabalhaRN.',
};

export default function Page() {
  return <DataDeletionPage />;
}
