import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Play, Loader2, Check, X, FileCode2, Terminal } from "lucide-react";
import { Section } from "@/components/site/Section";
import { interviewQuestion } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/interviewer")({
  head: () => ({
    meta: [
      { title: "AI Technical Interviewer & Sandboxed Evaluator | CodeMentor AI" },
      {
        name: "description",
        content:
          "Questions generated from the ingested repository, answers executed in a Docker sandbox against test cases, and scored on correctness, efficiency and style.",
      },
      { property: "og:title", content: "CodeMentor AI — AI Interviewer" },
      {
        property: "og:description",
        content:
          "A repository-grounded technical interview with sandboxed execution and automated LLM scoring.",
      },
    ],
  }),
  component: InterviewerPage,
});

function InterviewerPage() {
  const q = interviewQuestion;
  const [code, setCode] = useState(q.starter);
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [shown, setShown] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setState("running");
    setShown(0);
    q.tests.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(i + 1), 500 * (i + 1)));
    });
    timers.current.push(setTimeout(() => setState("done"), 500 * q.tests.length + 700));
  };

  const passed = q.tests.filter((t) => t.passed).length;

  return (
    <Section
      eyebrow="Module E"
      title="AI interviewer & sandboxed evaluator"
      description="Questions are generated from the ingested repository. Answers run inside a Docker container against hidden test cases, then an LLM judges correctness, efficiency and style."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Question + editor */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                Question 1 of 4
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-code px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Mic className="size-3.5" /> Answer by voice
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{q.prompt}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded border border-primary/35 bg-code px-2 py-1 font-mono text-[11px] text-primary">
              <FileCode2 className="size-3" />
              <span className="max-w-[18rem] truncate">{q.source.path}</span>
              <span className="text-muted-foreground">:{q.source.lines}</span>
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="font-mono text-[11px] text-muted-foreground">solution.js</span>
              <button
                type="button"
                onClick={run}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {state === "running" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Play className="size-3.5" />
                )}
                Run in sandbox
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={12}
              className="w-full resize-y bg-code p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-primary">
              <Terminal className="size-3.5" /> Docker sandbox
            </h3>
            {state === "idle" ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Run the solution to execute it against the hidden test cases.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {q.tests.slice(0, shown).map((t) => (
                  <li
                    key={t.name}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-code px-3 py-2"
                  >
                    <span className="flex min-w-0 items-center gap-2 font-mono text-xs">
                      {t.passed ? (
                        <Check className="size-3.5 shrink-0 text-success" />
                      ) : (
                        <X className="size-3.5 shrink-0 text-destructive" />
                      )}
                      <span className="truncate">{t.name}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {t.ms}ms
                    </span>
                  </li>
                ))}
                {state === "running" && shown < q.tests.length && (
                  <li className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" /> running tests…
                  </li>
                )}
              </ul>
            )}
            {state === "done" && (
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {passed}/{q.tests.length} test cases passed
              </p>
            )}
          </div>

          <div
            className={cn(
              "rounded-xl border border-border bg-surface p-5 transition-opacity",
              state === "done" ? "opacity-100" : "opacity-40",
            )}
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
              LLM evaluation
            </h3>
            <div className="mt-4 space-y-4">
              {q.scores.map((s) => (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="font-mono text-sm text-primary">
                      {state === "done" ? s.value : "—"}
                    </span>
                  </div>
                  <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-code">
                    <span
                      className="block h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: state === "done" ? `${s.value}%` : "0%" }}
                    />
                  </span>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
            {state === "done" && (
              <p className="mt-5 rounded-lg border border-primary/30 bg-code p-4 text-sm leading-relaxed text-foreground/90">
                {q.verdict}
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
