import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['500', '700'],
});

export const metadata: Metadata = {
  title: 'TrabalhaRN — Gerador de posts',
  description: 'Gere artes de feed, story e legenda para vagas de emprego do TrabalhaRN.',
};

export default function GeradorDePostsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${poppins.variable} font-[family-name:var(--font-poppins)]`}>{children}</div>;
}
