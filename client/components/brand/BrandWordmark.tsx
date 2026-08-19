interface BrandWordmarkProps {
  tone: 'light' | 'dark';
}

export function BrandWordmark({ tone }: BrandWordmarkProps) {
  const baseTextClassName = tone === 'dark' ? 'text-white' : 'text-brand-ink';
  const accentClassName = tone === 'dark' ? 'text-brand-yellow' : 'text-brand-green';

  return (
    <span className={`text-[22px] font-bold tracking-tight ${baseTextClassName}`}>
      Trabalha<i className={`not-italic ${accentClassName}`}>RN</i>
    </span>
  );
}
