import { STEPS } from "#/lib/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/50 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground italic">
            Simple process
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            How it works
          </h2>
        </div>

        {/* Desktop timeline */}
        <div className="relative hidden md:flex md:justify-between">
          {/* Connecting line */}
          <div
            aria-hidden="true"
            className="absolute top-7 left-[16%] right-[16%] h-0.5 bg-border"
          />

          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative z-10 flex flex-1 flex-col items-center text-center"
            >
              {/* Lime circle */}
              <div className="flex size-14 items-center justify-center rounded-full bg-lime">
                <span className="text-xl font-bold text-lime-foreground">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-5 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mx-auto mt-1.5 max-w-[220px] text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile layout */}
        <div className="space-y-8 md:hidden">
          {STEPS.map((step) => (
            <div key={step.number} className="flex items-start gap-4">
              {/* Circle */}
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime">
                <span className="text-sm font-bold text-lime-foreground">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="pt-0.5">
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
