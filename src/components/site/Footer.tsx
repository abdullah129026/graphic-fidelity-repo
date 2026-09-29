import { project } from "@/data/project";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs">
          {project.title} — Final Year Project · {project.program}
        </p>
        <p className="text-xs">
          {project.student} · Semester {project.semester} · {project.date}
        </p>
      </div>
    </footer>
  );
}
