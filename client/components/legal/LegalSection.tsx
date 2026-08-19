import type { ReactNode } from 'react';
import { legalContentClassNames as c } from './legal-content-class-names';

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className={c.section}>
      <h2 className={c.heading}>{title}</h2>
      {children}
    </section>
  );
}
