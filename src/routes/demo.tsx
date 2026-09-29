import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Github, Loader2, Check, Send, FileCode2, Sparkles } from "lucide-react";
import { Section } from "@/components/site/Section";
import { sampleRepo, ingestStages, demoQA, type DemoQA } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Live Demo — Chat with a GitHub repository | CodeMentor AI" },
      {
        name: "description",
        content:
          "Walk through ingestion, AST-aware chunking, hybrid retrieval and a grounded answer with file-and-line citations on a real repository.",
      },
      { property: "og:title", content: "CodeMentor AI — Live Demo" },
      {
        property: "og:description",
        content:
          "Ingest a repository, ask a question, and see the retrieved chunks and citations behind the answer.",
      },
    ],
  }),
  component: DemoPage,
});

type Msg = { role: "user" | "assistant"; text: string; qa?: DemoQA; typing?: boolean };

function DemoPage() {
  const [repo, setRepo] = useState(sampleRepo);
  const [stage, setStage] = useState(-1);
  const [ingested, setIngested] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [active, setActive] = useState<DemoQA | null>(null);
  const [typed, setTyped] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runIngest = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setIngested(false);
    setMessages([]);
    setActive(null);
    setTyped("");
    setStage(0);
    let acc = 0;
    ingestStages.forEach((s, i) => {
      acc += s.ms;
      timers.current.push(
        setTimeout(() => {
          if (i === ingestStages.length - 1) setIngested(true);
          setStage(i + 1);
        }, acc),
      );
    });
  };

  const ask = (qa: DemoQA) => {
    if (!ingested || (active && typed.length < active.answer.length)) return;
    setMessages((m) => [...m, { role: "user", text: qa.question }]);
    setActive(qa);
    setTyped("");
    setMessages((m) => [...m, { role: "assistant", text: "", qa, typing: true }]);
  };

  useEffect(() => {
    if (!active) return;
    if (typed.length >= active.answer.length) {
      setMessages((m) =>
        m.map((msg) => (msg.typing ? { ...msg, text: active.answer, typing: false } : msg)),
      );
      return;
    }
    const t = setTimeout(() => setTyped(active.answer.slice(0, typed.length + 4)), 12);
    return () => clearTimeout(t);
  }, [active, typed]);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typed]);

  const progress = stage < 0 ? 0 : Math.round((stage / ingestStages.length) * 100);

  return (
    <Section
      eyebrow="Module A + B + C"
      title="Live demo — chat with a GitHub repository"
      description="Ingest a public repository, then ask a question and inspect the retrieved chunks and citations behind every answer. This demo replays recorded output so it works reliably offline."
    >
      {/* Ingest panel */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <label
          htmlFor="repo"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          Repository URL
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-code px-3">
            <Github className="size-4 shrink-0 text-muted-foreground" />
            <input
              id="repo"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full bg-transparent py-2.5 font-mono text-sm outline-none placeholder:text-muted-foreground"
              placeholder="https://github.com/owner/repo"
            />
          </div>
          <button
            type="button"
            onClick={runIngest}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {stage >= 0 && !ingested ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {ingested ? "Re-ingest" : "Ingest repository"}
          </button>
        </div>

        {stage >= 0 && (
          <div className="mt-5">
            <div className="h-1 w-full overflow-hidden rounded-full bg-code">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ul className="mt-4 space-y-2">
              {ingestStages.map((s, i) => {
                const done = stage > i;
                const running = stage === i;
                return (
                  <li
                    key={s.label}
                    className={cn(
                      "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs",
                      done ? "text-foreground" : running ? "text-primary" : "text-muted-foreground/50",
                    )}
                  >
                    <span className="flex size-4 items-center justify-center">
                      {done ? (
                        <Check className="size-3.5 text-success" />
                      ) : running ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span className="min-w-0">{s.label}</span>
                    {(done || running) && (
                      <span className="text-muted-foreground">— {s.detail}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Chat + retrieval */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex min-h-[26rem] flex-col rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <span className="size-2 rounded-full bg-primary" />
            <span className="font-mono text-xs text-muted-foreground">
              RAG chat · hybrid retrieval · streamed
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {!ingested && (
              <p className="text-sm text-muted-foreground">
                Ingest the repository first, then pick a question below.
              </p>
            )}
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] rounded-lg rounded-br-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={i} className="max-w-[95%]">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                    {m.typing ? typed : m.text}
                    {m.typing && <span className="ml-0.5 inline-block animate-pulse">▋</span>}
                  </p>
                  {!m.typing && m.qa && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.qa.citations.map((c) => (
                        <span
                          key={c.path + c.lines}
                          className="inline-flex items-center gap-1.5 rounded border border-primary/35 bg-code px-2 py-1 font-mono text-[11px] text-primary"
                        >
                          <FileCode2 className="size-3" />
                          <span className="max-w-[16rem] truncate">{c.path}</span>
                          <span className="text-muted-foreground">:{c.lines}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
            <div ref={logEnd} />
          </div>

          <div className="border-t border-border p-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {demoQA.map((qa) => (
                <button
                  key={qa.question}
                  type="button"
                  disabled={!ingested}
                  onClick={() => ask(qa)}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-code px-3 py-2 text-left text-xs transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="size-3 shrink-0" />
                  {qa.question}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
            Retrieved chunks
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Top-k results after cosine similarity and BM25 reranking.
          </p>

          {!active && (
            <p className="mt-6 text-sm text-muted-foreground">
              Ask a question to see which parts of the repository grounded the answer.
            </p>
          )}

          <div className="mt-4 space-y-3">
            {active?.chunks.map((c) => (
              <div key={c.path + c.lines} className="rounded-lg border border-border bg-code p-3">
                <p className="break-all font-mono text-[11px] text-foreground">
                  {c.path}
                  <span className="text-muted-foreground">:{c.lines}</span>
                </p>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed text-muted-foreground">
                  {c.preview}
                </pre>
                <div className="mt-3 space-y-1.5">
                  <ScoreBar label="cosine" value={c.vector} tone="primary" />
                  <ScoreBar label="bm25" value={c.bm25} tone="accent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function ScoreBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "accent";
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 font-mono text-[10px] uppercase text-muted-foreground">{label}</span>
      <span className="h-1 flex-1 overflow-hidden rounded-full bg-surface-raised">
        <span
          className={cn("block h-full rounded-full", tone === "primary" ? "bg-primary" : "bg-accent")}
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </span>
      <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">
        {value.toFixed(2)}
      </span>
    </div>
  );
}
