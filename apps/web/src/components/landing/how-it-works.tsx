import { STEPS } from "#/lib/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground italic">
          How it works
        </p>

        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              {/* Step number */}
              <span className="mb-3 inline-block text-4xl font-bold text-lime">
                {step.number}
              </span>
              <div className="mb-2 flex items-center gap-2">
                <step.icon className="size-5 text-muted-foreground" />
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
