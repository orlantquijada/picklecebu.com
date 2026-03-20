import { ADVANTAGES } from "#/lib/constants";

export function WhyPickleCebu() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground italic">
          Why PickleCebu
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {ADVANTAGES.map((adv) => (
            <div key={adv.title} className="space-y-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <adv.icon className="size-5 text-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {adv.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {adv.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
