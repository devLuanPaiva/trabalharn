import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/not-found/NotFoundPage';

export const metadata: Metadata = {
  title: 'TrabalhaRN — Página não encontrada',
  description: 'A página que você tentou acessar não existe ou foi movida.',
};

export default function NotFound() {
  return <NotFoundPage />;
}
