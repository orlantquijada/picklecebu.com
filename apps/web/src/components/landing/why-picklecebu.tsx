import { ADVANTAGES } from "#/lib/constants";

const WATERMARKS = ["01", "02", "03"];

export function WhyPickleCebu() {
  return (
    <section className="bg-surface-dark py-20 text-surface-dark-foreground md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-surface-dark-foreground/50 italic">
            The advantage
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Why book with PickleCebu?
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {ADVANTAGES.map((adv, i) => (
            <div key={adv.title} className="relative text-center">
              {/* Watermark number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[120px] font-bold leading-none text-surface-dark-foreground/[0.03]"
              >
                {WATERMARKS[i]}
              </span>

              {/* Icon */}
              <div className="relative mx-auto flex size-14 items-center justify-center rounded-xl bg-lime/15">
                <adv.icon className="size-6 text-lime" />
              </div>

              {/* Text */}
              <h3 className="relative mt-5 text-lg font-semibold">
                {adv.title}
              </h3>
              <p className="relative mt-1.5 text-sm text-surface-dark-foreground/60">
                {adv.description}
              </p>
            </div>
          ))}
        </div>

        {/* Accent bar */}
        <div className="mx-auto mt-14 h-1 w-16 rounded-full bg-lime" />
      </div>
    </section>
  );
}
