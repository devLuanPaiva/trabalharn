import Image from 'next/image';
import { BrandWordmark } from '@/components/brand/BrandWordmark';

export function BrandLogoHeader() {
  return (
    <header className="flex items-center gap-3.5 bg-brand-green px-6 py-4.5 text-white">
      <Image src="/brand/simbolo-disco-branco.png" alt="TrabalhaRN" width={46} height={46} priority />
      <BrandWordmark tone="dark" />
      <span className="ml-auto text-[13px] opacity-85">Gerador de posts · 1080×1350 e 1080×1920</span>
    </header>
  );
}
