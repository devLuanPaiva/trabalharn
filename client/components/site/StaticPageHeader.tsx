import Image from 'next/image';
import Link from 'next/link';
import { BrandWordmark } from '@/components/brand/BrandWordmark';

interface StaticPageHeaderProps {
  subtitle?: string;
}

export function StaticPageHeader({ subtitle }: StaticPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-3.5 bg-brand-green px-6 py-4.5 text-white">
      <Link href="/" className="flex items-center gap-3.5">
        <Image src="/brand/simbolo-disco-branco.png" alt="TrabalhaRN" width={46} height={46} priority />
        <BrandWordmark tone="dark" />
      </Link>
      {subtitle ? <span className="ml-auto text-[13px] opacity-85">{subtitle}</span> : null}
    </header>
  );
}
