import { SignInButton } from "@/components/sign-in-button";

const benefits = [
  {
    number: "01",
    title: "Get started faster",
    description: "Drop in a ready-made skill and skip the blank-page setup.",
  },
  {
    number: "02",
    title: "Get better results",
    description: "Use agents tuned by people who actually do the work.",
  },
  {
    number: "03",
    title: "Share what you build",
    description: "Publish once and help your whole team move quicker.",
  },
] as const;

export function SignedOutHero() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
          Community library
        </span>
        <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Share the skills and agents that make your work click.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Discover battle-tested skills and agents from the community — or publish your own
          and help everyone move faster.
        </p>
        <SignInButton label="Sign in to get started" size="lg" className="mt-8" />
      </section>

      <section className="border-t bg-muted/40 px-6 py-16">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Why share?
        </p>
        <div className="mx-auto mt-10 grid max-w-4xl gap-10 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.number} className="flex flex-col items-center text-center">
              <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-sm text-primary">
                {benefit.number}
              </span>
              <h2 className="mt-4 font-semibold">{benefit.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
