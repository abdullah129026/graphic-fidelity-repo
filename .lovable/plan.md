# CodeMentor AI — Project Showcase Site

A responsive presentation website for your final year project. It walks a supervisor through every objective in the proposal, and includes an interactive mock of the "chat with a GitHub repo" experience so the idea is visible, not just described.

Nothing calls a real AI service or GitHub in this version — the demo uses scripted sample content for a well-known repo so it always works during a live presentation.

## Pages

**Home (/)**
- Hero: project title, one-line pitch, student and supervisor details, date.
- The problem: the four points from the problem statement, as cards.
- Objectives: five objective cards with icons.
- Modules A–F: ingestion, embedding/vector store, RAG chat, architecture visualizer, AI interviewer, frontend — each with a short description and its key technologies.
- Scope: two columns, included vs excluded.
- Methodology and timeline strip.
- Tech stack grid grouped by category.
- Expected deliverables.

**Live Demo (/demo)**
- Repo URL field pre-filled with a sample repository, plus an "Ingest" action that plays a staged progress animation (clone → parse → chunk → embed → index) with file and chunk counts.
- Chat panel: pick from suggested questions such as "How do hooks work?" and see a typed-out answer with file-path and line-number citation chips.
- Retrieval panel showing the top matching chunks with similarity and keyword scores, illustrating hybrid search.

**Architecture (/architecture)**
- Rendered system architecture diagram and a dependency-graph view (Mermaid).
- Pipeline explanation from URL to cited answer.

**AI Interviewer (/interviewer)**
- Mock interview flow: generated question from the repo, a code answer area, a "run in sandbox" result panel with test cases, and a scored evaluation card (correctness, efficiency, style).

Shared header navigation and footer across all pages, working on phone, tablet and desktop.

## Design

Developer-tool aesthetic: dark editor-inspired surface, monospace accents for code and citations, one strong accent colour, generous spacing, subtle motion on scroll. Not a generic purple gradient template.

## Technical notes

- TanStack Start routes: `index`, `demo`, `architecture`, `interviewer`; each with its own page metadata.
- Design tokens added to `src/styles.css`; no hardcoded colour utilities.
- Mermaid rendered client-side only, loaded after hydration.
- Demo data lives in typed local modules so it is easy to swap for real endpoints later.

## Not in this build

Real repository cloning, embeddings, vector search, Docker execution, and voice — those stay as described content. Say the word if you later want the chat wired to a real model.
