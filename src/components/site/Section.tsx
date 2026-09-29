import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "-40px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-visible={visible} className={cn("reveal-on-scroll", className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-5 py-14 sm:py-20", className)}>
      {(eyebrow || title || description) && (
        <Reveal className="mb-8 max-w-2xl sm:mb-12">
          {eyebrow && (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          )}
          {description && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </Reveal>
      )}
      {children}
    </section>
  );
}
