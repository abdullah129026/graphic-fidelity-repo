export const project = {
  title: "CodeMentor AI",
  subtitle:
    "An AI-Powered Codebase Understanding, Architecture Visualization & Technical Interview Platform",
  pitch:
    "Paste a GitHub URL. Get grounded answers with file-and-line citations, an auto-generated architecture map, and a technical interview built from the repository itself.",
  student: "Abdullah",
  program: "BS Computer Science",
  semester: "7th / 8th",
  supervisor: "—",
  date: "29 September 2026",
};

export const abstract = `Understanding an unfamiliar codebase is the biggest bottleneck for junior developers, taking 60-70% of onboarding time. Existing tools like GitHub Copilot assist in writing code but fail to explain why code is structured a certain way or how components interact. CodeMentor AI clones a repository, parses it with Tree-sitter to build an Abstract Syntax Tree, performs language-aware chunking that preserves function and class boundaries, generates embeddings, and stores them in a vector database. A Retrieval-Augmented Generation pipeline with hybrid search (semantic + BM25 keyword) lets developers chat with the codebase with file-level citations. Beyond chat, the system auto-generates architecture diagrams, provides a sandboxed Docker execution and evaluation environment, and features an AI Voice Interviewer that conducts technical interviews based on the ingested repository.`;

export const problems = [
  {
    title: "Days lost exploring repos",
    body: "Developers manually trace authentication flow, API structure and data models across thousands of files before writing a single line.",
  },
  {
    title: "Answers without proof",
    body: "General chat assistants have no private repository context and cannot point to an exact file path and line number.",
  },
  {
    title: "Understanding never becomes practice",
    body: "No integrated platform converts code comprehension into interview preparation with automated evaluation.",
  },
  {
    title: "Character-level chunking",
    body: "Existing solutions slice code by character count, destroying the logical boundaries of functions and classes.",
  },
];

export const objectives = [
  {
    icon: "GitBranch",
    title: "AST-aware ingestion",
    body: "Build a RAG pipeline that ingests any public GitHub repository with chunking that respects function and class boundaries.",
  },
  {
    icon: "Search",
    title: "Hybrid grounded Q&A",
    body: "Combine vector similarity with BM25 keyword ranking and return answers carrying exact source citations.",
  },
  {
    icon: "Workflow",
    title: "Automatic architecture maps",
    body: "Generate a system architecture diagram and dependency graph directly from the codebase structure and imports.",
  },
  {
    icon: "Mic",
    title: "AI interviewer",
    body: "Voice-driven technical interviews with coding tasks, sandboxed execution and automated scoring.",
  },
  {
    icon: "Rocket",
    title: "Deployed full-stack app",
    body: "Ship a production web application with streaming responses and persistent chat history.",
  },
];

export const modules = [
  {
    id: "A",
    name: "Ingestion Service",
    body: "GitHub URL → GitPython clone → file filtering (ignores node_modules, .git) → Tree-sitter parse → chunk by function/class with metadata for file path, start line, end line and language.",
    tech: ["GitPython", "Tree-sitter", "FastAPI"],
  },
  {
    id: "B",
    name: "Embedding & Vector Store",
    body: "Chunks are embedded with all-MiniLM-L6-v2 or text-embedding-3-small and persisted per repository in a vector store.",
    tech: ["Sentence-Transformers", "Qdrant", "FAISS", "ChromaDB"],
  },
  {
    id: "C",
    name: "RAG Chat Engine",
    body: "Query → embed → hybrid search (vector similarity + BM25 rerank) → top-k chunks → prompt builder → LLM → streamed answer with citations.",
    tech: ["LangChain", "BM25", "Groq LLaMA 3.1", "Gemini 2.5 Flash"],
  },
  {
    id: "D",
    name: "Architecture Visualizer",
    body: "The LLM analyses the file tree and import graph, emits Mermaid.js flowchart syntax, and the frontend renders it interactively.",
    tech: ["Mermaid.js", "Import graph analysis"],
  },
  {
    id: "E",
    name: "AI Interviewer & Evaluator",
    body: "Generates questions from the ingested repository, accepts voice or code answers, runs submissions in a Docker container against test cases, and has the LLM judge correctness, efficiency and style.",
    tech: ["Docker", "Whisper STT", "TTS", "LLM judge"],
  },
  {
    id: "F",
    name: "Frontend",
    body: "Streaming chat interface, Monaco code editor, diagram viewer and interview console.",
    tech: ["Next.js 14", "Tailwind CSS", "Monaco Editor"],
  },
];

export const scope = {
  included: [
    "Public GitHub repository ingestion",
    "Five languages: Python, JS/TS, Java, C++, Go",
    "RAG chat with source citations",
    "Architecture diagram generation",
    "Docker-based code execution and scoring",
    "Voice interviewer",
  ],
  excluded: [
    "Private repositories / GitHub OAuth (future work)",
    "Automatic fix and PR generation",
    "VS Code extension (future work)",
  ],
};

export const methodology = [
  { phase: "Research & Design", body: "Study Tree-sitter grammars and chunking strategies." },
  {
    phase: "Backend",
    body: "FastAPI microservices: repo_loader, parser, embedder, retriever, qa_service.",
  },
  { phase: "Vector layer", body: "Vector DB setup and hybrid search tuning." },
  { phase: "Frontend", body: "Streaming API integration and chat UI." },
  { phase: "Interviewer", body: "Docker sandbox, voice loop and LLM scoring." },
  { phase: "Testing", body: "Retrieval accuracy (Precision@k) and answer groundedness." },
  { phase: "Deployment", body: "Vercel frontend with Render backend services." },
];

export const algorithms = [
  "AST Parsing",
  "Language-Aware Chunking",
  "Cosine Similarity",
  "BM25",
  "Hybrid Retrieval",
  "RAG",
];

export const stack = [
  { group: "Languages", items: ["Python", "TypeScript"] },
  { group: "Frontend", items: ["Next.js 14", "Tailwind CSS", "Monaco Editor", "Mermaid.js"] },
  { group: "Backend", items: ["FastAPI", "LangChain", "GitPython"] },
  {
    group: "AI / ML",
    items: [
      "Tree-sitter",
      "Sentence-Transformers",
      "Qdrant / FAISS / ChromaDB",
      "Groq API",
      "Gemini API",
      "Whisper (STT)",
      "ElevenLabs / OpenAI TTS",
    ],
  },
  { group: "DevOps", items: ["Docker", "Git", "GitHub Actions"] },
  { group: "Other", items: ["Redis caching"] },
];

export const deliverables = [
  "Deployed web app where anyone can chat with a GitHub repository.",
  "REST API documentation for ingestion and Q&A.",
  "Demo video: ingest facebook/react → ask how hooks work → cited answer, diagram and interview.",
  "Final report with architecture and evaluation metrics.",
];
