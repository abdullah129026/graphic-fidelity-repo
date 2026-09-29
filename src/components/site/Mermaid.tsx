import { useEffect, useId, useRef, useState } from "react";

export default function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
          themeVariables: {
            background: "transparent",
            primaryColor: "#242b34",
            primaryTextColor: "#e9ecf1",
            primaryBorderColor: "#3a424e",
            lineColor: "#7a8595",
            secondaryColor: "#2b333d",
            tertiaryColor: "#1d232b",
            clusterBkg: "#1d232b",
            fontSize: "13px",
          },
        });
        const { svg } = await mermaid.render(`m-${id}`, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Diagram failed to render");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <p className="rounded-lg border border-destructive/40 bg-code p-4 text-sm text-destructive">
        {error}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-code p-4 sm:p-6">
      <div ref={ref} className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full" />
    </div>
  );
}
