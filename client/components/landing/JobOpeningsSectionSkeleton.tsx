const SKELETON_CARD_COUNT = 3;

export function JobOpeningsSectionSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-8 w-64 animate-pulse rounded bg-brand-divider" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
          <div key={index} className="h-48 animate-pulse rounded-2xl bg-brand-divider" />
        ))}
      </div>
    </section>
  );
}
