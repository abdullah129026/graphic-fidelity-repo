import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GitBranch,
  Search,
  Workflow,
  Mic,
  Rocket,
  ArrowRight,
  Check,
  X,
  FileCode2,
} from "lucide-react";
import { Section, Reveal } from "@/components/site/Section";
import {
  project,
  abstract,
  problems,
  objectives,
  modules,
  scope,
  methodology,
  algorithms,
  stack,
  deliverables,
} from "@/data/project";

const icons = { GitBranch, Search, Workflow, Mic, Rocket } as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeMentor AI — Chat with any codebase, see its architecture, interview on it" },
      {
        name: "description",
        content:
          "Final year project: an AST-aware RAG platform that answers questions about any GitHub repository with file-and-line citations, generates architecture diagrams, and runs AI technical interviews.",
      },
      {
        property: "og:title",
        content: "CodeMentor AI — Codebase Understanding & Interview Platform",
      },
      {
        property: "og:description",
        content:
          "AST-aware chunking, hybrid retrieval, cited answers, auto-generated architecture diagrams and a sandboxed AI interviewer.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-35" />
        <div className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Final Year Project · BS Computer Science
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              CodeMentor <span className="text-primary">AI</span>
            </h1>
            <p className="mt-4 max-w-3xl text-base text-foreground/90 sm:text-xl">
              {project.subtitle}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {project.pitch}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Try the live demo <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/architecture"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                View architecture
              </Link>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Student", project.student],
                ["Program", `${project.program} · Sem ${project.semester}`],
                ["Supervisor", project.supervisor],
                ["Date", project.date],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface px-5 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* Abstract */}
      <Section eyebrow="Abstract" title="What the system does">
        <Reveal>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {abstract}
          </p>
        </Reveal>
      </Section>

      {/* Problem */}
      <Section
        eyebrow="Problem statement"
        title="Why understanding code is still the bottleneck"
        description="Onboarding, code review and interviews all need deep contextual understanding that general assistants cannot provide."
        className="border-y border-border bg-surface/40"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {problems.map((p, i) => (
            <Reveal key={p.title}>
              <div className="h-full rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40">
                <span className="font-mono text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Objectives */}
      <Section eyebrow="Objectives" title="Five things this project sets out to prove">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {objectives.map((o) => {
            const Icon = icons[o.icon as keyof typeof icons];
            return (
              <Reveal key={o.title}>
                <div className="h-full rounded-xl border border-border bg-surface p-5">
                  <span className="flex size-9 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <h3 className="mt-3.5 text-base font-semibold">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Modules */}
      <Section
        eyebrow="Proposed solution"
        title="Six modules, one pipeline"
        description="From a GitHub URL to a cited answer, a rendered diagram and a scored interview."
        className="border-y border-border bg-surface/40"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {modules.map((m) => (
            <Reveal key={m.id}>
              <div className="flex h-full gap-4 rounded-xl border border-border bg-surface p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-code font-mono text-sm font-semibold text-primary">
                  {m.id}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{m.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-border bg-code px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Scope */}
      <Section eyebrow="Scope" title="What is in, and what is deliberately out">
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-xl border border-success/30 bg-surface p-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-success">
                Included
              </h3>
              <ul className="mt-4 space-y-2.5">
                {scope.included.map((s) => (
                  <li key={s} className="flex gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="h-full rounded-xl border border-border bg-surface p-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Excluded
              </h3>
              <ul className="mt-4 space-y-2.5">
                {scope.excluded.map((s) => (
                  <li key={s} className="flex gap-2.5 text-sm text-muted-foreground">
                    <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Methodology */}
      <Section
        eyebrow="Methodology"
        title="Agile Scrum on top of a RAG engineering pipeline"
        className="border-y border-border bg-surface/40"
      >
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {methodology.map((m, i) => (
            <div key={m.phase} className="bg-surface p-5">
              <span className="font-mono text-[11px] text-primary">
                Phase {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1.5 text-sm font-semibold">{m.phase}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
            </div>
          ))}
        </div>
        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Algorithms
            </span>
            {algorithms.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border bg-code px-3 py-1 font-mono text-[11px]"
              >
                {a}
              </span>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Stack */}
      <Section eyebrow="Tools & technologies" title="The stack">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((s) => (
            <Reveal key={s.group}>
              <div className="h-full rounded-xl border border-border bg-surface p-5">
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  {s.group}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {s.items.map((i) => (
                    <li key={i} className="font-mono text-sm text-muted-foreground">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Deliverables */}
      <Section
        eyebrow="Expected outcomes"
        title="Deliverables"
        className="border-t border-border bg-surface/40"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {deliverables.map((d) => (
            <Reveal key={d}>
              <div className="flex h-full gap-3 rounded-xl border border-border bg-surface p-5">
                <FileCode2 className="mt-0.5 size-4.5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <div className="flex flex-col items-start gap-4 rounded-xl border border-primary/30 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              See the pipeline in action on a real repository.
            </p>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open the demo <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
